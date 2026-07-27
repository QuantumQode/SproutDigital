import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, pageExists, internalLinks, jsonLdBlocks, PAGES, isInternalHref } from './helpers.mjs';

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
    // Note: the plain name "ShineyPetGrooming" also appears in a homepage
    // testimonial's role field (Sarah G. / ShineyPetGrooming), independent
    // of the work grid, so check the project's domain instead — it only
    // ever appears inside that project's work-card browser-mock URL.
    assert.ok(!home.includes('shineypetgrooming.com'), 'homepage should show only 3 projects');
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

describe('no broken checkout links', () => {
  const FILES = ['index.html', '404.html', 'js/main.js',
                 'services/index.html', 'work/index.html',
                 'pricing/index.html', 'contact/index.html',
                 'thank-you/index.html',
                 'pages/services.html', 'pages/work.html',
                 'pages/pricing.html', 'pages/contact.html'];

  test('no STRIPE_LINK_PLACEHOLDER anywhere', () => {
    for (const f of FILES) {
      assert.ok(!readPage(f).includes('STRIPE_LINK_PLACEHOLDER'),
        `${f} still contains a Stripe placeholder`);
    }
  });

  test('pricing CTAs target the contact page with a plan param', () => {
    const html = readPage('pricing/index.html');
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
      const aTags = [...html.matchAll(/<a[^>]*>/gi)]; // case-insensitive
      const nofollowInternal = [];

      for (const match of aTags) {
        const tag = match[0];

        // Extract href (handle double quotes, single quotes, and unquoted)
        const hrefMatch = tag.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
        if (!hrefMatch) continue;
        const href = hrefMatch[1] || hrefMatch[2] || hrefMatch[3];

        // Check if it's internal (skip if external)
        if (!isInternalHref(href)) continue;

        // Check if it has rel=nofollow (match case-insensitive)
        const relMatch = tag.match(/rel\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
        if (relMatch) {
          const rel = (relMatch[1] || relMatch[2] || relMatch[3]).toLowerCase();
          if (rel.includes('nofollow')) {
            nofollowInternal.push(tag);
          }
        }
      }

      assert.equal(nofollowInternal.length, 0,
        `${f} has nofollow on internal link(s): ${nofollowInternal.join(', ')}`);
    }
  });
});

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

describe('link integrity', () => {
  const ALL = ['index.html', '404.html', 'services/index.html', 'work/index.html',
               'pricing/index.html', 'contact/index.html', 'thank-you/index.html'];

  test('every internal link is root-relative', () => {
    for (const f of ALL) {
      for (const href of internalLinks(readPage(f))) {
        assert.ok(href.startsWith('/'), `${f}: "${href}" is not root-relative`);
      }
    }
  });

  test('no internal link points at an old /pages/ path', () => {
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
