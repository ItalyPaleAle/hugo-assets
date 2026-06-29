# docs — Hugo theme

A documentation theme for Hugo, distributed as a Hugo Module.

## Markdown output (agent-friendly pages)

Every page can be published as a plain‑markdown twin alongside its HTML, intended
primarily for AI agents. For a page at `/docs/setup/`, Hugo writes the markdown to
the physical file `/docs/setup/index.md`, which is served on Vercel at the clean
URL **`/docs/setup.md`** (see [Clean `.md` URLs on Vercel](#clean-md-urls-on-vercel)).
The markdown contains:

- the page title, description, and body as **markdown** (not HTML), with shortcodes
  expanded (`.RenderShortcodes`);
- internal links rewritten to point at the clean markdown twin
  (`[other](/docs/other/)` → `[other](/docs/other.md)`);
- for section and home pages, a list of child pages linking to their `.md` twins.

Each HTML page advertises its markdown twin both in `<head>` and as an HTTP
response header (the latter added by the Vercel builder, so clients that only read
headers can discover it without parsing HTML):

```html
<link rel="alternate" type="text/markdown" href="/docs/setup.md" />
```

```http
Link: </docs/setup.md>; rel="alternate"; type="text/markdown"
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

- Hugo writes the markdown to `/<page>/index.md` (next to the pretty HTML at
  `/<page>/`); the clean `/<page>.md` URL is produced by the Vercel rewrite below.
  The clean links therefore resolve **only through Vercel** — under `hugo server`
  or another host, follow `/<page>/index.md` directly instead.
- Link rewriting is a best‑effort transform on the markdown body. It rewrites
  **root‑relative** internal links (targets beginning with `/`). External links
  (`http`, `https`, `mailto`, `tel`), pure `#anchor` links, and any target
  containing a file extension (e.g. `/img/x.png`, existing `.md`) are left alone.
  Relative links (`other/`, `../other/`) are not rewritten — author root‑relative
  links if you want them pointed at the markdown twins.
- Shortcodes that emit HTML (e.g. `callout`, `tabs`, `figure`, `mermaid`) appear
  as HTML blocks in the markdown output. GitHub‑style alerts (`> [!NOTE]`) remain
  clean markdown blockquotes.

## Clean `.md` URLs on Vercel

Sites deploy through the Build Output API builder at `cmd/vercel-docs-build`, which
runs Hugo and writes `.vercel/output/config.json`. The builder bakes in the routing
that turns the physical `/<page>/index.md` files into clean URLs:

- **Rewrite** — a request for `/docs/setup.md` is internally served from
  `/docs/setup/index.md`; the clean URL stays in the address bar.
- **Redirect** — a request for the physical `/docs/setup/index.md` returns a `308`
  to `/docs/setup.md`, so the clean URL is the single public address.
- **Canonical** — markdown responses carry a `Link: <…>; rel="canonical"` header
  pointing at the HTML page, so search engines index the HTML, not the markdown.
  The canonical origin comes from `VERCEL_PROJECT_PRODUCTION_URL` (set automatically
  by Vercel) or the `DOCS_CANONICAL_BASE` override; if neither is set the canonical
  header is omitted.

The home page is the one exception: it has no clean `.md` sibling and is served at
`/index.md`.

### Project hook: redirects and rewrites

The builder also translates a project's own `redirects` and `rewrites` from
`vercel.json` into the output config (in addition to `headers`, which it already
preserved). `source` is treated as a regular expression, matching how this builder
handles header rules. Add project‑specific rules to your `vercel.json`:

```json
{
  "redirects": [
    { "source": "^/old-page$", "destination": "/docs/setup.md", "permanent": true }
  ],
  "rewrites": [
    { "source": "^/llms\\.txt$", "destination": "/llms/index.txt" }
  ]
}
```

See [`examples/vercel.json`](examples/vercel.json) for a complete reference config.

## Generating `hugo.toml` from `docs.json`

A docs site's `hugo.toml` is mostly theme‑required boilerplate (markup render hooks,
the module import, disabled taxonomies) with only a handful of project‑specific
values. To avoid copying that boilerplate into every project, the builder can
generate `hugo.toml` from a small `docs.json` metadata file.

If `docs.json` exists in the project root, the builder generates `hugo.toml` from it
before running Hugo; the generated file can be git‑ignored. If `docs.json` is absent,
the builder leaves any hand‑written `hugo.toml` untouched, so existing projects keep
working unchanged.

```json
{
  "baseURL": "https://francis.italypaleale.me/",
  "title": "Francis",
  "locale": "en-us",
  "description": "The simple & low-maintenance Go distributed actor framework",
  "plausibleAnalytics": true,
  "github": {
    "url": "https://github.com/ItalyPaleAle/francis",
    "repo": "https://github.com/ItalyPaleAle/francis",
    "branch": "main"
  },
  "theme": {
    "scheme": "francis",
    "iconLight": "icon-light.svg",
    "iconDark": "icon-dark.svg",
    "favicon": "icon-light.svg"
  },
  "imageMounts": [
    { "source": "img", "target": "assets/docs/img" }
  ]
}
```

Only `baseURL` and `title` are required; `locale` defaults to `en-us`, and every
other field is optional. The theme module import, `disableKinds`, the `[markup]`
configuration, and the empty `[taxonomies]` block are added automatically. See
[`examples/docs.json`](examples/docs.json) for the reference file.
