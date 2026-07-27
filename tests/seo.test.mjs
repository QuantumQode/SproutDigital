import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, pageExists, internalLinks, jsonLdBlocks, PAGES } from './helpers.mjs';

describe('content is present in raw HTML (no JS execution)', () => {
  test('pricing page states every plan price', () => {
    const html = readPage('pages/pricing.html');
    for (const price of ['£200', '£29', '£350', '£750']) {
      assert.ok(html.includes(price), `missing price ${price}`);
    }
  });

  test('pricing page names every plan', () => {
    const html = readPage('pages/pricing.html');
    for (const name of ['Launch', 'Foundation', 'Growth', 'Scale']) {
      assert.ok(html.includes(name), `missing plan ${name}`);
    }
  });

  test('services copy appears on both homepage and services page', () => {
    for (const file of ['index.html', 'pages/services.html']) {
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
    const work = readPage('pages/work.html');
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
    const html = readPage('pages/services.html');
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
