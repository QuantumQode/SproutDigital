# SEO: Server-Rendered Content, Clean URLs, Structured Data — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Get SproutDigital's sellable content (services, pricing, testimonials, case studies) into static HTML, migrate to extensionless URLs, and add structured data — so crawlers see the content without executing JavaScript.

**Architecture:** A one-shot Node generator reuses the *existing* template literals and data arrays from `js/main.js` to emit byte-identical markup, which is pasted into the HTML files. The renderers are then deleted from `main.js`. A dependency-free `node:test` suite asserts content presence in raw HTML, link integrity, and JSON-LD validity. The generator is deleted once used — no build step enters the deploy path.

**Tech Stack:** Static HTML/CSS/JS on GitHub Pages. Node 24 (`node --test`, built-in) for verification only. Zero runtime dependencies, no `package.json`.

## Global Constraints

- **No new runtime dependencies.** No `package.json`, no npm install. Tests use Node's built-in `node:test` and `node:assert/strict` only.
- **No build step in the deploy path.** The site must stay deployable by `git push`. The generator in Task 2 is a one-shot migration tool and is deleted in Task 3.
- **Do not modify `css/styles.css`.** Generated markup must reproduce the existing DOM exactly — same tags, class names, attribute order-independence, and custom properties — so no CSS change is needed. Any visual diff means the markup deviated.
- **The keyword ticker stays JS-rendered.** `tickerKeywords` and its renderer remain in `main.js`. Rationale in spec D3: 20 spans of unrelated local-service keywords in homepage HTML is a keyword-stuffing signal.
- **No `Review` or `AggregateRating` schema.** Self-serving review markup is ineligible for rich results and risks a manual action. Testimonials ship as plain text.
- **No `rel="nofollow"` on internal links.** Spec D4: the CTA target is `/contact/`, a page that should be crawled.
- **All internal links root-relative** (`/contact/`, `/css/styles.css`) — never depth-dependent.
- **Canonical host:** `https://sproutdigital.tech` (no `www`, no trailing `index.html`).
- **H1 is out of scope.** Already correct at `index.html:92`; an earlier spec draft claimed otherwise and was corrected.

---

## File Structure

**Created:**
- `tests/seo.test.mjs` — content-presence, link-integrity, and JSON-LD assertions
- `tests/helpers.mjs` — shared file-reading and link-extraction utilities
- `tools/generate-markup.mjs` — one-shot generator (deleted in Task 3)
- `services/index.html`, `work/index.html`, `pricing/index.html`, `contact/index.html`, `thank-you/index.html`
- `pages/{services,work,pricing,contact}.html` — replaced with redirect stubs

**Modified:**
- `index.html` — static services, testimonials, work grids; root-relative links; schema
- `js/main.js` — renderers deleted (456 → ~240 lines)
- `sitemap.xml` — new URLs, current `lastmod`
- `404.html` — root-relative links

**Deleted:**
- `pages/thank-you.html` (orphaned; moves without a stub)

---

## Task 1: Test harness and failing content assertions

Establishes the red state. These tests describe the goal and must fail now.

**Files:**
- Create: `tests/helpers.mjs`
- Create: `tests/seo.test.mjs`

**Interfaces:**
- Produces: `readPage(relPath) -> string`, `internalLinks(html) -> string[]`, `jsonLdBlocks(html) -> object[]` — used by every later task's tests.

- [ ] **Step 1: Write the test helpers**

```javascript
// tests/helpers.mjs
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export function readPage(relPath) {
  return readFileSync(join(ROOT, relPath), 'utf8');
}

export function pageExists(relPath) {
  return existsSync(join(ROOT, relPath));
}

/** All href values that are not external, anchor-only, mailto, tel, or data URIs. */
export function internalLinks(html) {
  return [...html.matchAll(/href="([^"]+)"/g)]
    .map(m => m[1])
    .filter(h => !/^(https?:|#|mailto:|tel:|data:)/.test(h));
}

/** Parsed contents of every <script type="application/ld+json"> block. */
export function jsonLdBlocks(html) {
  return [...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )].map(m => JSON.parse(m[1]));
}

/** Every page that should be reachable and indexable, by final URL path. */
export const PAGES = [
  { url: '/',            file: 'index.html' },
  { url: '/services/',   file: 'services/index.html' },
  { url: '/work/',       file: 'work/index.html' },
  { url: '/pricing/',    file: 'pricing/index.html' },
  { url: '/contact/',    file: 'contact/index.html' },
];
```

- [ ] **Step 2: Write the failing content-presence tests**

```javascript
// tests/seo.test.mjs
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, pageExists, internalLinks, jsonLdBlocks, PAGES } from './helpers.mjs';

describe('content is present in raw HTML (no JS execution)', () => {
  test('pricing page states every plan price', () => {
    const html = readPage('pricing/index.html');
    for (const price of ['£200', '£29', '£350', '£750']) {
      assert.ok(html.includes(price), `missing price ${price}`);
    }
  });

  test('pricing page names every plan', () => {
    const html = readPage('pricing/index.html');
    for (const name of ['Launch', 'Foundation', 'Growth', 'Scale']) {
      assert.ok(html.includes(name), `missing plan ${name}`);
    }
  });

  test('services copy appears on both homepage and services page', () => {
    for (const file of ['index.html', 'services/index.html']) {
      const html = readPage(file);
      for (const title of ['Website design & build', 'Google &amp; Meta Ads', 'SEO']) {
        assert.ok(html.includes(title), `${file} missing service "${title}"`);
      }
    }
  });

  test('homepage contains testimonial quotes and attribution', () => {
    const html = readPage('index.html');
    assert.ok(html.includes('James T.'), 'missing testimonial author');
    assert.ok(html.includes('booked solid two weeks out'), 'missing quote text');
    assert.ok(html.includes('52 leads/month'), 'missing metric');
  });

  test('work pages contain case studies', () => {
    const home = readPage('index.html');
    const work = readPage('work/index.html');
    // Homepage shows the first three only (data-limit="3").
    for (const name of ['GIAT LTD', 'NinjaPlumbers', 'DiyahAesthetics']) {
      assert.ok(home.includes(name), `homepage missing ${name}`);
    }
    assert.ok(!home.includes('ShineyPetGrooming'), 'homepage should show only 3 projects');
    // Work page shows all four.
    for (const name of ['GIAT LTD', 'NinjaPlumbers', 'DiyahAesthetics', 'ShineyPetGrooming']) {
      assert.ok(work.includes(name), `work page missing ${name}`);
    }
  });

  test('services page contains all four process steps', () => {
    const html = readPage('services/index.html');
    for (const step of ['Free audit', 'Design &amp; build', 'Launch &amp; optimize', 'Grow']) {
      assert.ok(html.includes(step), `missing step "${step}"`);
    }
  });
});
```

- [ ] **Step 3: Run the tests and confirm they fail**

Run: `node --test`

Expected: **FAIL.** Errors will be `ENOENT` on `pricing/index.html` etc. (those paths don't exist yet) and missing-content assertions. This is the correct red state — it proves the tests actually check something.

- [ ] **Step 4: Commit**

```bash
git add tests/
git commit -m "test: add failing SEO content-presence assertions"
```

---

## Task 2: Generate static markup from existing templates

The generator copies the data arrays and template literals verbatim from `js/main.js` so output is identical to what the renderers produce at runtime. It writes HTML fragments to disk for pasting.

**Files:**
- Create: `tools/generate-markup.mjs`
- Create: `tools/out/*.html` (generated fragments, not committed)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: HTML fragments on disk. Nothing imports this — it is run once by hand.

- [ ] **Step 1: Write the generator**

Copy `ICONS`, `services`, `projects`, `steps`, `testimonials`, `plans`, `starsRow`, `browserMockHTML`, and `mockPageInner` verbatim from `js/main.js:1-99`, then reproduce each renderer as a string-returning function. The generator must not import `main.js` — that file calls `matchMedia` at top level and would crash in Node.

```javascript
// tools/generate-markup.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), 'out');
mkdirSync(OUT, { recursive: true });

// ---- VERBATIM COPY from js/main.js:1-10 ----
const ICONS = { /* paste ICONS object exactly as it appears in js/main.js */ };

// ---- VERBATIM COPY from js/main.js:13-65 ----
const services = [ /* paste */ ];
const projects = [ /* paste */ ];
const steps = [ /* paste */ ];
const testimonials = [ /* paste */ ];
const plans = [ /* paste */ ];

// ---- VERBATIM COPY from js/main.js:80-99 ----
function starsRow(count = 5) {
  return `<div class="testimonial-stars" role="img" aria-label="Rated ${count} out of 5 stars">${ICONS.star.repeat(count)}</div>`;
}
function browserMockHTML(url, extraPageHTML) {
  return `
    <div class="browser-mock" aria-hidden="true">
      <div class="mock-bar"><span class="mock-dot"></span><span class="mock-dot"></span><span class="mock-dot"></span><span class="mock-url">${url}</span></div>
      <div class="mock-page">${extraPageHTML}</div>
    </div>`;
}
const mockPageInner = `
  <div class="mock-nav"><span class="mock-logo"></span><span class="mock-links"><i></i><i></i><i></i></span><span class="mock-btn"></span></div>
  <div class="mock-hero">
    <div class="mock-h1"></div><div class="mock-h1 short"></div>
    <div class="mock-text"></div><div class="mock-text short"></div>
    <div class="mock-cta"></div>
  </div>
  <div class="mock-cards"><i></i><i></i><i></i></div>`;

// ---- Renderers, mirroring js/main.js:100-207 ----
const servicesHTML = () => services.map(s => `
    <article class="service-card liftcard">
      <div class="icon-wrap">${s.icon}</div>
      <h3 class="title">${s.title}</h3>
      <div class="body">${s.body}</div>
    </article>`).join('');

const workHTML = (limit = projects.length) => projects.slice(0, limit).map(p => `
    <a class="work-card liftcard" href="/contact/?project=${encodeURIComponent(p.name)}"
       aria-label="${p.name} — ${p.result}. Start a project like this."
       style="--wa:${p.accent}; --wt-a:${p.tintA}; --wt-b:${p.tintB};">
      <div class="work-thumb">
        ${browserMockHTML(p.url, mockPageInner)}
        <div class="work-view"><span>Get results like this →</span></div>
      </div>
      <div class="work-body">
        <div class="work-tag">${p.tag}</div>
        <div class="work-name">${p.name}</div>
        <div class="work-result">${ICONS.trendingUp} ${p.result}</div>
      </div>
    </a>`).join('');

const processHTML = () => steps.map(st => `
    <div class="step-card">
      <div class="step-num">${st.num}</div>
      <div class="step-title">${st.title}</div>
      <div class="step-body">${st.body}</div>
    </div>`).join('');

const testimonialsHTML = () => testimonials.map(t => `
    <article class="testimonial-card liftcard ${t.color}">
      ${starsRow()}
      <p class="testimonial-quote">“${t.quote}”</p>
      <div class="testimonial-metric">${ICONS.trendingUp} ${t.metric}</div>
      <div class="testimonial-who">
        <div class="testimonial-avatar" aria-hidden="true">${t.initials}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    </article>`).join('');

// Per spec D4: primary CTA targets /contact/?plan=<Name>. No Stripe placeholder,
// no rel="nofollow" (internal link we want crawled).
const pricingHTML = () => plans.map(pl => {
  const features = pl.features.map(f =>
    `<div class="plan-feature"><span class="check">${ICONS.check}</span>${f}</div>`).join('');
  const cta = pl.bundled
    ? '<div class="plan-cta"><span class="plan-included">Included with every Launch build</span></div>'
    : `<div class="plan-cta">
          <a href="/contact/?plan=${encodeURIComponent(pl.name)}">Get started — ${pl.price}</a>
          <a class="plan-cta-secondary" href="/contact/?plan=${encodeURIComponent(pl.name)}">Not sure yet? Get a free audit →</a>
        </div>`;
  return `
    <div class="plan-card liftcard${pl.featured ? ' featured' : ''}${pl.bundled ? ' bundled' : ''}">
      ${pl.featured ? '<div class="plan-badge">Most popular</div>' : ''}
      <div class="plan-name">${pl.name}</div>
      <div class="plan-desc">${pl.desc}</div>
      <div class="plan-price">
        <div class="price-num">${pl.price}</div>
        <div class="price-period">${pl.period}</div>
      </div>
      ${pl.note ? `<div class="plan-note">${pl.note}</div>` : ''}
      ${features}
      ${cta}
    </div>`;
}).join('');

const files = {
  'services.html': servicesHTML(),
  'work-3.html': workHTML(3),
  'work-all.html': workHTML(),
  'process.html': processHTML(),
  'testimonials.html': testimonialsHTML(),
  'pricing.html': pricingHTML(),
};
for (const [name, html] of Object.entries(files)) {
  writeFileSync(join(OUT, name), html);
  console.log(`wrote ${name} (${html.length} bytes)`);
}
```

- [ ] **Step 2: Run the generator**

Run: `node tools/generate-markup.mjs`

Expected: six `wrote …` lines with non-zero byte counts. If any fragment is 0 bytes, a data array was not pasted correctly.

- [ ] **Step 3: Paste fragments into the HTML files**

Replace each empty container's inner content with the matching fragment, keeping the wrapper element and its attributes:

| Fragment | Target |
| --- | --- |
| `services.html` | `index.html:142` and `pages/services.html:68` — inside `<div class="services-grid" id="services-grid">` |
| `work-3.html` | `index.html:247` — inside `<div class="work-grid" id="work-grid" data-limit="3">` |
| `work-all.html` | `pages/work.html:71` — inside `<div class="work-grid" id="work-grid">` |
| `process.html` | `pages/services.html:110` |
| `testimonials.html` | `index.html:233` |
| `pricing.html` | `pages/pricing.html:71` |

Remove the now-redundant `id` attributes (`id="services-grid"` etc.) and `data-limit="3"` — nothing reads them after Task 3. **Keep `id="ticker-track"`**, which the ticker renderer still needs.

- [ ] **Step 4: Point the tests at the current (pre-move) paths temporarily**

The URL migration is Task 5. Until then, adjust `tests/helpers.mjs` `PAGES` and the test file paths to the existing locations so tests can go green now:

```javascript
export const PAGES = [
  { url: '/',                       file: 'index.html' },
  { url: '/pages/services.html',    file: 'pages/services.html' },
  { url: '/pages/work.html',        file: 'pages/work.html' },
  { url: '/pages/pricing.html',     file: 'pages/pricing.html' },
  { url: '/pages/contact.html',     file: 'pages/contact.html' },
];
```

Update the `readPage(...)` arguments in `tests/seo.test.mjs` to match (`pages/pricing.html`, `pages/services.html`, `pages/work.html`).

- [ ] **Step 5: Run tests to verify they pass**

Run: `node --test`

Expected: **PASS** — all content assertions green.

- [ ] **Step 6: Verify visually**

Open `index.html`, `pages/services.html`, `pages/pricing.html`, and `pages/work.html` in a browser. Cards must look identical to before. A layout break means the pasted markup deviates from the renderer output — diff against `tools/out/`.

- [ ] **Step 7: Commit**

```bash
git add index.html pages/ tools/ tests/
git commit -m "feat: render services, work, pricing, process, testimonials as static HTML"
```

---

## Task 3: Delete renderers from main.js

**Files:**
- Modify: `js/main.js:1-207`
- Delete: `tools/`
- Modify: `tests/seo.test.mjs`

**Interfaces:**
- Consumes: static markup from Task 2.
- Produces: a `main.js` containing only behaviour, no content.

- [ ] **Step 1: Write the failing test**

```javascript
describe('main.js contains behaviour only, not content', () => {
  test('content data arrays are gone', () => {
    const js = readPage('js/main.js');
    for (const marker of ['const services =', 'const projects =', 'const steps =',
                          'const testimonials =', 'const plans =', 'const ICONS =']) {
      assert.ok(!js.includes(marker), `main.js still defines: ${marker}`);
    }
  });

  test('renderer-only helpers are gone', () => {
    const js = readPage('js/main.js');
    for (const helper of ['function el(', 'function starsRow(',
                          'function browserMockHTML(', 'const mockPageInner',
                          'const pagePrefix', 'const inPagesDir']) {
      assert.ok(!js.includes(helper), `main.js still defines: ${helper}`);
    }
  });

  test('ticker renderer is retained (spec D3)', () => {
    const js = readPage('js/main.js');
    assert.ok(js.includes('tickerKeywords'), 'ticker data was removed');
    assert.ok(js.includes("getElementById('ticker-track')"), 'ticker renderer was removed');
  });

  test('interactive behaviour is retained', () => {
    const js = readPage('js/main.js');
    for (const kept of ['animateCounters', 'onInView', "getElementById('nav-toggle')",
                        "getElementById('rotating-word')", "getElementById('contact-form')"]) {
      assert.ok(js.includes(kept), `main.js lost behaviour: ${kept}`);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test`

Expected: FAIL — `main.js still defines: const services =`.

- [ ] **Step 3: Delete the renderer code**

From `js/main.js`, delete: the `ICONS` object; the `services`, `projects`, `steps`, `testimonials`, and `plans` arrays; `inPagesDir`; `pagePrefix`; `el()`; `starsRow()`; `browserMockHTML()`; `mockPageInner`; and the five renderer blocks (services, work, process, pricing, testimonials).

**Keep** `tickerKeywords` and its renderer block, `reducedMotion`, `fineHover`, and everything from `animateCounters` onward.

The ticker renderer uses no deleted helpers — verify it still reads:

```javascript
const tickerTrack = document.getElementById('ticker-track');
if (tickerTrack) {
  const half = tickerKeywords
    .map(k => `<span class="ticker-item">${k}</span><span class="ticker-sep">●</span>`)
    .join('');
  tickerTrack.innerHTML = `<div class="ticker-half">${half}</div><div class="ticker-half" aria-hidden="true">${half}</div>`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test`

Expected: **PASS.** Then confirm the size reduction:

```bash
wc -l js/main.js   # expect roughly 240, down from 456
```

- [ ] **Step 5: Verify in a browser**

Open `index.html` with the console visible. Expect **zero** `ReferenceError`s. Confirm still working: mobile nav toggle, nav shrink on scroll, count-up numbers, rotating hero word, keyword ticker, hero tilt.

- [ ] **Step 6: Delete the generator**

```bash
rm -rf tools/
```

- [ ] **Step 7: Commit**

```bash
git add js/main.js tests/ && git rm -r --cached tools 2>/dev/null; git add -A
git commit -m "refactor: strip content renderers from main.js, keep behaviour"
```

---

## Task 4: Remove Stripe placeholders

Per spec D4. Task 2 already emitted `/contact/?plan=…` CTAs; this task proves no placeholder survives anywhere.

**Files:**
- Modify: `tests/seo.test.mjs`
- Modify: any file still containing a placeholder

- [ ] **Step 1: Write the failing test**

```javascript
describe('no broken checkout links', () => {
  const FILES = ['index.html', '404.html', 'js/main.js',
                 'pages/services.html', 'pages/work.html',
                 'pages/pricing.html', 'pages/contact.html'];

  test('no STRIPE_LINK_PLACEHOLDER anywhere', () => {
    for (const f of FILES) {
      assert.ok(!readPage(f).includes('STRIPE_LINK_PLACEHOLDER'),
        `${f} still contains a Stripe placeholder`);
    }
  });

  test('pricing CTAs target the contact page with a plan param', () => {
    const html = readPage('pages/pricing.html');
    for (const plan of ['Launch', 'Growth', 'Scale']) {
      assert.ok(html.includes(`/contact/?plan=${plan}`), `missing CTA for ${plan}`);
    }
    // Foundation is bundled and must not have a purchase CTA.
    assert.ok(!html.includes('/contact/?plan=Foundation'),
      'Foundation is bundled and should have no purchase CTA');
  });

  test('no rel=nofollow on internal links (spec D4)', () => {
    for (const f of FILES.filter(f => f.endsWith('.html'))) {
      const html = readPage(f);
      const nofollowInternal = [...html.matchAll(/<a[^>]*>/g)]
        .map(m => m[0])
        .filter(tag => tag.includes('nofollow') && !/href="https?:/.test(tag));
      assert.equal(nofollowInternal.length, 0,
        `${f} has nofollow on internal link(s): ${nofollowInternal.join(', ')}`);
    }
  });
});
```

- [ ] **Step 2: Run test to verify current state**

Run: `node --test`

Expected: the placeholder test FAILS if any `STRIPE_LINK_PLACEHOLDER` remains in `js/main.js` (it should already be gone after Task 3 — if so, this test passes immediately and simply locks in the guarantee).

- [ ] **Step 3: Remove any remaining placeholder**

Search and eliminate:

```bash
rg -n 'STRIPE_LINK_PLACEHOLDER' . --glob '!docs/**' || echo "clean"
```

Also delete the now-obsolete comment block above the old `plans` array if any fragment survived.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test` → **PASS**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix: replace broken Stripe placeholder CTAs with /contact/?plan=X"
```

---

## Task 5: Migrate to clean URLs

**Files:**
- Create: `services/index.html`, `work/index.html`, `pricing/index.html`, `contact/index.html`, `thank-you/index.html`
- Modify: `pages/{services,work,pricing,contact}.html` → redirect stubs
- Delete: `pages/thank-you.html`

- [ ] **Step 1: Write the failing test**

```javascript
describe('clean URL structure', () => {
  const MOVED = [
    ['pages/services.html', 'services/index.html', '/services/'],
    ['pages/work.html',     'work/index.html',     '/work/'],
    ['pages/pricing.html',  'pricing/index.html',  '/pricing/'],
    ['pages/contact.html',  'contact/index.html',  '/contact/'],
  ];

  test('each page exists at its new path', () => {
    for (const [, newPath] of MOVED) {
      assert.ok(pageExists(newPath), `missing ${newPath}`);
    }
    assert.ok(pageExists('thank-you/index.html'), 'missing thank-you/index.html');
  });

  test('old paths keep a canonical + meta-refresh stub', () => {
    for (const [oldPath, , url] of MOVED) {
      const html = readPage(oldPath);
      assert.ok(html.includes(`href="https://sproutdigital.tech${url}"`),
        `${oldPath} missing canonical to ${url}`);
      assert.match(html, /content="0;\s*url=/, `${oldPath} missing meta refresh`);
      assert.ok(html.includes('name="robots"') && html.includes('noindex'),
        `${oldPath} stub must be noindex`);
      assert.ok(html.length < 1200, `${oldPath} should be a stub, not a full page`);
    }
  });

  test('orphaned thank-you page is noindex and has no stub', () => {
    assert.ok(readPage('thank-you/index.html').includes('noindex'),
      'thank-you must be noindex');
    assert.ok(!pageExists('pages/thank-you.html'),
      'thank-you is orphaned; no stub needed');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test`

Expected: FAIL — `missing services/index.html`.

- [ ] **Step 3: Move the files**

```bash
mkdir -p services work pricing contact thank-you
git mv pages/services.html   services/index.html
git mv pages/work.html       work/index.html
git mv pages/pricing.html    pricing/index.html
git mv pages/contact.html    contact/index.html
git mv pages/thank-you.html  thank-you/index.html
```

- [ ] **Step 4: Create the redirect stubs**

Create each of `pages/services.html`, `pages/work.html`, `pages/pricing.html`, `pages/contact.html` with this exact shape, substituting the path:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Redirecting…</title>
<link rel="canonical" href="https://sproutdigital.tech/pricing/">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=/pricing/">
</head>
<body><p>This page has moved to <a href="/pricing/">/pricing/</a>.</p></body>
</html>
```

- [ ] **Step 5: Add noindex to the orphaned thank-you page**

In `thank-you/index.html`'s `<head>`, add:

```html
<meta name="robots" content="noindex">
```

It is unreachable by design — nothing links to it, it is absent from the sitemap, and the contact form submits over AJAX with an inline success state.

- [ ] **Step 6: Update test paths to the new locations**

Restore `tests/helpers.mjs` `PAGES` to the canonical form given in Task 1 Step 1, and update every `readPage('pages/…')` call in `tests/seo.test.mjs` to the new paths (`pricing/index.html`, `services/index.html`, `work/index.html`, `contact/index.html`). In the Task 4 `FILES` list, replace the four `pages/*.html` entries with their new paths plus the four stubs.

- [ ] **Step 7: Run tests to verify they pass**

Run: `node --test` → **PASS**

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: migrate to extensionless URLs with redirect stubs"
```

---

## Task 6: Rewrite internal links, canonicals, and sitemap

104 links need rewriting (119 internal page links, of which 15 already point at `/`).

**Files:**
- Modify: `index.html`, `404.html`, `services/index.html`, `work/index.html`, `pricing/index.html`, `contact/index.html`, `thank-you/index.html`
- Modify: `sitemap.xml`

- [ ] **Step 1: Write the failing test**

```javascript
describe('link integrity', () => {
  const ALL = ['index.html', '404.html', 'services/index.html', 'work/index.html',
               'pricing/index.html', 'contact/index.html', 'thank-you/index.html'];

  test('every internal link is root-relative', () => {
    for (const f of ALL) {
      for (const href of internalLinks(readPage(f))) {
        assert.ok(href.startsWith('/'),
          `${f}: "${href}" is not root-relative`);
      }
    }
  });

  test('no internal link points at a .html page path', () => {
    for (const f of ALL) {
      for (const href of internalLinks(readPage(f))) {
        assert.ok(!/^\/pages\//.test(href), `${f}: "${href}" targets old /pages/ path`);
      }
    }
  });

  test('every internal link resolves to a file on disk', () => {
    for (const f of ALL) {
      for (const href of internalLinks(readPage(f))) {
        const path = href.split(/[?#]/)[0];
        const target = path.endsWith('/') ? `${path}index.html` : path;
        assert.ok(pageExists(target.replace(/^\//, '')),
          `${f}: "${href}" resolves to missing file ${target}`);
      }
    }
  });

  test('each page declares the correct canonical and og:url', () => {
    for (const { url, file } of PAGES) {
      const html = readPage(file);
      const expected = `https://sproutdigital.tech${url}`;
      assert.ok(html.includes(`rel="canonical" href="${expected}"`),
        `${file}: wrong or missing canonical (want ${expected})`);
      assert.ok(html.includes(`property="og:url" content="${expected}"`),
        `${file}: wrong or missing og:url (want ${expected})`);
    }
  });
});

describe('sitemap', () => {
  test('lists exactly the canonical URLs', () => {
    const xml = readPage('sitemap.xml');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).sort();
    const want = PAGES.map(p => `https://sproutdigital.tech${p.url}`).sort();
    assert.deepEqual(locs, want);
  });

  test('contains no .html URLs', () => {
    assert.ok(!readPage('sitemap.xml').includes('.html'),
      'sitemap still references .html paths');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test`

Expected: FAIL — links like `contact.html` are not root-relative.

- [ ] **Step 3: Rewrite the links**

In all seven pages, apply these substitutions to `href` values:

| From | To |
| --- | --- |
| `contact.html`, `pages/contact.html`, `/pages/contact.html` | `/contact/` |
| `services.html`, `pages/services.html` | `/services/` |
| `work.html`, `pages/work.html` | `/work/` |
| `pricing.html`, `pages/pricing.html` | `/pricing/` |
| `../css/styles.css`, `css/styles.css` | `/css/styles.css` |
| `../js/main.js`, `js/main.js` (in `src`) | `/js/main.js` |

Leave `href="/"` and all external, `#`, `mailto:`, and `tel:` links untouched. Do **not** rewrite links inside `pages/*.html` stubs — they already point at the new URLs.

- [ ] **Step 4: Update canonicals and og:url**

In each of the five canonical pages, set both to the values in the `PAGES` table (`https://sproutdigital.tech/`, `/services/`, `/work/`, `/pricing/`, `/contact/`).

- [ ] **Step 5: Update the sitemap**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://sproutdigital.tech/</loc><lastmod>2026-07-27</lastmod><priority>1.0</priority></url>
  <url><loc>https://sproutdigital.tech/services/</loc><lastmod>2026-07-27</lastmod><priority>0.8</priority></url>
  <url><loc>https://sproutdigital.tech/pricing/</loc><lastmod>2026-07-27</lastmod><priority>0.8</priority></url>
  <url><loc>https://sproutdigital.tech/work/</loc><lastmod>2026-07-27</lastmod><priority>0.7</priority></url>
  <url><loc>https://sproutdigital.tech/contact/</loc><lastmod>2026-07-27</lastmod><priority>0.7</priority></url>
</urlset>
```

- [ ] **Step 6: Run tests and validate the XML**

Run: `node --test` → **PASS**

Run: `xmllint --noout sitemap.xml && echo "sitemap valid"`
Expected: `sitemap valid`

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: root-relative internal links, updated canonicals and sitemap"
```

---

## Task 7: Structured data

**Files:**
- Modify: `index.html`, `services/index.html`, `work/index.html`, `pricing/index.html`, `contact/index.html`

- [ ] **Step 1: Write the failing test**

```javascript
describe('structured data', () => {
  const typesIn = (file) => jsonLdBlocks(readPage(file)).map(b => b['@type']);

  test('every JSON-LD block parses and declares a schema.org context', () => {
    for (const { file } of PAGES) {
      const blocks = jsonLdBlocks(readPage(file));   // throws on malformed JSON
      assert.ok(blocks.length > 0, `${file} has no JSON-LD`);
      for (const b of blocks) {
        assert.match(b['@context'], /schema\.org/, `${file}: bad @context`);
      }
    }
  });

  test('expected types are present per page', () => {
    assert.ok(typesIn('index.html').includes('ProfessionalService'));
    assert.ok(typesIn('services/index.html').includes('Service'));
    assert.ok(typesIn('pricing/index.html').includes('FAQPage'));
    assert.ok(typesIn('pricing/index.html').includes('OfferCatalog'));
    assert.ok(typesIn('work/index.html').includes('ItemList'));
    assert.ok(typesIn('contact/index.html').includes('ContactPage'));
  });

  test('every non-home page has a BreadcrumbList', () => {
    for (const { file } of PAGES.filter(p => p.url !== '/')) {
      assert.ok(typesIn(file).includes('BreadcrumbList'), `${file} missing BreadcrumbList`);
    }
  });

  test('FAQPage covers all five on-page questions', () => {
    const html = readPage('pricing/index.html');
    const faq = jsonLdBlocks(html).find(b => b['@type'] === 'FAQPage');
    const summaries = [...html.matchAll(/<summary>([^<]+)</g)].map(m => m[1].trim());
    assert.equal(faq.mainEntity.length, summaries.length,
      'FAQPage entry count must match the <summary> count on the page');
    for (const q of summaries) {
      assert.ok(faq.mainEntity.some(e => e.name === q), `FAQ schema missing: "${q}"`);
    }
  });

  test('OfferCatalog covers all four plans with correct prices', () => {
    const catalog = jsonLdBlocks(readPage('pricing/index.html'))
      .find(b => b['@type'] === 'OfferCatalog');
    const byName = Object.fromEntries(
      catalog.itemListElement.map(o => [o.itemOffered.name, o.price]));
    assert.deepEqual(byName,
      { Launch: '200', Foundation: '29', Growth: '350', Scale: '750' });
  });

  test('no self-serving review markup (spec constraint)', () => {
    for (const { file } of PAGES) {
      const raw = readPage(file);
      assert.ok(!raw.includes('"AggregateRating"') && !raw.includes('"@type": "Review"'),
        `${file}: review markup is ineligible for rich results and risks a manual action`);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test`

Expected: FAIL — `services/index.html has no JSON-LD`.

- [ ] **Step 3: Add the FAQPage and OfferCatalog to pricing**

The five questions come verbatim from the `<summary>` elements at `pricing/index.html`; answers from the matching `<div class="faq-body">`. Add to `<head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question",
      "name": "How much should I budget for Google or Meta ads?",
      "acceptedAnswer": { "@type": "Answer", "text": "Most of our clients start between £400–£1,200/month in ad spend. We'll recommend a starting budget in your free audit based on your industry and goals, then scale it up only once the numbers prove it's paying for itself." } },
    { "@type": "Question",
      "name": "How quickly will I see results from paid ads?",
      "acceptedAnswer": { "@type": "Answer", "text": "Unlike SEO, paid ads start driving clicks the day they go live. Expect the first leads within the first week or two, with performance improving over the first 90 days as we optimize targeting, ads, and landing pages." } },
    { "@type": "Question",
      "name": "Do I need a new website before running ads?",
      "acceptedAnswer": { "@type": "Answer", "text": "Not always — but ads are only as good as the page they land on. If your current site loads slowly or doesn't convert, we'll usually recommend fixing the landing page first so your ad budget isn't wasted." } },
    { "@type": "Question",
      "name": "Am I locked into a contract?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. Monthly plans are rolling and you can cancel anytime. Your website, ad accounts, and data are always yours to keep." } },
    { "@type": "Question",
      "name": "How do you report on performance?",
      "acceptedAnswer": { "@type": "Answer", "text": "You get a plain-English monthly report: what we spent, what it earned, cost per lead, and what we're changing next month. No vanity metrics, no jargon." } }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "name": "SproutDigital plans",
  "itemListElement": [
    { "@type": "Offer", "price": "200", "priceCurrency": "GBP",
      "itemOffered": { "@type": "Service", "name": "Launch",
        "description": "For anyone with an idea who just needs a site live, fast." } },
    { "@type": "Offer", "price": "29", "priceCurrency": "GBP",
      "priceSpecification": { "@type": "UnitPriceSpecification",
        "price": "29", "priceCurrency": "GBP", "billingDuration": 1,
        "billingIncrement": 1, "unitCode": "MON" },
      "itemOffered": { "@type": "Service", "name": "Foundation",
        "description": "Keeps every Launch site online, secure, and yours." } },
    { "@type": "Offer", "price": "350", "priceCurrency": "GBP",
      "priceSpecification": { "@type": "UnitPriceSpecification",
        "price": "350", "priceCurrency": "GBP", "billingDuration": 1,
        "billingIncrement": 1, "unitCode": "MON" },
      "itemOffered": { "@type": "Service", "name": "Growth",
        "description": "For small teams ready to rank and grow." } },
    { "@type": "Offer", "price": "750", "priceCurrency": "GBP",
      "priceSpecification": { "@type": "UnitPriceSpecification",
        "price": "750", "priceCurrency": "GBP", "billingDuration": 1,
        "billingIncrement": 1, "unitCode": "MON" },
      "itemOffered": { "@type": "Service", "name": "Scale",
        "description": "For businesses investing in full growth." } }
  ]
}
</script>
```

> All five answers are copied verbatim from the page's `faq-body` elements. Schema answers must
> match visible text exactly or the markup is non-compliant — if the page copy is later edited,
> this block must be updated in the same commit.

- [ ] **Step 4: Add Service schema to the services page**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "provider": { "@type": "ProfessionalService", "name": "SproutDigital",
                "url": "https://sproutdigital.tech/" },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      { "@type": "Service", "name": "Website design & build",
        "description": "Modern, fast websites tailored to solo founders and small teams — built to convert, not just look nice." },
      { "@type": "Service", "name": "Google & Meta Ads",
        "description": "Paid campaigns on Google Search, Facebook, and Instagram that drive clicks from people ready to buy — tracked all the way to revenue." },
      { "@type": "Service", "name": "SEO",
        "description": "Technical fixes, on-page optimization, and content that gets you found on Google for the searches that matter." }
    ]
  }
}
</script>
```

- [ ] **Step 5: Add ItemList to the work page and ContactPage to contact**

```html
<!-- work/index.html -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1,
      "item": { "@type": "CreativeWork", "name": "GIAT LTD", "about": "Corporate website and paid search" } },
    { "@type": "ListItem", "position": 2,
      "item": { "@type": "CreativeWork", "name": "NinjaPlumbers", "about": "Trades lead generation via Google Ads" } },
    { "@type": "ListItem", "position": 3,
      "item": { "@type": "CreativeWork", "name": "DiyahAesthetics", "about": "Beauty bookings via Meta Ads" } },
    { "@type": "ListItem", "position": 4,
      "item": { "@type": "CreativeWork", "name": "ShineyPetGrooming", "about": "Pet care organic growth via SEO" } }
  ]
}
</script>
```

```html
<!-- contact/index.html -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "url": "https://sproutdigital.tech/contact/",
  "mainEntity": { "@type": "ProfessionalService", "name": "SproutDigital",
                  "url": "https://sproutdigital.tech/" }
}
</script>
```

- [ ] **Step 6: Add BreadcrumbList to all four non-home pages**

Substitute name and path per page (`Services`/`services`, `Work`/`work`, `Pricing`/`pricing`, `Contact`/`contact`):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home",
      "item": "https://sproutdigital.tech/" },
    { "@type": "ListItem", "position": 2, "name": "Pricing",
      "item": "https://sproutdigital.tech/pricing/" }
  ]
}
</script>
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `node --test` → **PASS**

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add FAQPage, OfferCatalog, Service, ItemList, and breadcrumb schema"
```

---

## Task 8: Final verification

**Files:**
- Modify: none expected

- [ ] **Step 1: Run the full suite**

Run: `node --test`
Expected: **PASS**, zero failures.

- [ ] **Step 2: Prove content is visible without JavaScript**

```bash
rg -c '£200|£350|£750' pricing/index.html
rg -c 'NinjaPlumbers' work/index.html index.html
rg -c 'booked solid two weeks out' index.html
```

Expected: non-zero counts for every file. This is the core deliverable — content in raw HTML.

- [ ] **Step 3: Confirm the ticker did NOT get baked in**

```bash
rg -c 'plumber near me' index.html || echo "correct: ticker still JS-rendered"
```

Expected: `correct: ticker still JS-rendered`. A non-zero count means spec D3 was violated.

- [ ] **Step 4: Check HTML validity**

```bash
for f in index.html services/index.html work/index.html pricing/index.html contact/index.html; do
  echo "--- $f"; tidy -q -e "$f" 2>&1 | head -5
done
```

Expected: no errors. Warnings about proprietary attributes are acceptable.

- [ ] **Step 5: Browser check**

Open each page. Confirm: layout identical to before; console free of errors; mobile nav, count-ups, rotating word, ticker, and hero tilt all work; contact form validates and pre-selects a plan when reached via `/contact/?plan=Growth`.

- [ ] **Step 6: Commit and push**

```bash
git add -A
git commit -m "chore: final SEO verification" --allow-empty
git push origin main
```

- [ ] **Step 7: Post-deploy validation**

Wait ~2 minutes for GitHub Pages, then:

```bash
for u in / /services/ /work/ /pricing/ /contact/; do
  printf "%-14s -> " "$u"; curl -s -o /dev/null -w "%{http_code}\n" "https://sproutdigital.tech$u"
done
for u in /pages/services.html /pages/pricing.html; do
  printf "%-26s -> " "$u"; curl -s -o /dev/null -w "%{http_code}\n" "https://sproutdigital.tech$u"
done
curl -s https://sproutdigital.tech/pricing/ | rg -c '£200'
```

Expected: `200` for all new URLs, `200` for the stubs, non-zero count for `£200`.

Then: submit the updated sitemap in Google Search Console, and validate `/pricing/` and `/services/` with the Rich Results Test.

---

## Self-Review Notes

**Spec coverage:** Phase A → Tasks 1–4. Phase B → Tasks 5–6. Phase C → Task 7. Verification section → Task 8. Constraint D3 (ticker) → Task 3 Step 3 and Task 8 Step 3. D4 (Stripe/nofollow) → Task 4. No-Review-markup → Task 7. H1 → correctly excluded per the spec correction.

**Placeholder scan:** One placeholder was found on first pass (the fifth FAQ answer in Task 7 Step 3) and resolved by reading the answer from `pages/pricing.html:102` rather than leaving it for the implementer. The plan now contains no TBDs, no "similar to Task N" references, and no code step without a code block.

**Naming consistency:** `readPage`, `pageExists`, `internalLinks`, `jsonLdBlocks`, and `PAGES` are defined once in Task 1 and used unchanged throughout. `PAGES` is intentionally mutated twice — pointed at old paths in Task 2 Step 4, restored to canonical paths in Task 5 Step 6 — because the URL migration happens mid-plan; both transitions are explicit steps.
