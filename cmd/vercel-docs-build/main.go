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
	"strings"
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
)

// vercelJSON models the subset of vercel.json that this builder preserves
// The project-level vercel.json remains the source of truth for headers
type vercelJSON struct {
	Headers []vercelHeader `json:"headers"`
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

// writeOutputConfig combines consumer headers with shared function routes and static file handling
// The resulting config.json is what tells Vercel to use Build Output API mode
func writeOutputConfig() error {
	// Preserve project-specific header rules from vercel.json so consumers keep security/cache headers
	routes, err := routesFromVercelJSON("vercel.json")
	if err != nil {
		return err
	}

	// Add shared Plausible proxy routes before filesystem handling so requests reach the generated functions
	routes = append(routes,
		outputRoute{Source: "/pls/index(?:\\.[a-fA-F0-9]{1,6})?\\.js", Dest: "/pls-script"},
		outputRoute{Source: "/pls/api(?:/(.*))?", Dest: "/pls-api"},
		outputRoute{Handle: "filesystem"},
	)

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

// routesFromVercelJSON carries over Vercel header rules when emitting Build Output API config
// Only headers are translated because rewrites/functions are owned by this shared builder
func routesFromVercelJSON(path string) ([]outputRoute, error) {
	// Missing vercel.json is allowed so the builder can work for minimal Hugo docs projects
	file, err := os.Open(path)
	if errors.Is(err, os.ErrNotExist) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("open %s: %w", path, err)
	}
	defer file.Close()

	// Read the whole config because vercel.json is small and JSON decoding needs all bytes
	data, err := io.ReadAll(file)
	if err != nil {
		return nil, fmt.Errorf("read %s: %w", path, err)
	}

	// Decode only the fields this builder understands and intentionally ignore the rest
	var config vercelJSON
	err = json.Unmarshal(data, &config)
	if err != nil {
		return nil, fmt.Errorf("parse %s: %w", path, err)
	}

	// Convert each Vercel header rule into a Build Output API route with continue=true
	routes := make([]outputRoute, 0, len(config.Headers))
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
		routes = append(routes, outputRoute{
			Source:   header.Source,
			Headers:  headers,
			Continue: true,
		})
	}

	return routes, nil
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
