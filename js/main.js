// ---- Content data ----
const logoNames = ['GIAT LTD', 'NinjaPlumbers', 'DiyahAesthetics', 'ShineyPetGrooming'];

const services = [
  { icon: '🌱', title: 'Website design & build', body: 'Modern, fast websites tailored to solo founders and small teams — built to convert, not just look nice.' },
  { icon: '📣', title: 'Google & Meta Ads', body: 'Paid campaigns on Google Search, Facebook, and Instagram that drive clicks from people ready to buy — tracked all the way to revenue.' },
  { icon: '🔍', title: 'SEO', body: 'Technical fixes, on-page optimization, and content that gets you found on Google for the searches that matter.' },
];

const projects = [
  { tag: 'Corporate', name: 'GIAT LTD', img: 'https://picsum.photos/seed/giat-corporate/640/420', result: '+3.2x return on ad spend' },
  { tag: 'Trades', name: 'NinjaPlumbers', img: 'https://picsum.photos/seed/ninja-plumbers/640/420', result: '52 leads/mo from Google Ads' },
  { tag: 'Beauty', name: 'DiyahAesthetics', img: 'https://picsum.photos/seed/diyah-aesthetics/640/420', result: '2.4x bookings via Meta Ads' },
  { tag: 'Pet Care', name: 'ShineyPetGrooming', img: 'https://picsum.photos/seed/shiney-pet-grooming/640/420', result: '+180% organic traffic' },
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
  { color: 't-green', initials: 'JT', name: 'James T.', role: 'NinjaPlumbers',
    quote: 'Within a month of the Google Ads going live, we were booked solid two weeks out. The phone genuinely doesn’t stop ringing on Mondays now.' },
  { color: 't-amber', initials: 'DA', name: 'Diyah A.', role: 'DiyahAesthetics',
    quote: 'The Instagram campaigns paid for themselves in the first week. New clients tell us the ads are what got them through the door.' },
  { color: 't-blue', initials: 'SG', name: 'Sarah G.', role: 'ShineyPetGrooming',
    quote: 'I finally understand where my marketing money goes. The monthly report shows exactly which ads brought in bookings — no jargon, just numbers.' },
];

const plans = [
  { name: 'Starter', desc: 'For solo founders launching their first site.', price: '$1,200', period: 'one-time', featured: false,
    features: ['5-page website', 'Mobile-optimized design', 'Basic on-page SEO', '30 days of support'] },
  { name: 'Growth', desc: 'For small teams ready to rank and grow.', price: '$650', period: '/month', featured: true,
    features: ['Everything in Starter', 'Ongoing SEO & content', 'Monthly reporting', 'Email marketing setup'] },
  { name: 'Scale', desc: 'For businesses investing in full growth.', price: '$1,400', period: '/month', featured: false,
    features: ['Everything in Growth', 'Google & Meta ads management', 'Conversion rate testing', 'Dedicated strategist'] },
];

// ---- Render helpers ----
function el(tag, className, html) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

const logosRow = document.getElementById('logos-row');
if (logosRow) {
  logoNames.forEach(name => logosRow.appendChild(el('div', 'logo-item', name)));
}

const servicesGrid = document.getElementById('services-grid');
if (servicesGrid) {
  services.forEach(s => {
    const card = el('div', 'service-card liftcard');
    card.innerHTML = `
      <div class="icon-wrap">${s.icon}</div>
      <div class="title">${s.title}</div>
      <div class="body">${s.body}</div>
    `;
    servicesGrid.appendChild(card);
  });
}

const workGrid = document.getElementById('work-grid');
if (workGrid) {
  const limit = parseInt(workGrid.dataset.limit, 10) || projects.length;
  projects.slice(0, limit).forEach(p => {
    const card = el('div', 'work-card zoomcard liftcard');
    card.innerHTML = `
      <div class="work-thumb"><img src="${p.img}" alt="${p.name} website" loading="lazy" decoding="async"></div>
      <div class="work-body">
        <div class="work-tag">${p.tag}</div>
        <div class="work-name">${p.name}</div>
        ${p.result ? `<div class="work-result">📈 ${p.result}</div>` : ''}
      </div>
    `;
    workGrid.appendChild(card);
  });
}

const processGrid = document.getElementById('process-grid');
if (processGrid) {
  steps.forEach(st => {
    const card = el('div', 'step-card');
    card.innerHTML = `
      <div class="step-num">${st.num}</div>
      <div class="step-title">${st.title}</div>
      <div class="step-body">${st.body}</div>
    `;
    processGrid.appendChild(card);
  });
}

const pricingGrid = document.getElementById('pricing-grid');
if (pricingGrid) {
  plans.forEach(pl => {
    const card = el('div', 'plan-card liftcard' + (pl.featured ? ' featured' : ''));
    const features = pl.features.map(f => `<div class="plan-feature"><span class="check">✓</span>${f}</div>`).join('');
    card.innerHTML = `
      <div class="plan-name">${pl.name}</div>
      <div class="plan-desc">${pl.desc}</div>
      <div class="plan-price">
        <div class="price-num">${pl.price}</div>
        <div class="price-period">${pl.period}</div>
      </div>
      ${features}
      <div class="plan-cta"><a href="contact.html?plan=${encodeURIComponent(pl.name)}">Get started with ${pl.name}</a></div>
    `;
    pricingGrid.appendChild(card);
  });
}

// ---- Keyword ticker (home only) ----
const tickerTrack = document.getElementById('ticker-track');
if (tickerTrack) {
  const half = tickerKeywords
    .map(k => `<span class="ticker-item">${k}</span><span class="ticker-sep">●</span>`)
    .join('');
  // two identical halves so the -50% scroll loops seamlessly
  tickerTrack.innerHTML = `<div class="ticker-half">${half}</div><div class="ticker-half">${half}</div>`;
}

// ---- Testimonials (home only) ----
const testimonialsGrid = document.getElementById('testimonials-grid');
if (testimonialsGrid) {
  testimonials.forEach(t => {
    const card = el('div', `testimonial-card liftcard ${t.color}`);
    card.innerHTML = `
      <div class="testimonial-stars">★★★★★</div>
      <p class="testimonial-quote">“${t.quote}”</p>
      <div class="testimonial-who">
        <div class="testimonial-avatar">${t.initials}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    `;
    testimonialsGrid.appendChild(card);
  });
}

// ---- Ads dashboard: animate funnel bars + count up stats when scrolled into view ----
const adsDash = document.getElementById('ads-dash');
if (adsDash) {
  const runCounters = () => {
    const preferReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    adsDash.querySelectorAll('.ads-stat-num[data-count]').forEach(elNum => {
      const target = parseFloat(elNum.dataset.count);
      const prefix = elNum.dataset.prefix || '';
      const suffix = elNum.dataset.suffix || '';
      const decimals = String(elNum.dataset.count).includes('.') ? 1 : 0;
      if (preferReduced) {
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
  };
  const go = () => {
    adsDash.classList.add('dash-go');
    runCounters();
  };
  if (!('IntersectionObserver' in window)) {
    go();
  } else {
    const dashIo = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        go();
        dashIo.disconnect();
      }
    }, { threshold: 0.35 });
    dashIo.observe(adsDash);
  }
}

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('nav-toggle');
if (navToggle) {
  const siteNav = navToggle.closest('.site-nav');
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => {
    if (siteNav.classList.contains('menu-open') && !siteNav.contains(e.target)) {
      siteNav.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ---- Rotating hero word (home only) ----
const wordEl = document.getElementById('rotating-word');
if (wordEl) {
  const words = ['grows', 'sells', 'ranks', 'converts', 'advertises'];
  let wordIdx = 0;

  // Reserve width for the widest word so the headline doesn't reflow/rewrap as words change length
  const measurer = document.createElement('span');
  measurer.style.cssText = 'position:absolute; visibility:hidden; white-space:nowrap; left:-9999px; top:0;';
  document.body.appendChild(measurer);
  const lockWordWidth = () => {
    measurer.style.font = getComputedStyle(wordEl).font;
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
    if (document.hidden) return; // don't churn animations in background tabs
    wordIdx = (wordIdx + 1) % words.length;
    wordEl.style.animation = 'none';
    wordEl.textContent = words[wordIdx];
    void wordEl.offsetWidth; // restart animation
    wordEl.style.animation = 'wordIn 0.5s cubic-bezier(.2,.8,.2,1)';
  }, 2600);
}

// ---- Hero mouse-tilt (home only) ----
const heroVisual = document.getElementById('hero-visual');
if (heroVisual) {
  const heroImgTilt = document.getElementById('hero-img-tilt');
  const cardATilt = document.getElementById('card-a-tilt');
  const cardBTilt = document.getElementById('card-b-tilt');

  heroVisual.addEventListener('mousemove', (e) => {
    const r = heroVisual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    heroImgTilt.style.transform = `perspective(900px) rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg)`;
    cardATilt.style.transform = `translate(${(x * 24).toFixed(1)}px, ${(y * 24).toFixed(1)}px)`;
    cardBTilt.style.transform = `translate(${(x * -18).toFixed(1)}px, ${(y * -18).toFixed(1)}px)`;
  });

  heroVisual.addEventListener('mouseleave', () => {
    heroImgTilt.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
    cardATilt.style.transform = 'translate(0px, 0px)';
    cardBTilt.style.transform = 'translate(0px, 0px)';
  });
}

// ---- Ambient effects: floating decos, parallax, card tilt, scroll reveal ----
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fineHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

function addDecos(scene, decos) {
  decos.forEach(d => {
    const deco = el('span', 'float-deco', d.emoji);
    deco.setAttribute('aria-hidden', 'true');
    for (const side of ['top', 'bottom', 'left', 'right']) {
      if (d[side] !== undefined) deco.style[side] = d[side];
    }
    deco.style.fontSize = d.size + 'px';
    deco.style.setProperty('--dur', d.dur + 's');
    deco.style.setProperty('--delay', d.delay + 's');
    deco.dataset.depth = d.depth;
    scene.appendChild(deco);
  });
  scene.classList.add('parallax-scene');
}

if (!reducedMotion) {
  const hero = document.querySelector('.hero');
  if (hero) {
    addDecos(hero, [
      { emoji: '🌿', top: '10%', left: '1%', size: 26, dur: 9, delay: 0, depth: 22 },
      { emoji: '✨', top: '6%', right: '38%', size: 18, dur: 7, delay: 1.4, depth: 34 },
      { emoji: '🍃', bottom: '12%', left: '34%', size: 22, dur: 8, delay: 0.7, depth: 28 },
    ]);
  }

  const pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    pageHero.appendChild(el('div', 'blob blob-a'));
    pageHero.appendChild(el('div', 'blob blob-b'));
    addDecos(pageHero, [
      { emoji: '🌿', top: '18%', left: '6%', size: 24, dur: 9, delay: 0, depth: 22 },
      { emoji: '✨', top: '30%', right: '10%', size: 17, dur: 7, delay: 1.1, depth: 34 },
      { emoji: '🍃', bottom: '4%', right: '22%', size: 20, dur: 8, delay: 0.5, depth: 26 },
    ]);
  }

  document.querySelectorAll('.cta-box').forEach(box => {
    addDecos(box, [
      { emoji: '🌱', top: '16%', left: '7%', size: 26, dur: 8, delay: 0, depth: 24 },
      { emoji: '✨', top: '24%', right: '9%', size: 18, dur: 7, delay: 1.3, depth: 34 },
      { emoji: '🍃', bottom: '16%', left: '15%', size: 21, dur: 9, delay: 0.6, depth: 28 },
      { emoji: '🌿', bottom: '22%', right: '16%', size: 24, dur: 8, delay: 0.9, depth: 20 },
    ]);
  });
}

// Mouse parallax: decos and blobs drift gently away from the cursor
if (!reducedMotion && fineHover) {
  document.querySelectorAll('.parallax-scene, .hero').forEach(scene => {
    const items = scene.querySelectorAll('.float-deco, .blob');
    if (!items.length) return;
    scene.addEventListener('mousemove', (e) => {
      const r = scene.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      items.forEach(it => {
        const depth = parseFloat(it.dataset.depth) || 26;
        it.style.transform = `translate(${(-x * depth).toFixed(1)}px, ${(-y * depth).toFixed(1)}px)`;
      });
    });
    scene.addEventListener('mouseleave', () => {
      items.forEach(it => { it.style.transform = ''; });
    });
  });
}

// 3D cursor tilt on cards (service, work, pricing)
if (!reducedMotion && fineHover) {
  document.querySelectorAll('.liftcard').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${(x * 6).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// Staggered scroll reveal
if (!reducedMotion && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll(
    '.service-card, .work-card, .plan-card, .step-card, .contact-point, .logo-item, .section-head, .testimonial-card, .split-card, .faq-item, .ads-copy'
  );
  targets.forEach(t => {
    const idx = t.parentElement ? [...t.parentElement.children].indexOf(t) : 0;
    t.classList.add('reveal');
    t.style.setProperty('--reveal-delay', `${Math.min(Math.max(idx, 0), 5) * 90}ms`);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const t = entry.target;
      t.classList.add('in');
      io.unobserve(t);
      // hand transforms back to CSS hover effects once the reveal finishes
      setTimeout(() => {
        t.classList.remove('reveal', 'in');
        t.style.removeProperty('--reveal-delay');
      }, 1200);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(t => io.observe(t));
}

// ---- Contact form (contact page only) ----
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  // Pre-select a plan when arriving from a pricing card link
  const planParam = new URLSearchParams(location.search).get('plan');
  const planSelect = contactForm.querySelector('select[name="interested_in"]');
  if (planParam && planSelect) {
    const match = [...planSelect.options].find(o => o.value === planParam);
    if (match) planSelect.value = planParam;
  }

  const statusEl = document.getElementById('form-status');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
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
        statusEl.className = 'form-status success';
        statusEl.textContent = 'Thanks! Your message is on its way — we usually reply within one business day.';
        contactForm.reset();
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
