// One-shot generator: turns the runtime template literals in js/main.js into
// static HTML fragments to hand-paste into index.html / pages/*.html.
//
// This file deliberately duplicates data/templates from js/main.js verbatim.
// That duplication is intentional (see task-2-brief.md) — it guarantees the
// static markup matches what the JS renderers would have produced at
// runtime. Task 3 deletes this whole tools/ directory.
//
// Must NOT import js/main.js: that file calls matchMedia at top level and
// will crash under Node.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), 'out');
mkdirSync(OUT, { recursive: true });

// ---- VERBATIM COPY from js/main.js:1-10 ----
const ICONS = {
  layout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  trendingUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
};

// ---- VERBATIM COPY from js/main.js:13-65 ----
const services = [
  { icon: ICONS.layout, title: 'Website design & build', body: 'Modern, fast websites tailored to solo founders and small teams — built to convert, not just look nice.' },
  { icon: ICONS.megaphone, title: 'Google & Meta Ads', body: 'Paid campaigns on Google Search, Facebook, and Instagram that drive clicks from people ready to buy — tracked all the way to revenue.' },
  { icon: ICONS.search, title: 'SEO', body: 'Technical fixes, on-page optimization, and content that gets you found on Google for the searches that matter.' },
];

const projects = [
  { tag: 'Corporate', name: 'GIAT LTD', url: 'giatltd.com', accent: 'oklch(0.55 0.14 250)', tintA: 'oklch(0.94 0.03 250)', tintB: 'oklch(0.97 0.015 230)', result: '+3.2x return on ad spend' },
  { tag: 'Trades', name: 'NinjaPlumbers', url: 'ninjaplumbers.com', accent: 'oklch(0.62 0.16 45)', tintA: 'oklch(0.95 0.04 60)', tintB: 'oklch(0.97 0.02 45)', result: '52 leads/mo from Google Ads' },
  { tag: 'Beauty', name: 'DiyahAesthetics', url: 'diyahaesthetics.com', accent: 'oklch(0.62 0.16 350)', tintA: 'oklch(0.95 0.035 340)', tintB: 'oklch(0.97 0.02 320)', result: '2.4x bookings via Meta Ads' },
  { tag: 'Pet Care', name: 'ShineyPetGrooming', url: 'shineypetgrooming.com', accent: 'oklch(0.6 0.13 175)', tintA: 'oklch(0.94 0.035 170)', tintB: 'oklch(0.97 0.02 160)', result: '+180% organic traffic' },
];

const steps = [
  { num: '01', title: 'Free audit', body: 'We review your current site, rankings, and ad accounts, and share what’s holding you back.' },
  { num: '02', title: 'Design & build', body: 'A fresh, on-brand site designed around your customers and goals.' },
  { num: '03', title: 'Launch & optimize', body: 'We launch the site and your first ad campaigns, then tune targeting, SEO, and speed.' },
  { num: '04', title: 'Grow', body: 'Ongoing ads management and reporting keep clicks, leads, and revenue climbing.' },
];

const testimonials = [
  { color: 't-green', initials: 'JT', name: 'James T.', role: 'NinjaPlumbers', metric: '52 leads/month',
    quote: 'Within a month of the Google Ads going live, we were booked solid two weeks out. The phone genuinely doesn’t stop ringing on Mondays now.' },
  { color: 't-amber', initials: 'DA', name: 'Diyah A.', role: 'DiyahAesthetics', metric: '2.4x bookings',
    quote: 'The Instagram campaigns paid for themselves in the first week. New clients tell us the ads are what got them through the door.' },
  { color: 't-blue', initials: 'SG', name: 'Sarah G.', role: 'ShineyPetGrooming', metric: '+180% traffic',
    quote: 'I finally understand where my marketing money goes. The monthly report shows exactly which ads brought in bookings — no jargon, just numbers.' },
];

// stripeLink values are placeholders — replace each with the real Stripe Payment Link URL
// before go-live (Launch's link must bundle the one-time £200 price with the £29/mo Foundation price).
const plans = [
  { name: 'Launch', desc: 'For anyone with an idea who just needs a site live, fast.', price: '£200', period: 'one-time', featured: false,
    features: ['5-page website', 'Mobile-optimized design', 'Basic on-page SEO', '30 days of support'],
    note: 'Every Launch build comes with Foundation (£29/mo), so your site actually stays online. See below.',
    stripeLink: 'STRIPE_LINK_PLACEHOLDER_LAUNCH' },
  { name: 'Foundation', desc: 'Keeps every Launch site online, secure, and yours.', price: '£29', period: '/month', featured: false, bundled: true,
    features: ['Domain registration & renewal', 'Hosting & SSL', 'Uptime monitoring & security updates', 'Basic on-page SEO upkeep'],
    note: 'Included automatically with every Launch build — not sold on its own.' },
  { name: 'Growth', desc: 'For small teams ready to rank and grow.', price: '£350', period: '/month', featured: true,
    features: ['Everything in Foundation', 'Ongoing SEO & content', 'Monthly reporting', 'Email marketing setup'],
    stripeLink: 'STRIPE_LINK_PLACEHOLDER_GROWTH' },
  { name: 'Scale', desc: 'For businesses investing in full growth.', price: '£750', period: '/month', featured: false,
    features: ['Everything in Growth', 'Google & Meta ads management', 'Conversion rate testing', 'Dedicated strategist'],
    note: 'Ad spend is paid directly to Google/Meta, on top of this plan. You keep full ownership of your ad accounts and data.',
    stripeLink: 'STRIPE_LINK_PLACEHOLDER_SCALE' },
];

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

// ---- HTML-escaping ----
// The runtime renderers assign these strings via `innerHTML`/`setAttribute`,
// which never requires entity-escaping plain "&" — browsers accept a bare
// "&" that isn't followed by a valid entity name. But we're now emitting
// these strings directly into a static HTML *document*, where "&" in text
// or attribute content should be a proper "&amp;" entity to be well-formed.
// Escaping is a no-op visually (a browser renders "&amp;" and a bare "&"
// identically), so this cannot change how any page looks.
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---- Renderers, mirroring js/main.js:100-207 ----
const servicesHTML = () => services.map(s => `
    <article class="service-card liftcard">
      <div class="icon-wrap">${s.icon}</div>
      <h3 class="title">${esc(s.title)}</h3>
      <div class="body">${esc(s.body)}</div>
    </article>`).join('');

const workHTML = (limit = projects.length) => projects.slice(0, limit).map(p => `
    <a class="work-card liftcard" href="/contact/?project=${encodeURIComponent(p.name)}"
       aria-label="${esc(p.name)} — ${esc(p.result)}. Start a project like this."
       style="--wa:${p.accent}; --wt-a:${p.tintA}; --wt-b:${p.tintB};">
      <div class="work-thumb">
        ${browserMockHTML(esc(p.url), mockPageInner)}
        <div class="work-view"><span>Get results like this →</span></div>
      </div>
      <div class="work-body">
        <div class="work-tag">${esc(p.tag)}</div>
        <div class="work-name">${esc(p.name)}</div>
        <div class="work-result">${ICONS.trendingUp} ${esc(p.result)}</div>
      </div>
    </a>`).join('');

const processHTML = () => steps.map(st => `
    <div class="step-card">
      <div class="step-num">${st.num}</div>
      <div class="step-title">${esc(st.title)}</div>
      <div class="step-body">${esc(st.body)}</div>
    </div>`).join('');

const testimonialsHTML = () => testimonials.map(t => `
    <article class="testimonial-card liftcard ${t.color}">
      ${starsRow()}
      <p class="testimonial-quote">“${esc(t.quote)}”</p>
      <div class="testimonial-metric">${ICONS.trendingUp} ${esc(t.metric)}</div>
      <div class="testimonial-who">
        <div class="testimonial-avatar" aria-hidden="true">${esc(t.initials)}</div>
        <div>
          <div class="testimonial-name">${esc(t.name)}</div>
          <div class="testimonial-role">${esc(t.role)}</div>
        </div>
      </div>
    </article>`).join('');

// Per spec D4: primary CTA targets /contact/?plan=<Name>. No Stripe placeholder,
// no rel="nofollow" (internal link we want crawled).
const pricingHTML = () => plans.map(pl => {
  const features = pl.features.map(f =>
    `<div class="plan-feature"><span class="check">${ICONS.check}</span>${esc(f)}</div>`).join('');
  const cta = pl.bundled
    ? '<div class="plan-cta"><span class="plan-included">Included with every Launch build</span></div>'
    : `<div class="plan-cta">
          <a href="/contact/?plan=${encodeURIComponent(pl.name)}">Get started — ${esc(pl.price)}</a>
          <a class="plan-cta-secondary" href="/contact/?plan=${encodeURIComponent(pl.name)}">Not sure yet? Get a free audit →</a>
        </div>`;
  return `
    <div class="plan-card liftcard${pl.featured ? ' featured' : ''}${pl.bundled ? ' bundled' : ''}">
      ${pl.featured ? '<div class="plan-badge">Most popular</div>' : ''}
      <div class="plan-name">${esc(pl.name)}</div>
      <div class="plan-desc">${esc(pl.desc)}</div>
      <div class="plan-price">
        <div class="price-num">${esc(pl.price)}</div>
        <div class="price-period">${esc(pl.period)}</div>
      </div>
      ${pl.note ? `<div class="plan-note">${esc(pl.note)}</div>` : ''}
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
