package main

import (
	"bytes"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"text/template"
)

//go:generate go run ./internal/genfunctions

// functionFiles contains compiled JavaScript functions that every docs site should deploy
// Embedding keeps consumers from needing local api/ files or an npm package dependency
// Regenerate these files with go generate ./cmd/vercel-docs-build
//
//go:embed functions/pls-api/*.js functions/pls-script/*.js
var functionFiles embed.FS

const (
	// Default runtime on Vercel
	defaultVercelRuntime = "nodejs24.x"

	outputDir = ".vercel/output"
	staticDir = ".vercel/output/static"

	// docsMetadataFile is the optional project metadata the builder turns into hugo.toml
	docsMetadataFile = "docs.json"
	// hugoConfigFile is generated from docsMetadataFile when present, then read by Hugo
	hugoConfigFile = "hugo.toml"
	// themeImportPath is the Hugo module every generated config imports
	themeImportPath = "github.com/italypaleale/hugo-assets"
)

// vercelJSON models the subset of vercel.json that this builder preserves
// The project-level vercel.json is the source of truth for headers, and the hook
// through which projects add their own redirects and rewrites to the output config
type vercelJSON struct {
	Headers   []vercelHeader   `json:"headers"`
	Redirects []vercelRedirect `json:"redirects"`
	Rewrites  []vercelRewrite  `json:"rewrites"`
}

// vercelRedirect models one redirect rule from the consumer project's vercel.json
// Source is treated as a regex, mirroring how header rules are handled here
type vercelRedirect struct {
	Source      string `json:"source"`
	Destination string `json:"destination"`
	// Permanent selects 308 vs 307 when StatusCode is not given, matching Vercel's semantics
	Permanent *bool `json:"permanent,omitempty"`
	// StatusCode overrides Permanent when a project needs a specific redirect status
	StatusCode int `json:"statusCode,omitempty"`
}

// vercelRewrite models one rewrite rule from the consumer project's vercel.json
// Rewrites are applied in the miss phase so real files always win over a rewrite
type vercelRewrite struct {
	Source      string `json:"source"`
	Destination string `json:"destination"`
}

// vercelHeader models one header rule from the consumer project's vercel.json
// The builder translates these rules into Build Output API routes
type vercelHeader struct {
	Source  string              `json:"source"`
	Headers []vercelHeaderValue `json:"headers"`
}

// vercelHeaderValue models a single HTTP header key/value pair from vercel.json
// Keeping the shape separate mirrors Vercel's config format and avoids ad hoc JSON parsing
type vercelHeaderValue struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

// outputConfig is the top-level Build Output API config written to .vercel/output/config.json
// Vercel reads this file instead of running its normal framework/function discovery
type outputConfig struct {
	Version int           `json:"version"`
	Routes  []outputRoute `json:"routes"`
}

// outputRoute models one Build Output API route
// Routes are used for shared Plausible functions, static filesystem handling, and translated headers
type outputRoute struct {
	Source   string            `json:"src,omitempty"`
	Dest     string            `json:"dest,omitempty"`
	Headers  map[string]string `json:"headers,omitempty"`
	Status   int               `json:"status,omitempty"`
	Continue bool              `json:"continue,omitempty"`
	Handle   string            `json:"handle,omitempty"`
}

// functionConfig is the minimal .vc-config.json shape Vercel needs for a Node function
// Each generated function directory gets one of these files next to index.js
type functionConfig struct {
	Runtime      string `json:"runtime"`
	Handler      string `json:"handler"`
	LauncherType string `json:"launcherType"`
}

func main() {
	// Run the build as a small command so consumers can invoke it from shell scripts
	err := run()
	if err != nil {
		// Print a short prefixed error so Vercel logs point at the shared builder
		fmt.Fprintln(os.Stderr, "vercel-docs-build:", err)
		os.Exit(1)
	}
}

// run orchestrates the full docs build
// It emits Vercel Build Output API files instead of relying on Vercel project source discovery
func run() error {
	// Hugo must be available because it renders the static documentation site
	err := requireCommand("hugo")
	if err != nil {
		return err
	}

	// Generate hugo.toml from the project's metadata before Hugo reads it, when opted in
	err = writeHugoConfig()
	if err != nil {
		return err
	}

	// Start from a clean Build Output API directory so stale files cannot survive between builds
	err = os.RemoveAll(outputDir)
	if err != nil {
		return fmt.Errorf("remove output directory: %w", err)
	}

	// Create the static output directory before invoking Hugo with it as the destination
	err = os.MkdirAll(staticDir, 0o755)
	if err != nil {
		return fmt.Errorf("create static output directory: %w", err)
	}

	// Log the Hugo version in deployment output because Hugo module behavior can depend on it
	err = runCommand("hugo", "version")
	if err != nil {
		return err
	}

	// Build Hugo directly into the Build Output API static directory
	// This avoids creating public/ and then copying it into .vercel/output/static
	err = runCommand("hugo", "--environment=production", "--minify", "--destination", staticDir)
	if err != nil {
		return err
	}

	// Remove files that are useful in source trees but should not be served as site assets
	err = cleanPublishedFiles(staticDir)
	if err != nil {
		return err
	}

	// Emit shared Vercel functions from embedded compiled JavaScript sources
	err = writeFunctions()
	if err != nil {
		return err
	}

	// Emit the Build Output API config that wires headers, functions, and static files together
	err = writeOutputConfig()
	if err != nil {
		return err
	}

	return nil
}

// requireCommand checks that a required executable is visible on PATH
// It fails early with a clear error before later build steps produce less direct failures
func requireCommand(name string) error {
	// exec.LookPath mirrors how exec.Command will resolve the binary later
	_, err := exec.LookPath(name)
	if err != nil {
		return fmt.Errorf("missing required command %q: %w", name, err)
	}

	return nil
}

// runCommand runs a subprocess and streams its output directly to the caller
// Streaming keeps Vercel logs useful for Hugo module downloads and build diagnostics
func runCommand(name string, args ...string) error {
	// Build the command with inherited standard streams so interactive diagnostics are not hidden
	cmd := exec.Command(name, args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.Env = os.Environ()

	// Include the command line in failures so deployment logs show which external tool failed
	err := cmd.Run()
	if err != nil {
		return fmt.Errorf("run %s %s: %w", name, strings.Join(args, " "), err)
	}

	return nil
}

// cleanPublishedFiles irrelevant files from generated static output
// Hugo can copy these from static mounts, but they are not intended to be public web assets
func cleanPublishedFiles(root string) error {
	// Walk the generated static tree so nested .gitignore files from mounted modules are also removed
	return filepath.WalkDir(root, func(path string, d fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			// Propagate walk errors with the original path context from filepath.WalkDir
			return walkErr
		}

		if d.IsDir() {
			// Directories are kept so the walk can continue into their children
			return nil
		}

		// Remove files with known unwanted names
		name := d.Name()
		if name == ".gitignore" || strings.HasSuffix(name, ".sh") {
			err := os.Remove(path)
			if err != nil {
				return fmt.Errorf("remove %s: %w", path, err)
			}
		}

		return nil
	})
}

// writeFunctions copies embedded JavaScript into Vercel function directories
// The output matches Vercel's Build Output API function directory layout
func writeFunctions() error {
	// Map generated Vercel function names to their embedded JavaScript output directories
	functions := map[string]string{
		"pls-script": "functions/pls-script",
		"pls-api":    "functions/pls-api",
	}

	for name, sourceDir := range functions {
		// Build Output API function directories use the <name>.func convention under .vercel/output/functions
		funcDir := filepath.Join(outputDir, "functions", name+".func")
		err := os.MkdirAll(funcDir, 0o755)
		if err != nil {
			return fmt.Errorf("create function directory %s: %w", funcDir, err)
		}

		// Copy the checked-in generated handler with its inline sourcemap so deployments do not need esbuild
		err = copyEmbeddedFunctionDir(sourceDir, funcDir)
		if err != nil {
			return err
		}

		// Write the runtime metadata Vercel needs to execute the generated Node function
		err = writeJSON(filepath.Join(funcDir, ".vc-config.json"), functionConfig{
			Runtime:      nodeRuntime(),
			Handler:      "index.js",
			LauncherType: "Nodejs",
		})
		if err != nil {
			return err
		}
	}

	return nil
}

// copyEmbeddedFunctionDir copies generated JavaScript artifacts into one Vercel function directory
// Keeping this as a directory copy leaves room for future generated artifacts without changing callers
func copyEmbeddedFunctionDir(sourceDir, destDir string) error {
	// ReadDir is enough because the generator writes a flat directory with generated artifacts
	entries, err := functionFiles.ReadDir(sourceDir)
	if err != nil {
		return fmt.Errorf("read embedded function directory %s: %w", sourceDir, err)
	}

	for _, entry := range entries {
		if entry.IsDir() {
			// Generated function output is intentionally flat, so nested directories indicate generator drift
			return fmt.Errorf("unexpected directory in embedded function output: %s", filepath.Join(sourceDir, entry.Name()))
		}

		// Read each generated artifact from the embedded filesystem before writing it to Vercel output
		data, err := functionFiles.ReadFile(filepath.Join(sourceDir, entry.Name()))
		if err != nil {
			return fmt.Errorf("read embedded function artifact %s: %w", entry.Name(), err)
		}

		// Preserve the generated filename so Vercel can use the configured index.js handler
		err = os.WriteFile(filepath.Join(destDir, entry.Name()), data, 0o644)
		if err != nil {
			return fmt.Errorf("write function artifact %s: %w", entry.Name(), err)
		}
	}

	return nil
}

// nodeRuntime allows consumers to opt into a newer Vercel runtime without changing this module
func nodeRuntime() string {
	// Environment override lets individual deployments move faster than the shared module default
	runtimeName := os.Getenv("VERCEL_DOCS_NODE_RUNTIME")
	if runtimeName != "" {
		return runtimeName
	}

	return defaultVercelRuntime
}

// docsMetadata is the project-supplied input the builder turns into hugo.toml
// Only the values that vary between docs sites live here; the theme-required
// boilerplate (markup hooks, module import, taxonomies) is added by the template
type docsMetadata struct {
	BaseURL            string      `json:"baseURL"`
	Title              string      `json:"title"`
	Locale             string      `json:"locale"`
	Description        string      `json:"description"`
	PlausibleAnalytics bool        `json:"plausibleAnalytics"`
	GitHub             *docsGitHub `json:"github"`
	Theme              *docsTheme  `json:"theme"`
	ImageMounts        []docsMount `json:"imageMounts"`
}

// docsGitHub holds the repository links surfaced by the theme (edit links, header)
type docsGitHub struct {
	URL    string `json:"url"`
	Repo   string `json:"repo"`
	Branch string `json:"branch"`
}

// docsTheme holds the theme's visual options (color scheme and icons)
type docsTheme struct {
	Scheme    string `json:"scheme"`
	IconLight string `json:"iconLight"`
	IconDark  string `json:"iconDark"`
	Favicon   string `json:"favicon"`
}

// docsMount mirrors one Hugo module mount, used to expose a project's image directory
type docsMount struct {
	Source string `json:"source"`
	Target string `json:"target"`
}

// hugoConfigTemplate renders a complete hugo.toml from docsMetadata. The static
// blocks (disableKinds, markup, the theme import, taxonomies) are required by the
// theme and are intentionally not configurable per project.
var hugoConfigTemplate = template.Must(template.New("hugo.toml").
	Funcs(template.FuncMap{"q": strconv.Quote}).
	Parse(`# Generated by vercel-docs-build from ` + docsMetadataFile + ` — do not edit by hand.
baseURL = {{ q .BaseURL }}
locale = {{ q .Locale }}
title = {{ q .Title }}
disableKinds = ["rss"]

[module]
{{- range .ImageMounts }}
  [[module.mounts]]
    source = {{ q .Source }}
    target = {{ q .Target }}
{{ end }}
  [[module.imports]]
    path = {{ q .ThemeImportPath }}

# Required for render hooks + unsafe HTML in markdown
[markup]
  [markup.highlight]
    noClasses = false
    style = "github"
    lineNos = false
    lineNumbersInTable = false
    guessSyntax = true
    tabWidth = 2
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 3
    ordered = false

[params]
{{- with .Description }}
  description = {{ q . }}
{{- end }}
{{- with .GitHub }}
  github_url = {{ q .URL }}
  github_repo = {{ q .Repo }}
  github_branch = {{ q .Branch }}
{{- end }}
{{- if .PlausibleAnalytics }}
  PlausibleAnalytics = true
{{- end }}
{{- with .Theme }}

  [params.theme]
    scheme = {{ q .Scheme }}
{{- with .IconLight }}
    icon_light = {{ q . }}
{{- end }}
{{- with .IconDark }}
    icon_dark = {{ q . }}
{{- end }}
{{- with .Favicon }}
    favicon = {{ q . }}
{{- end }}
{{- end }}

# Taxonomy pages aren't needed for a docs site
[taxonomies]
`))

// writeHugoConfig generates hugo.toml from the project's docs.json when it exists.
// Projects opt in by committing docs.json instead of a hand-written hugo.toml; when
// docs.json is absent the builder leaves any existing hugo.toml untouched.
func writeHugoConfig() error {
	// A missing metadata file means the project manages its own hugo.toml
	file, err := os.Open(docsMetadataFile)
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	if err != nil {
		return fmt.Errorf("open %s: %w", docsMetadataFile, err)
	}
	defer file.Close()

	// Decode the small metadata document in full before rendering the config
	data, err := io.ReadAll(file)
	if err != nil {
		return fmt.Errorf("read %s: %w", docsMetadataFile, err)
	}

	var meta docsMetadata
	err = json.Unmarshal(data, &meta)
	if err != nil {
		return fmt.Errorf("parse %s: %w", docsMetadataFile, err)
	}

	// baseURL and title are the minimum Hugo needs to render a usable site
	if meta.BaseURL == "" || meta.Title == "" {
		return fmt.Errorf("%s must set both baseURL and title", docsMetadataFile)
	}

	// Default the locale so the generated config always has a value, matching prior sites
	if meta.Locale == "" {
		meta.Locale = "en-us"
	}

	// Render through a buffer so a template error never leaves a half-written hugo.toml
	var buf bytes.Buffer
	err = hugoConfigTemplate.Execute(&buf, struct {
		docsMetadata
		ThemeImportPath string
	}{docsMetadata: meta, ThemeImportPath: themeImportPath})
	if err != nil {
		return fmt.Errorf("render %s: %w", hugoConfigFile, err)
	}

	err = os.WriteFile(hugoConfigFile, buf.Bytes(), 0o644)
	if err != nil {
		return fmt.Errorf("write %s: %w", hugoConfigFile, err)
	}

	fmt.Fprintf(os.Stdout, "vercel-docs-build: generated %s from %s\n", hugoConfigFile, docsMetadataFile)

	return nil
}

// writeOutputConfig assembles the Build Output API config from consumer rules,
// shared markdown and Plausible routing, and static file handling
// The resulting config.json is what tells Vercel to use Build Output API mode
func writeOutputConfig() error {
	// Preserve project-specific routing from vercel.json so consumers keep their
	// security/cache headers and can add their own redirects and rewrites
	consumer, err := routesFromVercelJSON("vercel.json")
	if err != nil {
		return err
	}

	// Main phase: headers and redirects apply before the filesystem is consulted
	routes := make([]outputRoute, 0)
	routes = append(routes, consumer.Headers...)
	routes = append(routes, consumer.Redirects...)

	// Redirect the physical markdown path to its clean URL so /docs/setup.md is the
	// single public address. This 308 is terminal, so ugly paths never fall through to
	// the canonical/rewrite routes below. Home (/index.md) has no clean sibling and is
	// intentionally not matched: the pattern requires a path segment before /index.md.
	routes = append(routes, outputRoute{
		Source:  "^/(.+)/index\\.md$",
		Status:  308,
		Headers: map[string]string{"Location": "/$1.md"},
	})

	// Point markdown responses at their HTML page as the canonical URL so search engines
	// index the HTML, not the agent-facing markdown. Skipped when no base URL is known so
	// the builder never emits a broken relative canonical. Route src is PCRE, so the
	// generic rule uses a negative lookahead to leave the home page to its own rule below.
	base := canonicalBase()
	if base != "" {
		routes = append(routes,
			outputRoute{
				Source:   "^/(?!index\\.md$)(.+)\\.md$",
				Headers:  map[string]string{"Link": fmt.Sprintf("<%s/$1/>; rel=\"canonical\"", base)},
				Continue: true,
			},
			// Home has no clean ".md" sibling and is served at /index.md
			outputRoute{
				Source:   "^/index\\.md$",
				Headers:  map[string]string{"Link": fmt.Sprintf("<%s/>; rel=\"canonical\"", base)},
				Continue: true,
			},
		)
	}

	// Add shared Plausible proxy routes before filesystem handling so requests reach the generated functions
	routes = append(routes,
		outputRoute{Source: "/pls/index(?:\\.[a-fA-F0-9]{1,6})?\\.js", Dest: "/pls-script"},
		outputRoute{Source: "/pls/api(?:/(.*))?", Dest: "/pls-api"},
	)

	// Advertise each HTML page's markdown twin with a Link: rel="alternate" response
	// header, so clients that read headers (not just the in-page <link>) can discover it.
	// These match extensionless pretty URLs (with or without a trailing slash) and run
	// after the function routes so /pls/* responses are not touched.
	const mdAlternate = "; rel=\"alternate\"; type=\"text/markdown\""
	routes = append(routes,
		outputRoute{
			Source:   "^/$",
			Headers:  map[string]string{"Link": "</index.md>" + mdAlternate},
			Continue: true,
		},
		outputRoute{
			Source:   "^/([^.]+?)/?$",
			Headers:  map[string]string{"Link": "</$1.md>" + mdAlternate},
			Continue: true,
		},
		outputRoute{Handle: "filesystem"},
	)

	// Miss phase: only reached when no real file matched. Serve the clean markdown URL
	// from its physical index.md, then let projects' own rewrites take over.
	routes = append(routes,
		outputRoute{Handle: "miss"},
		outputRoute{Source: "^/(.+)\\.md$", Dest: "/$1/index.md"},
	)
	routes = append(routes, consumer.Rewrites...)

	// Version 3 is the current Build Output API config version used by Vercel
	config := outputConfig{
		Version: 3,
		Routes:  routes,
	}

	// Write .vercel/output/config.json after all route inputs have been assembled
	err = writeJSON(filepath.Join(outputDir, "config.json"), config)
	if err != nil {
		return err
	}

	return nil
}

// consumerRoutes groups the routes translated from a project's vercel.json by the
// Build Output API phase they belong to (headers and redirects run before the
// filesystem, rewrites run after a filesystem miss)
type consumerRoutes struct {
	Headers   []outputRoute
	Redirects []outputRoute
	Rewrites  []outputRoute
}

// routesFromVercelJSON carries over a project's Vercel header, redirect, and rewrite
// rules when emitting Build Output API config. Functions and the markdown routing are
// owned by this shared builder; everything else is the project's to extend.
func routesFromVercelJSON(path string) (consumerRoutes, error) {
	// Missing vercel.json is allowed so the builder can work for minimal Hugo docs projects
	file, err := os.Open(path)
	if errors.Is(err, os.ErrNotExist) {
		return consumerRoutes{}, nil
	}
	if err != nil {
		return consumerRoutes{}, fmt.Errorf("open %s: %w", path, err)
	}
	defer file.Close()

	// Read the whole config because vercel.json is small and JSON decoding needs all bytes
	data, err := io.ReadAll(file)
	if err != nil {
		return consumerRoutes{}, fmt.Errorf("read %s: %w", path, err)
	}

	// Decode only the fields this builder understands and intentionally ignore the rest
	var config vercelJSON
	err = json.Unmarshal(data, &config)
	if err != nil {
		return consumerRoutes{}, fmt.Errorf("parse %s: %w", path, err)
	}

	var out consumerRoutes

	// Convert each Vercel header rule into a Build Output API route with continue=true
	for _, header := range config.Headers {
		if header.Source == "" || len(header.Headers) == 0 {
			// Skip incomplete rules rather than emitting routes that Vercel would reject
			continue
		}

		// Convert Vercel's list format into the Build Output API header map format
		headers := make(map[string]string, len(header.Headers))
		for _, value := range header.Headers {
			if value.Key == "" {
				// A header without a key cannot be represented in Vercel output config
				continue
			}

			headers[value.Key] = value.Value
		}

		if len(headers) == 0 {
			// Avoid emitting a route that does not actually set any headers
			continue
		}

		// continue=true lets later function/static routes handle the request after headers are applied
		out.Headers = append(out.Headers, outputRoute{
			Source:   header.Source,
			Headers:  headers,
			Continue: true,
		})
	}

	// Convert each redirect into a status route that sets Location, mirroring Vercel semantics
	for _, redirect := range config.Redirects {
		if redirect.Source == "" || redirect.Destination == "" {
			// A redirect without both endpoints cannot be represented as a route
			continue
		}

		out.Redirects = append(out.Redirects, outputRoute{
			Source:  redirect.Source,
			Status:  redirectStatus(redirect),
			Headers: map[string]string{"Location": redirect.Destination},
		})
	}

	// Convert each rewrite into a dest route; the caller emits these in the miss phase
	for _, rewrite := range config.Rewrites {
		if rewrite.Source == "" || rewrite.Destination == "" {
			// A rewrite without both endpoints cannot be represented as a route
			continue
		}

		out.Rewrites = append(out.Rewrites, outputRoute{
			Source: rewrite.Source,
			Dest:   rewrite.Destination,
		})
	}

	return out, nil
}

// redirectStatus resolves a vercel.json redirect to an HTTP status code, matching
// Vercel's defaults: an explicit StatusCode wins, then Permanent selects 308 vs 307.
func redirectStatus(redirect vercelRedirect) int {
	if redirect.StatusCode != 0 {
		return redirect.StatusCode
	}
	if redirect.Permanent != nil && *redirect.Permanent {
		return 308
	}

	return 307
}

// canonicalBase returns the absolute site origin used for markdown canonical links,
// or "" when none is configured so the builder can skip canonical headers entirely.
func canonicalBase() string {
	// An explicit override wins so projects can pin a canonical host
	base := os.Getenv("DOCS_CANONICAL_BASE")
	if base != "" {
		return strings.TrimRight(base, "/")
	}

	// VERCEL_PROJECT_PRODUCTION_URL is the production host (no scheme) Vercel injects at build time
	host := os.Getenv("VERCEL_PROJECT_PRODUCTION_URL")
	if host != "" {
		return "https://" + strings.TrimRight(host, "/")
	}

	return ""
}

// writeJSON writes stable, human-readable JSON for generated Vercel output files
// Pretty output makes deployment artifacts easier to inspect when debugging builds
func writeJSON(path string, value any) error {
	// Encode through a buffer so partial files are not written if JSON marshaling fails
	var buf bytes.Buffer
	encoder := json.NewEncoder(&buf)
	encoder.SetIndent("", "  ")

	err := encoder.Encode(value)
	if err != nil {
		return fmt.Errorf("encode %s: %w", path, err)
	}

	if runtime.GOOS == "windows" {
		// json.Encoder already writes a newline, but keep Windows output explicit for cross-platform tests
		buf.WriteByte('\n')
	}

	// Write the generated JSON file with normal source-like permissions
	err = os.WriteFile(path, buf.Bytes(), 0o644)
	if err != nil {
		return fmt.Errorf("write %s: %w", path, err)
	}

	return nil
}
