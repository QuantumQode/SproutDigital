// ---- Inline SVG icons (Lucide-style, stroke = currentColor) ----
const ICONS = {
  layout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  trendingUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
};

// ---- Content data ----
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

const tickerKeywords = [
  'plumber near me', 'best hair salon', 'emergency electrician', 'dog groomer open now',
  'accountant for small business', 'physio near me', 'wedding photographer prices',
  'landscaping quotes', 'personal trainer', 'cafe open late',
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

// ---- Helpers ----
const inPagesDir = /\/pages\//.test(location.pathname);
const pagePrefix = inPagesDir ? '' : 'pages/';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fineHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

function el(tag, className, html) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

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

// ---- Services grid ----
const servicesGrid = document.getElementById('services-grid');
if (servicesGrid) {
  services.forEach(s => {
    const card = el('article', 'service-card liftcard');
    card.innerHTML = `
      <div class="icon-wrap">${s.icon}</div>
      <h3 class="title">${s.title}</h3>
      <div class="body">${s.body}</div>`;
    servicesGrid.appendChild(card);
  });
}

// ---- Work grid (CSS browser-mock previews, cards link to contact) ----
const workGrid = document.getElementById('work-grid');
if (workGrid) {
  const limit = parseInt(workGrid.dataset.limit, 10) || projects.length;
  projects.slice(0, limit).forEach(p => {
    const card = el('a', 'work-card liftcard');
    card.href = `${pagePrefix}contact.html?project=${encodeURIComponent(p.name)}`;
    card.setAttribute('aria-label', `${p.name} — ${p.result}. Start a project like this.`);
    card.style.setProperty('--wa', p.accent);
    card.style.setProperty('--wt-a', p.tintA);
    card.style.setProperty('--wt-b', p.tintB);
    card.innerHTML = `
      <div class="work-thumb">
        ${browserMockHTML(p.url, mockPageInner)}
        <div class="work-view"><span>Get results like this →</span></div>
      </div>
      <div class="work-body">
        <div class="work-tag">${p.tag}</div>
        <div class="work-name">${p.name}</div>
        <div class="work-result">${ICONS.trendingUp} ${p.result}</div>
      </div>`;
    workGrid.appendChild(card);
  });
}

// ---- Process grid ----
const processGrid = document.getElementById('process-grid');
if (processGrid) {
  steps.forEach(st => {
    const card = el('div', 'step-card');
    card.innerHTML = `
      <div class="step-num">${st.num}</div>
      <div class="step-title">${st.title}</div>
      <div class="step-body">${st.body}</div>`;
    processGrid.appendChild(card);
  });
}

// ---- Pricing grid ----
const pricingGrid = document.getElementById('pricing-grid');
if (pricingGrid) {
  plans.forEach(pl => {
    const card = el('div', 'plan-card liftcard' + (pl.featured ? ' featured' : '') + (pl.bundled ? ' bundled' : ''));
    const features = pl.features.map(f => `<div class="plan-feature"><span class="check">${ICONS.check}</span>${f}</div>`).join('');
    const cta = pl.bundled
      ? '<div class="plan-cta"><span class="plan-included">Included with every Launch build</span></div>'
      : `<div class="plan-cta">
          <a href="${pl.stripeLink}">Buy ${pl.name} now</a>
          <a class="plan-cta-secondary" href="contact.html?plan=${encodeURIComponent(pl.name)}">Not sure yet? Get a free audit →</a>
        </div>`;
    card.innerHTML = `
      ${pl.featured ? '<div class="plan-badge">Most popular</div>' : ''}
      <div class="plan-name">${pl.name}</div>
      <div class="plan-desc">${pl.desc}</div>
      <div class="plan-price">
        <div class="price-num">${pl.price}</div>
        <div class="price-period">${pl.period}</div>
      </div>
      ${pl.note ? `<div class="plan-note">${pl.note}</div>` : ''}
      ${features}
      ${cta}`;
    pricingGrid.appendChild(card);
  });
}

// ---- Keyword ticker (inside ads box) ----
const tickerTrack = document.getElementById('ticker-track');
if (tickerTrack) {
  const half = tickerKeywords
    .map(k => `<span class="ticker-item">${k}</span><span class="ticker-sep">●</span>`)
    .join('');
  tickerTrack.innerHTML = `<div class="ticker-half">${half}</div><div class="ticker-half" aria-hidden="true">${half}</div>`;
}

// ---- Testimonials ----
const testimonialsGrid = document.getElementById('testimonials-grid');
if (testimonialsGrid) {
  testimonials.forEach(t => {
    const card = el('article', `testimonial-card liftcard ${t.color}`);
    card.innerHTML = `
      ${starsRow()}
      <p class="testimonial-quote">“${t.quote}”</p>
      <div class="testimonial-metric">${ICONS.trendingUp} ${t.metric}</div>
      <div class="testimonial-who">
        <div class="testimonial-avatar" aria-hidden="true">${t.initials}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>`;
    testimonialsGrid.appendChild(card);
  });
}

// ---- Count-up numbers (bento + ads dash) ----
function animateCounters(scope) {
  scope.querySelectorAll('[data-count]').forEach(elNum => {
    if (elNum.dataset.counted) return;
    elNum.dataset.counted = '1';
    const target = parseFloat(elNum.dataset.count);
    const prefix = elNum.dataset.prefix || '';
    const suffix = elNum.dataset.suffix || '';
    const decimals = String(elNum.dataset.count).includes('.') ? 1 : 0;
    if (reducedMotion) {
      elNum.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      elNum.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function onInView(target, cb, threshold = 0.35) {
  if (!('IntersectionObserver' in window)) { cb(); return; }
  const io = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      cb();
      io.disconnect();
    }
  }, { threshold });
  io.observe(target);
}

const adsDash = document.getElementById('ads-dash');
if (adsDash) {
  onInView(adsDash, () => {
    adsDash.classList.add('dash-go');
    animateCounters(adsDash);
  });
}

const bentoGrid = document.getElementById('bento-grid');
if (bentoGrid) {
  onInView(bentoGrid, () => animateCounters(bentoGrid), 0.25);
}

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('nav-toggle');
if (navToggle) {
  const siteNav = navToggle.closest('.site-nav');
  const setOpen = (open) => {
    siteNav.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  };
  navToggle.addEventListener('click', () => setOpen(!siteNav.classList.contains('menu-open')));
  document.addEventListener('click', (e) => {
    if (siteNav.classList.contains('menu-open') && !siteNav.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteNav.classList.contains('menu-open')) {
      setOpen(false);
      navToggle.focus();
    }
  });
}

// ---- Nav shrink + sticky mobile CTA (single rAF-throttled scroll listener) ----
const siteNavEl = document.querySelector('.site-nav');
const mobileCtaBar = document.getElementById('mobile-cta-bar');
if (mobileCtaBar) document.body.classList.add('has-cta-bar');
{
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (siteNavEl) siteNavEl.classList.toggle('scrolled', y > 40);
      if (mobileCtaBar) mobileCtaBar.classList.toggle('show', y > 600);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---- Rotating hero word (home only) ----
const wordEl = document.getElementById('rotating-word');
const wordInner = wordEl && wordEl.querySelector('.rotating-word-inner');
if (wordEl && wordInner && !reducedMotion) {
  const words = ['grows', 'sells', 'ranks', 'converts', 'advertises'];
  let wordIdx = 0;

  // Reserve width for the widest word on the outer wrapper so the headline doesn't
  // reflow as words change, while the inner span (and its underline) stays sized to the actual word.
  const measurer = document.createElement('span');
  measurer.style.cssText = 'position:absolute; visibility:hidden; white-space:nowrap; left:-9999px; top:0;';
  document.body.appendChild(measurer);
  const lockWordWidth = () => {
    measurer.style.font = getComputedStyle(wordInner).font;
    let maxWidth = 0;
    words.forEach(w => {
      measurer.textContent = w;
      maxWidth = Math.max(maxWidth, measurer.offsetWidth);
    });
    wordEl.style.minWidth = maxWidth + 'px';
  };
  lockWordWidth();
  window.addEventListener('resize', lockWordWidth);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockWordWidth);

  setInterval(() => {
    if (document.hidden) return;
    wordIdx = (wordIdx + 1) % words.length;
    wordInner.style.animation = 'none';
    wordInner.textContent = words[wordIdx];
    void wordInner.offsetWidth;
    wordInner.style.animation = 'wordIn 0.5s cubic-bezier(.2,.8,.2,1)';
  }, 2600);
}

// ---- Hero mockup subtle tilt (home only, fine pointers) ----
const heroVisual = document.getElementById('hero-visual');
if (heroVisual && fineHover && !reducedMotion) {
  const mockWrap = document.getElementById('hero-mock-wrap');
  heroVisual.addEventListener('mousemove', (e) => {
    const r = heroVisual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    mockWrap.style.transform = `perspective(1000px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg)`;
  });
  heroVisual.addEventListener('mouseleave', () => {
    mockWrap.style.transform = '';
  });
}

// ---- Scroll reveal: CSS scroll-driven where supported, IO fallback elsewhere ----
if (!reducedMotion) {
  const targets = document.querySelectorAll(
    '.service-card, .work-card, .plan-card, .step-card, .contact-point, .section-head, .testimonial-card, .split-card, .faq-item, .ads-copy, .bento-tile'
  );
  const supportsSDA = CSS.supports('animation-timeline: view()');
  if (supportsSDA) {
    targets.forEach(t => t.classList.add('reveal-sda'));
  } else if ('IntersectionObserver' in window) {
    targets.forEach(t => {
      const idx = t.parentElement ? [...t.parentElement.children].indexOf(t) : 0;
      t.classList.add('reveal');
      t.style.setProperty('--reveal-delay', `${Math.min(Math.max(idx, 0), 5) * 90}ms`);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(t => io.observe(t));
  }
}

// ---- Contact form (contact page only) ----
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const params = new URLSearchParams(location.search);

  // Pre-select a plan when arriving from a pricing card link
  const planParam = params.get('plan');
  const planSelect = contactForm.querySelector('select[name="interested_in"]');
  if (planParam && planSelect) {
    const match = [...planSelect.options].find(o => o.value === planParam);
    if (match) planSelect.value = planParam;
  }

  // Pre-fill the message when arriving from a work card
  const projectParam = params.get('project');
  const messageField = contactForm.querySelector('textarea[name="message"]');
  if (projectParam && messageField && !messageField.value) {
    messageField.value = `Hi — I saw the ${projectParam} project on your site and I'd like results like that for my business. `;
  }

  // Inline validation
  const errorMessages = {
    name: 'Please tell us your name.',
    email: 'Please enter a valid email address.',
    website: 'Please enter a valid URL (or leave this blank).',
    message: 'Please tell us a little about what you need.',
  };
  const validateField = (input) => {
    const field = input.closest('.field');
    if (!field) return true;
    const valid = input.checkValidity();
    field.classList.toggle('invalid', !valid);
    input.setAttribute('aria-invalid', String(!valid));
    const err = field.querySelector('.field-error');
    if (err && !valid) err.textContent = errorMessages[input.name] || 'Please check this field.';
    return valid;
  };
  contactForm.querySelectorAll('input:not([type="hidden"]):not([name="botcheck"]), select, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.field')?.classList.contains('invalid')) validateField(input);
    });
  });

  const statusEl = document.getElementById('form-status');
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const card = contactForm.closest('.contact-card');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = [...contactForm.querySelectorAll('input:not([type="hidden"]):not([name="botcheck"]), select, textarea')];
    const firstInvalid = inputs.find(i => !validateField(i));
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    statusEl.className = 'form-status';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        card.classList.add('sent');
        card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      statusEl.className = 'form-status error';
      statusEl.textContent = 'Something went wrong sending your message. Please try again, or email us directly.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
}
