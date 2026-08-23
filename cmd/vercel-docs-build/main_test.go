package main

import (
	"bytes"
	"encoding/json"
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

	// Negotiation runs after the Plausible functions (so /pls/* is never rewritten to markdown) and before the filesystem serves the HTML page
	plsIdx, _ := findRoute(routes, func(route outputRoute) bool {
		return route.Dest == "/pls-api"
	})
	if plsIdx < 0 {
		t.Fatalf("no Plausible API route")
	}
	fsIdx := indexOfHandle(routes, "filesystem")
	if fsIdx < 0 {
		t.Fatalf("expected a filesystem handler route")
	}
	if homeIdx < plsIdx || pageIdx < plsIdx {
		t.Errorf("negotiation routes (%d, %d) must come after the function routes (%d)", homeIdx, pageIdx, plsIdx)
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

// TestNotFoundRoutes confirms missing paths get a real 404 with a body the client can use: markdown for anything that did not ask for HTML, the rendered page for browsers.
func TestNotFoundRoutes(t *testing.T) {
	// With neither representation published, Vercel's own 404 handling is left in place
	got := notFoundRoutes(siteOutputs{})
	if len(got) != 0 {
		t.Errorf("expected no error routes when no 404 page was published, got %+v", got)
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
		t.Fatalf("no error route for markdown URLs")
	}
	if md.Dest != "/404.md" || md.Status != 404 {
		t.Errorf("markdown 404 = %q/%d, want %q/404", md.Dest, md.Status, "/404.md")
	}

	// Clients that never asked for HTML (curl, fetch, agents) get the markdown body too
	negotiatedIdx, negotiated := findRoute(routes, func(route outputRoute) bool {
		return hasAcceptCondition(route.Missing, acceptsHTML)
	})
	if negotiatedIdx < 0 {
		t.Fatalf("no error route for clients that did not ask for HTML")
	}
	if negotiated.Dest != "/404.md" || negotiated.Status != 404 {
		t.Errorf("negotiated 404 = %q/%d, want %q/404", negotiated.Dest, negotiated.Status, "/404.md")
	}

	// The rendered page is the fallback, so it must come last
	htmlIdx, html := findRoute(routes, func(route outputRoute) bool {
		return route.Dest == "/404.html"
	})
	if htmlIdx < 0 {
		t.Fatalf("no error route for the rendered 404 page")
	}
	if html.Status != 404 {
		t.Errorf("HTML 404 status = %d, want 404", html.Status)
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
