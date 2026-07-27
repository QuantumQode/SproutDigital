// ---- Content data ----
const tickerKeywords = [
  'plumber near me', 'best hair salon', 'emergency electrician', 'dog groomer open now',
  'accountant for small business', 'physio near me', 'wedding photographer prices',
  'landscaping quotes', 'personal trainer', 'cafe open late',
];

// ---- Helpers ----
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fineHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---- Keyword ticker (inside ads box) ----
const tickerTrack = document.getElementById('ticker-track');
if (tickerTrack) {
  const half = tickerKeywords
    .map(k => `<span class="ticker-item">${k}</span><span class="ticker-sep">●</span>`)
    .join('');
  tickerTrack.innerHTML = `<div class="ticker-half">${half}</div><div class="ticker-half" aria-hidden="true">${half}</div>`;
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
  contactForm.querySelectorAll('input:not([type="hidden"]):not([name="_gotcha"]), select, textarea').forEach(input => {
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

    const inputs = [...contactForm.querySelectorAll('input:not([type="hidden"]):not([name="_gotcha"]), select, textarea')];
    const firstInvalid = inputs.find(i => !validateField(i));
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    statusEl.className = 'form-status';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        card.classList.add('sent');
        card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
      } else {
        const data = await res.json().catch(() => ({}));
        const message = data?.errors?.map(e => e.message).join(', ');
        throw new Error(message || 'Submission failed');
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
