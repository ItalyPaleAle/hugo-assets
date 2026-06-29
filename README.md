# docs — Hugo theme

A documentation theme for Hugo, distributed as a Hugo Module.

## Markdown output (agent-friendly pages)

Every page can be published as a plain‑markdown twin alongside its HTML, intended
primarily for AI agents. For a page at `/docs/setup/`, Hugo also writes
`/docs/setup/index.md` containing:

- the page title, description, and body as **markdown** (not HTML), with shortcodes
  expanded (`.RenderShortcodes`);
- internal links rewritten to point at the markdown twin
  (`[other](/docs/other/)` → `[other](/docs/other/index.md)`);
- for section and home pages, a list of child pages linking to their `.md` twins.

Each HTML page advertises its markdown twin in `<head>`:

```html
<link rel="alternate" type="text/markdown" href="https://example.com/docs/setup/index.md" />
```

### Enabling it in your site

The theme ships the `text/markdown` media type and the `markdown` output format,
and they are inherited automatically when you use the theme. However, Hugo does
**not** merge the `outputs` setting from a theme/module (its merge strategy is
`none`), so you must add this block to **your site's** configuration:

```toml
[outputs]
  home    = ["html", "markdown"]
  section = ["html", "markdown"]
  page    = ["html", "markdown"]
```

That is the only configuration required. Rebuild and the `.md` files (plus the
`rel="alternate"` links) will be generated.

### Notes & limitations

- Published path is `/<page>/index.md` (next to the pretty HTML at `/<page>/`).
  Producing a literal `/<page>.md` sibling would require global `uglyURLs`, which
  would also make the HTML pages ugly — so it is intentionally not used.
- Link rewriting is a best‑effort transform on the markdown body. It rewrites
  **root‑relative** internal links (targets beginning with `/`). External links
  (`http`, `https`, `mailto`, `tel`), pure `#anchor` links, and any target
  containing a file extension (e.g. `/img/x.png`, existing `.md`) are left alone.
  Relative links (`other/`, `../other/`) are not rewritten — author root‑relative
  links if you want them pointed at the markdown twins.
- Shortcodes that emit HTML (e.g. `callout`, `tabs`, `figure`, `mermaid`) appear
  as HTML blocks in the markdown output. GitHub‑style alerts (`> [!NOTE]`) remain
  clean markdown blockquotes.
