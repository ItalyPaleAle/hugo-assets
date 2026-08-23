{{- /*
  index.notfound.md — the markdown body of the "page not found" response, published
  at /404.md and served to clients that asked for markdown (see the Vercel builder's
  404 routes). It exists so an agent that hits a dead link gets something it can act
  on: where the site's index, sitemap, and markdown twins are, plus the top-level
  sections.

  It hangs off the home page because Hugo renders the 404 page kind for the HTML
  output format only; the "notfound" output format's baseName writes it to /404.md.

  The "index." prefix is required, not cosmetic. The "markdown" and "notfound" output
  formats share the text/markdown media type, so both of this file's siblings for the
  home page are ".md" templates and Hugo's lookup ranks them against each other. Named
  "home.notfound.md" this template outranks index.md for the *markdown* format too, and
  the home page's own twin at /index.md comes out as the 404 body; sharing index.md's
  base name keeps the output format the only thing that distinguishes them, so each
  format gets its own template. Renaming this file will silently break /index.md.
*/ -}}
# Page not found

There is no page at this address on {{ .Site.Title }}. It may have been moved or renamed.

## Where to look next

- [{{ .Site.Title }} home]({{ "index.md" | relURL }}){{ with .Site.Params.description }}: {{ . }}{{ end }}
- [Sitemap]({{ "sitemap.xml" | relURL }}): every page on this site
{{- with .Site.Params.robots }}{{ if .llmsTXT }}
- [llms.txt]({{ "llms.txt" | relURL }}): a compact index of this site for AI agents
{{- end }}{{ end }}

Every page is also published as markdown: append `.md` to a page URL
(`/docs/setup/` → `/docs/setup.md`), or send `Accept: text/markdown`.
{{- with (.Site.GetPage "/").Sections }}

## Sections
{{ range . }}
- [{{ .Title }}]({{ with partial "markdown-url.html" . }}{{ . }}{{ else }}{{ .RelPermalink }}{{ end }}){{ with .Description }}: {{ . }}{{ end }}
{{- range .Pages }}
  - [{{ .Title }}]({{ with partial "markdown-url.html" . }}{{ . }}{{ else }}{{ .RelPermalink }}{{ end }}){{ with .Description }}: {{ . }}{{ end }}
{{- end }}
{{- end }}
{{- end }}
