package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/evanw/esbuild/pkg/api"
)

// functionSource maps a TypeScript source file to its generated JavaScript output path
// Keeping this as data makes it clear which generated files should be committed
type functionSource struct {
	Input     string
	OutputDir string
}

// main is the go:generate entrypoint for compiling embedded Vercel function sources
// It keeps generation failures visible to maintainers before checked-in JavaScript changes are committed
func main() {
	// Run generation through a helper so exit handling stays separate from build logic
	err := run()
	if err != nil {
		// Prefix errors so go generate output points at the generator rather than the docs builder
		fmt.Fprintln(os.Stderr, "genfunctions:", err)
		os.Exit(1)
	}
}

// run compiles each TypeScript function source into checked-in JavaScript
// The docs builder embeds these outputs so consumers do not need esbuild during deployment
func run() error {
	// Keep the source/output list explicit so generated files are easy to audit in reviews
	functions := []functionSource{
		{Input: "functions/pls-script.ts", OutputDir: "functions/pls-script"},
		{Input: "functions/pls-api.ts", OutputDir: "functions/pls-api"},
	}

	for _, function := range functions {
		// Bundle each function independently because Vercel expects one handler per function directory
		err := bundleFunction(function)
		if err != nil {
			return err
		}
	}

	return nil
}

// bundleFunction compiles one TypeScript function source with esbuild
// The generated CommonJS file is what the Vercel Build Output API function embeds later
func bundleFunction(function functionSource) error {
	// Use esbuild's Go API so generation works from go generate without npm scripts
	result := api.Build(api.BuildOptions{
		Bundle:      true,
		EntryPoints: []string{function.Input},
		Format:      api.FormatCommonJS,
		LogLevel:    api.LogLevelSilent,
		Outfile:     filepath.Join(function.OutputDir, "index.js"),
		Platform:    api.PlatformNode,
		Sourcemap:   api.SourceMapInline,
		Target:      api.ES2020,
		TreeShaking: api.TreeShakingTrue,
		Write:       false,
	})

	if len(result.Errors) > 0 {
		// Surface the first bundling error because esbuild already formats it for humans
		return fmt.Errorf("bundle %s: %s", function.Input, result.Errors[0].Text)
	}

	if len(result.OutputFiles) != 1 {
		// Inline sourcemaps are embedded in the generated JavaScript file, so there should be one output
		return fmt.Errorf("bundle %s: expected 1 output file, got %d", function.Input, len(result.OutputFiles))
	}

	// Ensure the output directory exists before writing generated JavaScript with its inline sourcemap
	err := os.MkdirAll(function.OutputDir, 0o755)
	if err != nil {
		return fmt.Errorf("create output directory %s: %w", function.OutputDir, err)
	}

	// Write all generated output files with normal source-file permissions so they can be committed
	for _, outputFile := range result.OutputFiles {
		err = os.WriteFile(outputFile.Path, outputFile.Contents, 0o644)
		if err != nil {
			return fmt.Errorf("write %s: %w", outputFile.Path, err)
		}
	}

	return nil
}
