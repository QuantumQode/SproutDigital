# SEO: server-rendered content, clean URLs, structured data

Date: 2026-07-27
Status: approved design, ready for implementation planning

## Problem

PageSpeed flagged ~470 ms of render-blocking requests on sproutdigital.tech. Investigating that
surfaced a substantially larger issue: **the site's sellable content does not exist in the HTML.**

`js/main.js` holds the services copy, all four pricing tiers, the testimonials, the case studies,
and the process steps as JavaScript arrays, and injects them into empty containers at runtime:

```html
<div class="services-grid"  id="services-grid"></div>   <!-- index.html:142, services.html:68 -->
<div class="pricing-grid"   id="pricing-grid"></div>    <!-- pricing.html:71 -->
<div class="work-grid"      id="work-grid"></div>       <!-- work.html:71 -->
```

`curl https://sproutdigital.tech/pages/pricing.html` returns no mention of £200, £29, £350, or
£750. Googlebot renders JavaScript, but does so in a deferred second pass that is slower and less
reliable than the initial crawl. Every other consumer — Bing, AI search crawlers, LinkedIn and
Slack link unfurlers — sees empty containers.

For a business selling SEO services, this is the highest-value defect on the site.

## Scope

In scope, in dependency order:

- **Phase A** — move JS-rendered content into HTML
- **Phase B** — clean URLs (`/pricing/` rather than `/pages/pricing.html`)
- **Phase C** — structured data and per-page metadata

Explicitly out of scope, with reasons:

| Excluded | Reason |
| --- | --- |
| Render-blocking fixes (the original 470 ms) | Deliberately deferred by the site owner. Core Web Vitals is a light ranking signal; content-in-HTML is a heavy one. Phase A will incidentally improve LCP because content no longer waits on JS, but the PageSpeed line item will remain. |
| Inlining `styles.css` | Was Phase 1 only. `styles.css` stays external, so no CSS sync tooling is needed. |
| Self-hosting Google Fonts | Part of the deferred render-blocking work. |
| `robots.txt`, `sitemap.xml`, `404.html`, OG image, meta descriptions | Already shipped in commits `8d18278`/`bd89164`. |
| Cloudflare in front of GitHub Pages | Would unlock real 301s and long cache headers, but adds a DNS dependency. Revisit only if URL migration proves painful. |

## Constraints

**Hosting is raw GitHub Pages** (`server: GitHub.com` via Fastly; no proxy in front). Two consequences:

1. **No server-side 301 redirects are possible.** Old URLs must be retired with meta-refresh stubs.
2. **`cache-control: max-age=600` is forced on every asset** and cannot be changed. Not addressable
   without a CDN.

## Decisions

Each of these was chosen deliberately; the rationale matters more than the choice.

### D1 — Hand-write HTML, delete the renderers

Content moves into the `.html` files directly and the card-building code is deleted from `main.js`.
No build step, no dependencies, site stays deployable by `git push`.

Accepted cost: the services grid appears on both the homepage and the services page, so a copy
change means editing two files. This content changes rarely; a build system to solve it is not
justified.

### D2 — Move URLs now, with meta-refresh stubs

The site is young and lightly indexed, so migration is cheapest now. A zero-second meta refresh
plus a canonical is treated by Google as a soft 301 and passes most signal — the closest available
substitute for a real redirect on GitHub Pages.

### D3 — The keyword ticker stays JS-rendered

`tickerKeywords` is ten unrelated local-service phrases ("plumber near me", "emergency
electrician", "dog groomer open now") and the marquee renders each **twice**. Baking twenty
keyword spans for services SproutDigital does not sell onto the homepage is a keyword-stuffing
signal. The ticker is decorative, carries no SEO value worth capturing, and is therefore a
deliberate exception to Phase A.

### D4 — Pricing CTAs point at `/contact/?plan=<Name>`

The Stripe Payment Links do not exist yet; `main.js:54,60,64` still hold
`STRIPE_LINK_PLACEHOLDER_*`. These already render into live `href` attributes, so
`https://sproutdigital.tech/pages/STRIPE_LINK_PLACEHOLDER_LAUNCH` currently returns **404** — the
Buy buttons are broken in production today, independent of this work.

Rather than hardcode broken links into HTML, the primary CTA targets the contact page carrying the
plan name. This requires no new machinery: `main.js` already reads `?plan=` and pre-selects the
matching option, and the option values (`Launch`, `Growth`, `Scale`) match the plan names exactly.

**`rel="nofollow"` is deliberately *not* applied.** The owner initially chose nofollow when the CTA
still pointed at a broken placeholder URL, where suppressing crawls was the goal. Once the target
became `/contact/` — an internal page that should be crawled and indexed — nofollow inverts from
protective to harmful: it tells Google not to follow a link to the site's primary conversion page
and wastes internal link equity. Carrying the earlier preference forward would contradict its own
rationale.

When real Stripe Payment Links replace these hrefs, `rel="nofollow"` *should* be added at that
point: external checkout URLs genuinely are not worth crawl budget. Note the Launch link must
bundle the £200 one-time price with the £29/mo Foundation subscription.

## Phase A — content into HTML

Render these containers as static markup:

| Container | Files | Source data |
| --- | --- | --- |
| `services-grid` | `index.html:142`, `services.html:68` | `services` |
| `process-grid` | `services.html:110` | `steps` |
| `pricing-grid` | `pricing.html:71` | `plans` |
| `testimonials-grid` | `index.html:233` | `testimonials` |
| `work-grid` | `index.html:247` (first 3), `work.html:71` (all 4) | `projects` |
| `ticker-track` | `index.html:220` | **unchanged — see D3** |

Markup must reproduce the existing DOM exactly, including class names, `liftcard` hooks, and the
per-card CSS custom properties on work cards (`--wa`, `--wt-a`, `--wt-b`), so no CSS changes are
required.

### `main.js` reduction

Every helper is used *only* by the renderers — `el()`, `ICONS`, `starsRow()`, `browserMockHTML()`,
`mockPageInner`, `inPagesDir`, `pagePrefix` have zero references after line 215. The cut is clean.

Delete: the five renderers, the `services`/`projects`/`steps`/`testimonials`/`plans` arrays, `ICONS`,
and all six helpers.

Keep: `tickerKeywords` and the ticker renderer (D3), `reducedMotion`, `fineHover`,
`animateCounters()`, `onInView()`, the nav toggle, the scroll handler, the rotating hero word, the
hero tilt, scroll reveal, and the contact form.

Expected: **456 lines → roughly 240.**

### H1 — no change required (corrected 2026-07-27)

An earlier draft of this spec claimed `index.html`'s H1 was a dangling `"A website that "` awaiting
a JS-supplied word. **That was wrong.** It came from a truncating grep (`<h1[^>]*>[^<]*`) that
stopped at the first nested `<span>` and hid the rest of the line.

The markup at `index.html:92` is already correct and fully crawlable:

```html
<h1>A website that <span id="rotating-word"><span class="rotating-word-inner">grows</span></span> for your business.</h1>
```

Confirmed against production with JavaScript disabled — `curl https://sproutdigital.tech/` returns
the complete sentence. The rotation logic mutates `textContent` of an already-populated span, so
there is no empty-element problem. **No H1 work is in scope.**

## Phase B — clean URLs

| Current | New |
| --- | --- |
| `pages/services.html` | `services/index.html` |
| `pages/work.html` | `work/index.html` |
| `pages/pricing.html` | `pricing/index.html` |
| `pages/contact.html` | `contact/index.html` |
| `pages/thank-you.html` | `thank-you/index.html` |

`index.html` and `404.html` stay at the root.

Each old path keeps a stub:

```html
<link rel="canonical" href="https://sproutdigital.tech/pricing/">
<meta http-equiv="refresh" content="0; url=/pricing/">
<meta name="robots" content="noindex">
```

`thank-you` needs no stub — it is fully orphaned: nothing links to it, it is absent from the
sitemap, and the contact form submits over AJAX with an inline success state rather than
redirecting. It should carry `noindex` at its new path.

### Link rewriting

119 internal page links across 7 files, currently a mix of relative and root-relative forms
(`contact.html`, `pages/contact.html`, `/pages/contact.html`). 15 are already `/` and need no
change, leaving 104 to rewrite. **Convert all to root-relative** (`/contact/`) so link correctness
no longer depends on the file's directory depth.

Stylesheet references (`../css/styles.css`, `css/styles.css`, `/css/styles.css`) likewise become
`/css/styles.css`. Directory depth happens to be unchanged by the move, but relying on that is
fragile.

Also update: `sitemap.xml` to the new URLs with a current `lastmod`, and every `<link rel="canonical">`
and `og:url`.

## Phase C — structured data

| Page | Schema |
| --- | --- |
| `/` | Existing `ProfessionalService`, plus `WebSite` |
| `/services/` | `Service` per offering, plus `BreadcrumbList` |
| `/pricing/` | `FAQPage` (the existing "Frequently asked" section), `OfferCatalog` covering all four plans, plus `BreadcrumbList` |
| `/work/` | `ItemList` of `CreativeWork`, plus `BreadcrumbList` |
| `/contact/` | `ContactPage`, plus `BreadcrumbList` |

`FAQPage` on pricing is the single highest-value item — it is the only markup here eligible for a
visible rich result.

### Do not mark up testimonials as `Review`

The three testimonials move into HTML as ordinary text, **not** as `Review` or `AggregateRating`.
Self-serving review markup — reviews about your own business, hosted on your own site — is
ineligible for rich results under Google's policy and risks a manual action. The testimonials are
valuable as crawlable content; marking them up is a liability.

## Verification

- `curl` each page and confirm plan prices, service copy, testimonials, and case studies are present
  in the raw HTML with JavaScript never executed.
- Every internal link resolves; no request to a `STRIPE_LINK_PLACEHOLDER_*` path.
- Old `pages/*.html` paths still resolve and carry a canonical to the new URL.
- Validate each JSON-LD block against the Rich Results Test.
- Confirm rendered DOM is visually unchanged: no CSS edits were in scope, so any visual diff means
  the static markup deviates from what the renderers produced.
- Re-run PageSpeed to record the LCP change, with the render-blocking line item still expected.

## Risks

- **Phase A and Phase B both rewrite the same HTML files.** They must run sequentially, A then B.
- **Markup drift** — hand-written cards that differ from renderer output will break silently under
  existing CSS. Compare rendered DOM before and after.
- **Phase B is the highest-effort, lowest-reward phase.** File moves and stubs across 7 pages to fix
  something with near-zero direct ranking impact. It was chosen knowingly, on the grounds that
  migration only gets more expensive once backlinks accumulate. Dropping it would not undermine
  Phases A or C.
