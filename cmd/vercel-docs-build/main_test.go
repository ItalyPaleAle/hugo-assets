package main

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"
)

// indexOfHeaderRoute returns the index of the first route that sets the given header key,
// or -1 when no route does. Used to assert ordering between default and consumer headers.
func indexOfHeaderRoute(routes []outputRoute, key string) int {
	for i, route := range routes {
		if _, ok := route.Headers[key]; ok {
			return i
		}
	}

	return -1
}

// indexOfHandle returns the index of the route entering the given phase, or -1 when the phase is never entered.
func indexOfHandle(routes []outputRoute, handle string) int {
	for i, route := range routes {
		if route.Handle == handle {
			return i
		}
	}

	return -1
}

// findRoute returns the first route matching the predicate along with its index, or -1.
func findRoute(routes []outputRoute, match func(outputRoute) bool) (int, outputRoute) {
	for i, route := range routes {
		if match(route) {
			return i, route
		}
	}

	return -1, outputRoute{}
}

// hasAcceptCondition reports whether the conditions ask about the request's Accept header with the given pattern.
func hasAcceptCondition(conditions []routeCondition, pattern string) bool {
	for _, condition := range conditions {
		if condition.Type == "header" && condition.Key == "accept" && condition.Value == pattern {
			return true
		}
	}

	return false
}

// TestDefaultHeaderRoutes confirms the embedded vercel.json's headers parse and
// yield the expected set of baked-in header rules.
func TestDefaultHeaderRoutes(t *testing.T) {
	routes, err := defaultHeaderRoutes()
	if err != nil {
		t.Fatalf("defaultHeaderRoutes: %v", err)
	}

	if len(routes) != 6 {
		t.Fatalf("expected 6 default header routes, got %d", len(routes))
	}

	// Every default header route must continue so later routes still run after it
	for i, route := range routes {
		if !route.Continue {
			t.Errorf("default route %d (%q) should set continue=true", i, route.Source)
		}
	}

	// Spot-check a representative security and cache default is present
	for _, key := range []string{"Permissions-Policy", "Content-Security-Policy", "Cache-Control"} {
		if indexOfHeaderRoute(routes, key) < 0 {
			t.Errorf("expected a default route setting %q", key)
		}
	}
}

// TestAssembleRoutesAppliesDefaults confirms that, even with no consumer config, the default
// header routes are emitted ahead of the builder's markdown/static routing.
func TestAssembleRoutesAppliesDefaults(t *testing.T) {
	routes, err := assembleRoutes(consumerRoutes{}, "", siteOutputs{})
	if err != nil {
		t.Fatalf("assembleRoutes: %v", err)
	}

	csp := indexOfHeaderRoute(routes, "Content-Security-Policy")
	if csp < 0 {
		t.Fatalf("default Content-Security-Policy header missing from assembled routes")
	}

	// The defaults are part of the main phase, so they must precede the filesystem handler
	fs := -1
	for i, route := range routes {
		if route.Handle == "filesystem" {
			fs = i
			break
		}
	}
	if fs < 0 {
		t.Fatalf("expected a filesystem handler route")
	}
	if csp > fs {
		t.Errorf("default header route (%d) should come before the filesystem handler (%d)", csp, fs)
	}
}

// TestAssembleRoutesSiteOverridesDefault confirms a consumer header sharing a key with a
// default is emitted after the default, so Vercel's last-writer-wins lets the site override it.
func TestAssembleRoutesSiteOverridesDefault(t *testing.T) {
	consumer := consumerRoutes{
		Headers: headerRoutes([]vercelHeader{
			{
				Source:  "/(.*?)",
				Headers: []vercelHeaderValue{{Key: "Referrer-Policy", Value: "no-referrer"}},
			},
		}),
	}

	routes, err := assembleRoutes(consumer, "", siteOutputs{})
	if err != nil {
		t.Fatalf("assembleRoutes: %v", err)
	}

	defaultIdx := indexOfHeaderRoute(routes, "Referrer-Policy")
	if defaultIdx < 0 {
		t.Fatalf("default Referrer-Policy header missing")
	}

	// The consumer override is the *second* route carrying Referrer-Policy
	consumerIdx := indexOfHeaderRoute(routes[defaultIdx+1:], "Referrer-Policy")
	if consumerIdx < 0 {
		t.Fatalf("consumer Referrer-Policy override missing from assembled routes")
	}

	// Absolute index of the consumer route; it must come after the default for the override to win
	consumerIdx += defaultIdx + 1
	if consumerIdx <= defaultIdx {
		t.Errorf("consumer override (%d) must come after default (%d)", consumerIdx, defaultIdx)
	}
	if got := routes[consumerIdx].Headers["Referrer-Policy"]; got != "no-referrer" {
		t.Errorf("consumer override value = %q, want %q", got, "no-referrer")
	}
}

// TestCanonicalBase confirms the canonical origin is derived from config.json's baseURL,
// that DOCS_CANONICAL_BASE overrides it, and that an absent baseURL yields no canonical.
func TestCanonicalBase(t *testing.T) {
	// baseURL from config.json is the canonical origin, with the trailing slash trimmed
	t.Setenv("DOCS_CANONICAL_BASE", "")
	if got := canonicalBase(&projectConfig{BaseURL: "https://francis.italypaleale.me/"}); got != "https://francis.italypaleale.me" {
		t.Errorf("baseURL canonical = %q, want %q", got, "https://francis.italypaleale.me")
	}

	// An explicit DOCS_CANONICAL_BASE override wins over config.json's baseURL
	t.Setenv("DOCS_CANONICAL_BASE", "https://override.example/")
	if got := canonicalBase(&projectConfig{BaseURL: "https://francis.italypaleale.me/"}); got != "https://override.example" {
		t.Errorf("override canonical = %q, want %q", got, "https://override.example")
	}

	// With neither source set, no canonical origin is known
	t.Setenv("DOCS_CANONICAL_BASE", "")
	if got := canonicalBase(nil); got != "" {
		t.Errorf("missing canonical = %q, want empty", got)
	}
}

// TestManagedVercelJSON confirms the builder-managed vercel.json is valid JSON and pins the
// fixed project/build settings every docs site shares.
func TestManagedVercelJSON(t *testing.T) {
	var parsed map[string]any
	err := json.Unmarshal(managedVercelJSON, &parsed)
	if err != nil {
		t.Fatalf("embedded %s is not valid JSON: %v", vercelConfigFile, err)
	}

	for _, key := range []string{"fluid", "buildCommand", "devCommand", "cleanUrls", "trailingSlash", "framework"} {
		if _, ok := parsed[key]; !ok {
			t.Errorf("managed %s missing fixed setting %q", vercelConfigFile, key)
		}
	}
}

// TestConsumerRoutesFromConfigOverride confirms a custom header in config.json is emitted after
// the default headers (so the site override wins), and that a nil config yields no routes.
func TestConsumerRoutesFromConfigOverride(t *testing.T) {
	if got := consumerRoutesFromConfig(nil); len(got.Headers)+len(got.Redirects)+len(got.Rewrites) != 0 {
		t.Errorf("nil config should yield no consumer routes, got %+v", got)
	}

	cfg := &projectConfig{
		Headers: []vercelHeader{
			{
				Source:  "/(.*?)",
				Headers: []vercelHeaderValue{{Key: "Referrer-Policy", Value: "no-referrer"}},
			},
		},
	}

	routes, err := assembleRoutes(consumerRoutesFromConfig(cfg), "", siteOutputs{})
	if err != nil {
		t.Fatalf("assembleRoutes: %v", err)
	}

	defaultIdx := indexOfHeaderRoute(routes, "Referrer-Policy")
	if defaultIdx < 0 {
		t.Fatalf("default Referrer-Policy header missing")
	}

	consumerIdx := indexOfHeaderRoute(routes[defaultIdx+1:], "Referrer-Policy")
	if consumerIdx < 0 {
		t.Fatalf("config.json Referrer-Policy override missing from assembled routes")
	}
	if got := routes[defaultIdx+1+consumerIdx].Headers["Referrer-Policy"]; got != "no-referrer" {
		t.Errorf("config.json override value = %q, want %q", got, "no-referrer")
	}
}

// TestHugoConfigIncludesRobots confirms config.json enables Hugo's robots output and can opt into the generated llms.txt resource
func TestHugoConfigIncludesRobots(t *testing.T) {
	var cfg projectConfig
	err := json.Unmarshal([]byte(`{
		"baseURL": "https://example.com/",
		"title": "Example",
		"robots": {
			"disallow": ["/private/"],
			"llmsTXT": true
		}
	}`), &cfg)
	if err != nil {
		t.Fatalf("parse project config: %v", err)
	}

	var out bytes.Buffer
	err = hugoConfigTemplate.Execute(&out, struct {
		projectConfig
		ThemeImportPath string
	}{projectConfig: cfg, ThemeImportPath: themeImportPath})
	if err != nil {
		t.Fatalf("render Hugo config: %v", err)
	}

	for _, want := range []string{
		"enableRobotsTXT = true",
		"[params.robots]",
		"llmsTXT = true",
		`"/private/"`,
	} {
		if !strings.Contains(out.String(), want) {
			t.Errorf("generated Hugo config missing %q:\n%s", want, out.String())
		}
	}
}

// TestHugoConfigGitHubPath confirms config.json's optional github.path is rendered as
// github_path, and that it's omitted entirely when not set so edit-link.html falls back
// to repo-root edit links.
func TestHugoConfigGitHubPath(t *testing.T) {
	var withPath projectConfig
	err := json.Unmarshal([]byte(`{
		"baseURL": "https://example.com/",
		"title": "Example",
		"github": {
			"url": "https://github.com/example/example",
			"repo": "https://github.com/example/example",
			"branch": "main",
			"path": "docs"
		}
	}`), &withPath)
	if err != nil {
		t.Fatalf("parse project config: %v", err)
	}

	var out bytes.Buffer
	err = hugoConfigTemplate.Execute(&out, struct {
		projectConfig
		ThemeImportPath string
	}{projectConfig: withPath, ThemeImportPath: themeImportPath})
	if err != nil {
		t.Fatalf("render Hugo config: %v", err)
	}
	if want := `github_path = "docs"`; !strings.Contains(out.String(), want) {
		t.Errorf("generated Hugo config missing %q:\n%s", want, out.String())
	}

	var withoutPath projectConfig
	err = json.Unmarshal([]byte(`{
		"baseURL": "https://example.com/",
		"title": "Example",
		"github": {
			"url": "https://github.com/example/example",
			"repo": "https://github.com/example/example",
			"branch": "main"
		}
	}`), &withoutPath)
	if err != nil {
		t.Fatalf("parse project config: %v", err)
	}

	out.Reset()
	err = hugoConfigTemplate.Execute(&out, struct {
		projectConfig
		ThemeImportPath string
	}{projectConfig: withoutPath, ThemeImportPath: themeImportPath})
	if err != nil {
		t.Fatalf("render Hugo config: %v", err)
	}
	if strings.Contains(out.String(), "github_path") {
		t.Errorf("generated Hugo config should omit github_path when unset:\n%s", out.String())
	}
}

// TestAssembleRoutesMarkdownNegotiation confirms a site that published markdown twins serves them from the HTML page's own URL when the client asks for text/markdown, and that those URLs advertise the negotiation with Vary: Accept.
func TestAssembleRoutesMarkdownNegotiation(t *testing.T) {
	routes, err := assembleRoutes(consumerRoutes{}, "", siteOutputs{Markdown: true})
	if err != nil {
		t.Fatalf("assembleRoutes: %v", err)
	}

	// The home page's markdown twin is served from /index.md
	homeIdx, home := findRoute(routes, func(route outputRoute) bool {
		return route.Source == "^/$" && hasAcceptCondition(route.Has, acceptsMarkdown)
	})
	if homeIdx < 0 {
		t.Fatalf("no Accept: text/markdown route for the home page")
	}
	if home.Dest != "/index.md" {
		t.Errorf("home negotiation dest = %q, want %q", home.Dest, "/index.md")
	}

	// Every other page is served from the index.md next to its HTML
	pageIdx, page := findRoute(routes, func(route outputRoute) bool {
		return route.Source != "^/$" && hasAcceptCondition(route.Has, acceptsMarkdown)
	})
	if pageIdx < 0 {
		t.Fatalf("no Accept: text/markdown route for interior pages")
	}
	if page.Dest != "/$1/index.md" {
		t.Errorf("page negotiation dest = %q, want %q", page.Dest, "/$1/index.md")
	}

	// Caches must be told the representation depends on Accept, and the header has to be set before the negotiation rewrite so both variants carry it
	varyIdx := indexOfHeaderRoute(routes, "Vary")
	if varyIdx < 0 {
		t.Fatalf("no route sets Vary")
	}
	if got := routes[varyIdx].Headers["Vary"]; !strings.Contains(got, "Accept,") {
		t.Errorf("Vary = %q, want it to list Accept first", got)
	}
	if !routes[varyIdx].Continue {
		t.Errorf("the Vary route must continue so the response is still served")
	}
	if varyIdx > homeIdx || varyIdx > pageIdx {
		t.Errorf("Vary route (%d) must precede the negotiation routes (%d, %d)", varyIdx, homeIdx, pageIdx)
	}

	// Negotiation runs after the Plausible middleware (so /pls/* is never rewritten to markdown) and before the filesystem serves the HTML page
	plsIdx, _ := findRoute(routes, func(route outputRoute) bool {
		return route.MiddlewarePath == middlewareName
	})
	if plsIdx < 0 {
		t.Fatalf("no Plausible middleware route")
	}
	fsIdx := indexOfHandle(routes, "filesystem")
	if fsIdx < 0 {
		t.Fatalf("expected a filesystem handler route")
	}
	if homeIdx < plsIdx || pageIdx < plsIdx {
		t.Errorf("negotiation routes (%d, %d) must come after the middleware route (%d)", homeIdx, pageIdx, plsIdx)
	}
	if homeIdx > fsIdx || pageIdx > fsIdx {
		t.Errorf("negotiation routes (%d, %d) must come before the filesystem handler (%d)", homeIdx, pageIdx, fsIdx)
	}
}

// TestAssembleRoutesWithoutMarkdown confirms a site that published no markdown twins gets no negotiation routes, so a page URL is never rewritten to a file that does not exist.
func TestAssembleRoutesWithoutMarkdown(t *testing.T) {
	routes, err := assembleRoutes(consumerRoutes{}, "", siteOutputs{})
	if err != nil {
		t.Fatalf("assembleRoutes: %v", err)
	}

	idx, _ := findRoute(routes, func(route outputRoute) bool {
		return len(route.Has) > 0
	})
	if idx >= 0 {
		t.Errorf("route %d negotiates on Accept even though no markdown was published", idx)
	}
}

// TestNotFoundRoutes confirms missing paths get a real 404 with a body the client can use: the rendered page by default, markdown only for clients that asked for it.
func TestNotFoundRoutes(t *testing.T) {
	// With neither representation published, Vercel's own 404 handling is left in place
	got := notFoundRoutes(siteOutputs{})
	if len(got) != 0 {
		t.Errorf("expected no 404 routes when no 404 page was published, got %+v", got)
	}

	routes := notFoundRoutes(siteOutputs{NotFoundHTML: true, NotFoundMarkdown: true})
	if len(routes) == 0 {
		t.Fatalf("expected 404 routes when both representations were published")
	}

	// A catch-all in the error phase would report a function's 5xx as a missing page
	for _, route := range routes {
		if route.Handle != "" {
			t.Errorf("404 routes must not open a new phase, got handle %q", route.Handle)
		}
	}

	// A markdown URL gets markdown back regardless of what it asked for
	mdIdx, md := findRoute(routes, func(route outputRoute) bool {
		return strings.HasSuffix(route.Source, "\\.md$")
	})
	if mdIdx < 0 {
		t.Fatalf("no 404 route for markdown URLs")
	}
	if md.Dest != "/404.md" || md.Status != 404 {
		t.Errorf("markdown 404 = %q/%d, want %q/404", md.Dest, md.Status, "/404.md")
	}

	// Clients that asked for markdown get the markdown body here too
	negotiatedIdx, negotiated := findRoute(routes, func(route outputRoute) bool {
		return hasAcceptCondition(route.Has, acceptsMarkdown)
	})
	if negotiatedIdx < 0 {
		t.Fatalf("no 404 route negotiating on Accept: text/markdown")
	}
	if negotiated.Dest != "/404.md" || negotiated.Status != 404 {
		t.Errorf("negotiated 404 = %q/%d, want %q/404", negotiated.Dest, negotiated.Status, "/404.md")
	}

	// The rendered page is the fallback, so it must come last
	htmlIdx, html := findRoute(routes, func(route outputRoute) bool {
		return route.Dest == "/404.html"
	})
	if htmlIdx < 0 {
		t.Fatalf("no 404 route for the rendered 404 page")
	}
	if html.Status != 404 {
		t.Errorf("HTML 404 status = %d, want 404", html.Status)
	}

	// The rendered page is what a client gets when it did not ask for anything in particular, so it must not be conditioned on Accept
	if len(html.Has) > 0 {
		t.Errorf("the rendered 404 page must be unconditional, got has=%+v", html.Has)
	}
	if htmlIdx < mdIdx || htmlIdx < negotiatedIdx {
		t.Errorf("HTML 404 route (%d) must come after the markdown routes (%d, %d)", htmlIdx, mdIdx, negotiatedIdx)
	}

	// A site that renders only the HTML page must not be routed to a missing 404.md
	htmlOnly := notFoundRoutes(siteOutputs{NotFoundHTML: true})
	for _, route := range htmlOnly {
		if route.Dest == "/404.md" {
			t.Errorf("routed to /404.md even though it was not published: %+v", route)
		}
	}
}

// TestAssembleRoutesNotFoundFollowsFilesystem confirms the 404 fallback is only reached once the filesystem has missed, so it never shadows a page that exists.
func TestAssembleRoutesNotFoundFollowsFilesystem(t *testing.T) {
	routes, err := assembleRoutes(consumerRoutes{}, "", siteOutputs{Markdown: true, NotFoundHTML: true, NotFoundMarkdown: true})
	if err != nil {
		t.Fatalf("assembleRoutes: %v", err)
	}

	fsIdx := indexOfHandle(routes, "filesystem")
	if fsIdx < 0 {
		t.Fatalf("expected a filesystem handler route")
	}

	htmlIdx, _ := findRoute(routes, func(route outputRoute) bool {
		return route.Dest == "/404.html"
	})
	mdIdx, _ := findRoute(routes, func(route outputRoute) bool {
		return route.Dest == "/404.md"
	})
	if htmlIdx < 0 || mdIdx < 0 {
		t.Fatalf("expected both 404 representations to be routed, got html=%d markdown=%d", htmlIdx, mdIdx)
	}
	if mdIdx < fsIdx || htmlIdx < fsIdx {
		t.Errorf("404 routes (%d, %d) must come after the filesystem handler (%d)", mdIdx, htmlIdx, fsIdx)
	}

	// The routing table ends there: nothing is emitted into a later phase
	idx := indexOfHandle(routes, "error")
	if idx >= 0 {
		t.Errorf("unexpected error phase at %d", idx)
	}
}

// TestHugoConfigPublishesNotFoundMarkdown confirms the generated hugo.toml opts the home page into the theme's "notfound" output format, which is what writes /404.md.
func TestHugoConfigPublishesNotFoundMarkdown(t *testing.T) {
	var out bytes.Buffer
	err := hugoConfigTemplate.Execute(&out, struct {
		projectConfig
		ThemeImportPath string
	}{
		projectConfig:   projectConfig{BaseURL: "https://example.com/", Title: "Example", Locale: "en-us"},
		ThemeImportPath: themeImportPath,
	})
	if err != nil {
		t.Fatalf("render Hugo config: %v", err)
	}

	want := `home    = ["html", "markdown", "notfound"]`
	if !strings.Contains(out.String(), want) {
		t.Errorf("generated Hugo config missing %q:\n%s", want, out.String())
	}
}

// TestCleanMarkdownURLSourceSkipsRootMarkdownFiles confirms the pattern that turns a clean
// ".md" URL into its physical "/<page>/index.md" excludes the markdown files that live at
// the root of the static tree.
func TestCleanMarkdownURLSourceSkipsRootMarkdownFiles(t *testing.T) {
	const want = `^/(?!index\.md$)(?!404\.md$)(.+)\.md$`
	if got := cleanMarkdownURLSource(); got != want {
		t.Errorf("cleanMarkdownURLSource() = %q, want %q", got, want)
	}
}

// TestAssembleRoutesServesRootMarkdownFromDisk confirms /index.md and /404.md reach the
// filesystem handler untouched. Both are physical files, so the clean-URL rewrite must not
// send them to /index/index.md and /404/index.md, which do not exist: that 404s the home
// page's markdown twin at the exact address its rel="alternate" link and Link header give out.
func TestAssembleRoutesServesRootMarkdownFromDisk(t *testing.T) {
	routes, err := assembleRoutes(consumerRoutes{}, "https://example.com", siteOutputs{Markdown: true, NotFoundHTML: true, NotFoundMarkdown: true})
	if err != nil {
		t.Fatalf("assembleRoutes: %v", err)
	}

	// The unconditional rewrite of a clean ".md" URL onto its physical file
	rewriteIdx, rewrite := findRoute(routes, func(route outputRoute) bool {
		return route.Dest == "/$1/index.md" && len(route.Has) == 0
	})
	if rewriteIdx < 0 {
		t.Fatalf("no clean markdown URL rewrite")
	}
	if rewrite.Source != cleanMarkdownURLSource() {
		t.Errorf("clean markdown URL rewrite src = %q, want %q", rewrite.Source, cleanMarkdownURLSource())
	}

	fsIdx := indexOfHandle(routes, "filesystem")
	if fsIdx < 0 {
		t.Fatalf("expected a filesystem handler route")
	}
	if rewriteIdx > fsIdx {
		t.Errorf("clean markdown URL rewrite (%d) must come before the filesystem handler (%d)", rewriteIdx, fsIdx)
	}

	// The canonical Link header covers the same set of clean URLs, and /index.md gets its own rule
	canonicalIdx, canonical := findRoute(routes, func(route outputRoute) bool {
		return route.Continue && strings.Contains(route.Headers["Link"], `rel="canonical"`) && strings.Contains(route.Source, `(.+)\.md$`)
	})
	if canonicalIdx < 0 {
		t.Fatalf("no canonical Link route for clean markdown URLs")
	}
	if canonical.Source != cleanMarkdownURLSource() {
		t.Errorf("canonical Link route src = %q, want %q", canonical.Source, cleanMarkdownURLSource())
	}

	homeIdx, home := findRoute(routes, func(route outputRoute) bool {
		return route.Source == `^/index\.md$`
	})
	if homeIdx < 0 {
		t.Fatalf("no canonical Link route for the home page's markdown twin")
	}
	if want := `<https://example.com/>; rel="canonical"`; home.Headers["Link"] != want {
		t.Errorf("home markdown canonical = %q, want %q", home.Headers["Link"], want)
	}

	// The unguarded pattern is the one that shipped the bug: it swallowed /index.md too
	for i, route := range routes {
		if route.Source == `^/(.+)\.md$` {
			t.Errorf("route %d matches every .md path, including the physical /index.md and /404.md", i)
		}
	}
}

// TestPlausibleMiddlewareRoute confirms the Plausible proxy paths, and only those, are handed to the Routing Middleware,
// ahead of the routes that would otherwise add markdown Link headers to them or serve them from the filesystem
func TestPlausibleMiddlewareRoute(t *testing.T) {
	routes, err := assembleRoutes(consumerRoutes{}, "https://example.com", siteOutputs{Markdown: true, NotFoundHTML: true, NotFoundMarkdown: true})
	if err != nil {
		t.Fatalf("assembleRoutes: %v", err)
	}

	mwIdx, mw := findRoute(routes, func(route outputRoute) bool {
		return route.MiddlewarePath != ""
	})
	if mwIdx < 0 {
		t.Fatalf("no middleware route")
	}
	if mw.MiddlewarePath != middlewareName {
		t.Errorf("middlewarePath = %q, want %q", mw.MiddlewarePath, middlewareName)
	}
	if mw.Dest != "" {
		t.Errorf("middleware route should not rewrite, got dest %q", mw.Dest)
	}

	// The proxy used to be two functions; nothing should route to them anymore
	for i, route := range routes {
		if route.Dest == "/pls-script" || route.Dest == "/pls-api" {
			t.Errorf("route %d still targets the removed function %q", i, route.Dest)
		}
	}

	// The source is a Vercel route regex, which Go's RE2 can evaluate because it uses no lookarounds
	re := regexp.MustCompile(mw.Source)
	for path, want := range map[string]bool{
		"/pls/index.js":         true,
		"/pls/index.a1b2c3.js":  true,
		"/pls/api":              true,
		"/pls/api/event":        true,
		"/pls/index.a1b2c3d.js": false,
		"/pls/index.xyz.js":     false,
		"/pls/other":            false,
		"/docs/pls/api/event":   false,
		"/pls/api.json":         false,
	} {
		if got := re.MatchString(path); got != want {
			t.Errorf("middleware route matches %q = %t, want %t", path, got, want)
		}
	}

	// It must run before the Link header routes (which would otherwise match /pls/api/event) and before the filesystem
	linkIdx, _ := findRoute(routes, func(route outputRoute) bool {
		return strings.Contains(route.Headers["Link"], `rel="alternate"`)
	})
	if linkIdx < 0 {
		t.Fatalf("no markdown alternate Link route")
	}
	if mwIdx > linkIdx {
		t.Errorf("middleware route (%d) must come before the Link header routes (%d)", mwIdx, linkIdx)
	}
	fsIdx := indexOfHandle(routes, "filesystem")
	if fsIdx < 0 || mwIdx > fsIdx {
		t.Errorf("middleware route (%d) must come before the filesystem handler (%d)", mwIdx, fsIdx)
	}
}

// TestWriteMiddleware confirms the embedded middleware is written as a Node.js function configured the way Vercel's
// own builders configure Routing Middleware, and without regions so Vercel deploys it globally
func TestWriteMiddleware(t *testing.T) {
	t.Chdir(t.TempDir())
	t.Setenv("VERCEL_DOCS_NODE_RUNTIME", "")

	err := writeMiddleware()
	if err != nil {
		t.Fatalf("writeMiddleware: %v", err)
	}

	funcDir := filepath.Join(outputDir, "functions", middlewareName+".func")
	info, err := os.Stat(filepath.Join(funcDir, "index.js"))
	if err != nil {
		t.Fatalf("middleware handler not written: %v", err)
	}
	if info.Size() == 0 {
		t.Errorf("middleware handler is empty")
	}

	data, err := os.ReadFile(filepath.Join(funcDir, ".vc-config.json"))
	if err != nil {
		t.Fatalf("read .vc-config.json: %v", err)
	}
	var config map[string]any
	err = json.Unmarshal(data, &config)
	if err != nil {
		t.Fatalf("parse .vc-config.json: %v", err)
	}

	want := map[string]any{
		"runtime":          defaultVercelRuntime,
		"handler":          "index.js",
		"launcherType":     "Nodejs",
		"shouldAddHelpers": false,
		"useWebApi":        true,
	}
	for key, value := range want {
		if config[key] != value {
			t.Errorf(".vc-config.json %s = %v, want %v", key, config[key], value)
		}
	}
	if _, ok := config["regions"]; ok {
		t.Errorf(".vc-config.json should not pin regions, got %v", config["regions"])
	}
}
