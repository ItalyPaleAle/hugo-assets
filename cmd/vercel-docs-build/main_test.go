package main

import (
	"encoding/json"
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
	routes, err := assembleRoutes(consumerRoutes{}, "")
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

	routes, err := assembleRoutes(consumer, "")
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

// TestManagedVercelJSON confirms the builder-managed vercel.json is valid JSON and pins the
// fixed project/build settings every docs site shares.
func TestManagedVercelJSON(t *testing.T) {
	var parsed map[string]any
	err := json.Unmarshal(managedVercelJSON, &parsed)
	if err != nil {
		t.Fatalf("embedded %s is not valid JSON: %v", vercelConfigFile, err)
	}

	for _, key := range []string{"fluid", "buildCommand", "devCommand", "cleanUrls", "framework"} {
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

	routes, err := assembleRoutes(consumerRoutesFromConfig(cfg), "")
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
