// ---- Content data ----
const logoNames = ['Willow & Co.', 'North Bay Dental', 'Marlow Studio', 'Fern & Field', 'Halden Fitness'];

const services = [
  { icon: '🌱', title: 'Website design & build', body: 'Modern, fast websites tailored to solo founders and small teams — built to convert, not just look nice.' },
  { icon: '🔍', title: 'SEO', body: 'Technical fixes, on-page optimization, and content that gets you found on Google for the searches that matter.' },
  { icon: '📣', title: 'Marketing', body: 'Email, social, and local marketing campaigns that keep new customers coming back for more.' },
];

const projects = [
  { tag: 'Retail', name: 'Fern & Field', img: 'https://picsum.photos/seed/fern-shop/640/420' },
  { tag: 'Health', name: 'North Bay Dental', img: 'https://picsum.photos/seed/dental-web/640/420' },
  { tag: 'Fitness', name: 'Halden Fitness', img: 'https://picsum.photos/seed/fitness-web/640/420' },
  { tag: 'Hospitality', name: 'Willow & Co.', img: 'https://picsum.photos/seed/willow-cafe/640/420' },
  { tag: 'Creative', name: 'Marlow Studio', img: 'https://picsum.photos/seed/marlow-studio/640/420' },
  { tag: 'Trades', name: 'Ashgrove Plumbing', img: 'https://picsum.photos/seed/ashgrove-site/640/420' },
];

const steps = [
  { num: '01', title: 'Free audit', body: 'We review your current site and rankings, and share what’s holding you back.' },
  { num: '02', title: 'Design & build', body: 'A fresh, on-brand site designed around your customers and goals.' },
  { num: '03', title: 'Launch & optimize', body: 'We launch, then tune SEO and speed so people can actually find you.' },
  { num: '04', title: 'Grow', body: 'Ongoing marketing and reporting keep traffic and leads climbing.' },
];

const plans = [
  { name: 'Starter', desc: 'For solo founders launching their first site.', price: '$1,200', period: 'one-time', featured: false,
    features: ['5-page website', 'Mobile-optimized design', 'Basic on-page SEO', '30 days of support'] },
  { name: 'Growth', desc: 'For small teams ready to rank and grow.', price: '$650', period: '/month', featured: true,
    features: ['Everything in Starter', 'Ongoing SEO & content', 'Monthly reporting', 'Email marketing setup'] },
  { name: 'Scale', desc: 'For businesses investing in full growth.', price: '$1,400', period: '/month', featured: false,
    features: ['Everything in Growth', 'Paid ad management', 'Conversion rate testing', 'Dedicated strategist'] },
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

// ---- Rotating hero word (home only) ----
const wordEl = document.getElementById('rotating-word');
if (wordEl) {
  const words = ['grows', 'ranks', 'converts', 'works'];
  let wordIdx = 0;
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
    '.service-card, .work-card, .plan-card, .step-card, .contact-point, .logo-item, .section-head'
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
