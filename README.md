# docs — Hugo theme

A documentation theme for Hugo, distributed as a Hugo Module.

## Markdown output (agent-friendly pages)

Every page can be published as a plain‑markdown twin alongside its HTML, intended primarily for AI agents. For a page at `/docs/setup/`, Hugo writes the markdown to the physical file `/docs/setup/index.md`, which is served on Vercel at the clean URL **`/docs/setup.md`** (see [Clean `.md` URLs on Vercel](#clean-md-urls-on-vercel)). The markdown contains:

- the page title, description, and body as **markdown** (not HTML), with shortcodes expanded (`.RenderShortcodes`);
- internal links rewritten to point at the clean markdown twin (`[other](/docs/other/)` → `[other](/docs/other.md)`);
- for section and home pages, a list of child pages linking to their `.md` twins.

Each HTML page advertises its markdown twin both in `<head>` and as an HTTP response header (the latter added by the Vercel builder, so clients that only read headers can discover it without parsing HTML):

```html
<link rel="alternate" type="text/markdown" href="/docs/setup.md" />
```

```http
Link: </docs/setup.md>; rel="alternate"; type="text/markdown"
```

The same markdown is also served from the page's own URL to clients that ask for it with an `Accept` header — see [Markdown content negotiation](#markdown-content-negotiation-accept-textmarkdown).

### Enabling it in your site

The theme ships the `text/markdown` media type and the `markdown` and `notfound` output formats, and they are inherited automatically when you use the theme. However, Hugo does **not** merge the `outputs` setting from a theme/module (its merge strategy is `none`), so you must add this block to **your site's** configuration:

```toml
[outputs]
  home    = ["html", "markdown", "notfound"]
  section = ["html", "markdown"]
  page    = ["html", "markdown"]
```

That is the only configuration required. Rebuild and the `.md` files (plus the `rel="alternate"` links) will be generated. `notfound` is what publishes the markdown 404 body at `/404.md`; it hangs off the home page because Hugo renders the 404 page kind for the HTML output format only. Because it shares the `text/markdown` media type with `markdown`, its template has to be named `layouts/index.notfound.md` — the base name it shares with `layouts/index.md` leaves the output format as the only difference between them, and Hugo's lookup then gives each format its own template. Sites generated from `config.json` get this block automatically.

### Notes & limitations

- Hugo writes the markdown to `/<page>/index.md` (next to the pretty HTML at `/<page>/`); the clean `/<page>.md` URL is produced by the Vercel rewrite below. The clean links therefore resolve **only through Vercel** — under `hugo server` or another host, follow `/<page>/index.md` directly instead.
- Link rewriting is a best‑effort transform on the markdown body. It rewrites **root‑relative** internal links (targets beginning with `/`). External links (`http`, `https`, `mailto`, `tel`), pure `#anchor` links, and any target containing a file extension (e.g. `/img/x.png`, existing `.md`) are left alone. Relative links (`other/`, `../other/`) are not rewritten — author root‑relative links if you want them pointed at the markdown twins.
- Shortcodes that emit HTML (e.g. `callout`, `tabs`, `figure`, `mermaid`) appear as HTML blocks in the markdown output. GitHub‑style alerts (`> [!NOTE]`) remain clean markdown blockquotes.

## Clean `.md` URLs on Vercel

Sites deploy through the Build Output API builder at `cmd/vercel-docs-build`, which runs Hugo and writes `.vercel/output/config.json`. The builder bakes in the routing that turns the physical `/<page>/index.md` files into clean URLs:

- **Rewrite** — a request for `/docs/setup.md` is internally served from `/docs/setup/index.md`; the clean URL stays in the address bar.
- **Redirect** — a request for the physical `/docs/setup/index.md` returns a `308` to `/docs/setup.md`, so the clean URL is the single public address.
- **Canonical** — markdown responses carry a `Link: <…>; rel="canonical"` header pointing at the HTML page, so search engines index the HTML, not the markdown. The canonical origin comes from `baseURL` in `config.json`, or the `DOCS_CANONICAL_BASE` environment override; if neither is set the canonical header is omitted.

The two markdown files at the root of the site are the exception: `/index.md` (the home page's twin, which has no clean `.md` sibling) and `/404.md` (the markdown 404 body) are the physical files themselves, so the rewrite skips them and they are served straight off the filesystem.

### Default headers

The builder bakes in a set of security and cache headers that apply to every site:

- `Permissions-Policy: interest-cohort=()` and `Referrer-Policy: strict-origin-when-cross-origin` on all responses;
- a strict `Content-Security-Policy` and `X-Frame-Options: SAMEORIGIN` on HTML pages;
- long‑lived `Cache-Control` on `/img`, `/fonts`, `*.svg|png`, and `/js`+`/css` assets.

These defaults live in the builder-managed [`cmd/vercel-docs-build/vercel.json`](cmd/vercel-docs-build/vercel.json), which is the single source of truth (see [Builder-managed `vercel.json`](#builder-managed-verceljson)).

### Plausible proxy

When `plausibleAnalytics` is on, pages load the Plausible script from `/pls/index.<random>.js` and send events to `/pls/api/event`. The builder serves both paths from a Node.js [Routing Middleware](https://vercel.com/docs/routing-middleware) (`_middleware`), which Vercel deploys to every region, so the proxy runs close to each visitor rather than in the project's single function region. The upstream comes from the `PLAUSIBLE_SCRIPT` and `PLAUSIBLE_API_EVENT` environment variables, and requests to it carry a Vercel OIDC token (with the audience in `PLAUSIBLE_OIDC_TOKEN_AUDIENCE`, if set). The script is kept in the Runtime Cache, which is per region.

### Project hook: extra headers, redirects, and rewrites

Custom routing goes in **your project's `config.json`** (see [Generating `hugo.toml` from `config.json`](#generating-hugotoml-from-configjson)), not in `vercel.json`, which the builder owns. Add your own `headers`, `redirects`, and `rewrites`; `source` is treated as a regular expression. They are layered *on top of* the defaults, so repeating a default header key overrides its value (e.g. to tighten the CSP or change a cache time).

```json
{
  "headers": [
    {
      "source": "/(.*?)",
      "headers": [
        { "key": "Foo", "value": "Bar" }
      ]
    }
  ],
  "redirects": [
    { "source": "^/old-page$", "destination": "/docs/setup.md", "permanent": true }
  ],
  "rewrites": [
    { "source": "^/llms\\.txt$", "destination": "/llms/index.txt" }
  ]
}
```

### Builder-managed `vercel.json`

The builder owns `vercel.json` and writes it to the project root on every build from its
embedded [`cmd/vercel-docs-build/vercel.json`](cmd/vercel-docs-build/vercel.json). It pins the
project/build settings every docs site shares — `fluid`, `buildCommand`, `devCommand`,
`cleanUrls`, `trailingSlash`, `framework` — plus the default headers above. These cannot be overridden per
project: hand edits are reverted on the next build.

Because Vercel reads `vercel.json` *before* the build runs, the generated file must be
**committed** (unlike `hugo.toml`, which can be git‑ignored). Do not edit it by hand — put
custom routing in `config.json` instead.

## Markdown content negotiation (`Accept: text/markdown`)

The clean `.md` URL is the discoverable address, but an agent shouldn't have to rewrite URLs to get markdown. Every page URL also answers with its markdown twin when the request asks for it, following the [acceptmarkdown.com](https://acceptmarkdown.com) convention:

```console
$ curl -sI -H 'Accept: text/markdown' https://example.com/docs/setup/ \
  | grep -i '^content-type\|^vary' content-type: text/markdown; charset=utf-8 vary: Accept, Accept-Encoding
```

- The negotiated response is served from the same physical file as `/docs/setup.md`, so both routes return identical bytes; the URL stays as requested.
- `Vary: Accept` is set on every page URL — on the HTML variant too — so a CDN or browser cache never hands the markdown to a browser, or the HTML to an agent.
- Markdown wins only when the client asks for it at full quality. An `Accept` that ranks it below HTML (`text/html, text/markdown;q=0.5`) gets HTML, and a browser's `Accept` never mentions `text/markdown` at all, so pages render normally.
- Assets (anything with a file extension) and the `/pls/*` analytics endpoints are never negotiated.

## Agent-friendly 404s

A missing path returns a real `404` with a body the client can recover from, rather than a bare status:

- By default — including for a client that sends no `Accept` at all — the response is the theme's rendered 404 page, which links to the site index, the sitemap, `llms.txt` (when enabled), and every section.
- Clients that ask for markdown get the same links as markdown from `/404.md`, published by the theme's `notfound` output format. That is `Accept: text/markdown` on the same terms as a page URL, or any request for a `.md` address.

```console
$ curl -s -o /dev/null -w '%{http_code}\n' https://example.com/nope
404
```

Both are wired up as fallback routes below the Build Output API's `filesystem` handler, so they are reached only once nothing on disk matched — a function's 5xx is never reported as a missing page — and only for the representations the build actually produced: a site whose layouts render no 404 page keeps Vercel's default 404 instead of being routed to a file that doesn't exist.

## Generating `hugo.toml` from `config.json`

`config.json` is the single file a project authors. It supplies the site metadata the builder turns into `hugo.toml`, plus the optional `headers`/`redirects`/`rewrites` covered in [Project hook](#project-hook-extra-headers-redirects-and-rewrites). (Not to be confused with the generated Build Output API `.vercel/output/config.json`.)

A docs site's `hugo.toml` is mostly theme‑required boilerplate (markup render hooks, the module import, disabled taxonomies) with only a handful of project‑specific values. To avoid copying that boilerplate into every project, the builder generates `hugo.toml` from `config.json`.

If `config.json` exists in the project root, the builder generates `hugo.toml` from it before running Hugo; the generated `hugo.toml` can be git‑ignored. If `config.json` is absent, the builder leaves any hand‑written `hugo.toml` untouched, so existing projects keep working unchanged.

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
    "branch": "main",
    "path": "docs"
  },
  "theme": {
    "scheme": "francis",
    "iconLight": "icon-light.svg",
    "iconDark": "icon-dark.svg",
    "favicon": "icon-light.svg"
  },
  "robots": {
    "llmsTXT": true,
    "disallow": []
  },
  "imageMounts": [
    { "source": "img", "target": "assets/docs/img" }
  ]
}
```

Only `baseURL` and `title` are required; `locale` defaults to `en-us`, and every other field is optional. `github.branch` defaults to `main` if omitted. Set `github.path` when the docs content isn't at the repo root (e.g. a project that keeps its docs under `/docs`, like [traefik-forward-auth](https://github.com/ItalyPaleAle/traefik-forward-auth)) — it's prepended to each page's "Edit this page on GitHub" link. Set `robots.llmsTXT` to publish `/llms.txt`, and use `robots.disallow` for additional paths in `/robots.txt`. The theme module import, `disableKinds`, the `[markup]` configuration, and the empty `[taxonomies]` block are added automatically. See [`examples/config.json`](examples/config.json) for the reference file.
