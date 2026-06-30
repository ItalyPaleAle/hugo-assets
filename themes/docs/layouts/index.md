# {{ .Title | default .Site.Title }}
{{ with .Params.description }}
{{ . }}
{{ end }}
{{ with .RawContent }}{{ partial "markdown-body.txt" $ }}
{{ end -}}
{{- with .Pages }}
{{ range $p := . }}- [{{ $p.Title }}]({{ with partial "markdown-url.html" $p }}{{ . }}{{ else }}{{ $p.RelPermalink }}{{ end }})
{{ end -}}
{{- end -}}
