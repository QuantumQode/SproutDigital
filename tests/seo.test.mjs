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
