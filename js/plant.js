// ---- Living plant canvas (home page only) ----
// A document-anchored plant rendered on a fixed canvas behind the page:
// a leaf canopy at the top, a stem that grows and sways as you scroll down
// the page, and a dirt pile with roots at the bottom. Reduced motion gets
// the same fully-grown plant as a static scene; no-JS gets the page as-is.
(() => {
  const canvas = document.getElementById('plant-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rmQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const darkQuery = matchMedia('(prefers-color-scheme: dark)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // -- Palette: mirrors the site's OKLCH tokens. Greens live at hue ~150;
  //    soil borrows the palette's existing amber family (hue ~75-85). [light, dark]
  const TOKENS = {
    stem:      ['oklch(0.47 0.12 150)',        'oklch(0.62 0.13 150)'],
    stemHi:    ['oklch(0.66 0.13 145 / 0.5)',  'oklch(0.76 0.12 145 / 0.35)'],
    vein:      ['oklch(0.4 0.12 150 / 0.5)',   'oklch(0.82 0.1 150 / 0.35)'],
    soilTop:   ['oklch(0.94 0.042 82)',        'oklch(0.23 0.035 75)'],
    soilDeep:  ['oklch(0.885 0.052 78)',       'oklch(0.19 0.03 75)'],
    pileTop:   ['oklch(0.92 0.045 78)',        'oklch(0.27 0.04 72)'],
    pileDeep:  ['oklch(0.855 0.055 74)',       'oklch(0.21 0.035 72)'],
    pileLip:   ['oklch(0.885 0.05 76)',        'oklch(0.24 0.038 72)'],
    pebble:    ['oklch(0.8 0.035 80)',         'oklch(0.32 0.025 80)'],
    root:      ['oklch(0.68 0.07 85 / 0.55)',  'oklch(0.44 0.05 85 / 0.5)'],
    grass:     ['oklch(0.55 0.14 148)',        'oklch(0.66 0.13 148)'],
    moteGreen: ['oklch(0.6 0.14 150)',         'oklch(0.72 0.13 150)'],
    moteGold:  ['oklch(0.75 0.12 85)',         'oklch(0.78 0.1 85)'],
  };
  // Leaf fill variants as [base, tip] gradients, per scheme.
  const LEAF_FILLS = [
    [['oklch(0.54 0.145 152)', 'oklch(0.68 0.155 140)'], ['oklch(0.58 0.14 152)', 'oklch(0.72 0.14 140)']],
    [['oklch(0.5 0.135 158)',  'oklch(0.64 0.15 146)'],  ['oklch(0.55 0.13 158)', 'oklch(0.68 0.14 146)']],
    [['oklch(0.57 0.14 144)',  'oklch(0.71 0.15 134)'],  ['oklch(0.61 0.135 144)','oklch(0.74 0.135 134)']],
  ];

  // Resolve any CSS color (incl. oklch) to an rgba string the canvas can use everywhere.
  const probe = document.createElement('span');
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const colorCache = new Map();
  const resolveColor = (str) => {
    if (colorCache.has(str)) return colorCache.get(str);
    probe.style.color = str;
    const out = getComputedStyle(probe).color;
    colorCache.set(str, out);
    return out;
  };
  let pal = {};
  let leafFills = [];
  const buildPalette = () => {
    const i = darkQuery.matches ? 1 : 0;
    pal = {};
    for (const key in TOKENS) pal[key] = resolveColor(TOKENS[key][i]);
    leafFills = LEAF_FILLS.map(v => [resolveColor(v[i][0]), resolveColor(v[i][1])]);
  };
  buildPalette();

  // Deterministic pseudo-random so the plant is the same on every visit.
  const rand = (seed) => {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  // -- State --
  let vw = 0, vh = 0, dpr = 1, docH = 0;
  let gutterMode = false;
  let stemTop = 180, stemBottom = 1000, stemX0 = 0, stemAmp = 0;
  let points = [];       // stem spine, doc-space
  let leaves = [];       // side leaves along the stem
  let canopy = [];       // leaf fan at the top
  let pebbles = [];
  let grassTufts = [];
  let motes = [];        // pollen, viewport-space
  let dirt = null;       // { groundY, pileX, pileW, pileH }
  let scrollY = 0, lastScrollY = 0, scrollVel = 0;
  let growFront = 0, growTarget = 0;
  let mx = -9999, my = -9999;
  let time = 0, lastNow = 0;
  let bottomBurstDone = false;
  let staticMode = rmQuery.matches;
  let staticDirty = true;
  let blendY = null, pileTargetX = 0;

  const stemBaseX = (y) => {
    let x = gutterMode
      ? stemX0 + Math.sin(y * 0.004 + 1.7) * 4
      : stemX0 + (Math.sin(y * 0.0009 + 1.2) * 0.62 + Math.sin(y * 0.0021 + 4.1) * 0.38) * stemAmp;
    // Final approach: bend the stem into the centre of the dirt pile.
    if (blendY !== null && y > blendY) {
      const t = Math.min((y - blendY) / 160, 1);
      const s = t * t * (3 - 2 * t);
      x = x * (1 - s) + pileTargetX * s;
    }
    return x;
  };
  const depthFrac = (y) => Math.min(Math.max((y - stemTop) / (stemBottom - stemTop), 0), 1);
  const stemWidth = (y) => {
    const d = depthFrac(y);
    return gutterMode ? 2.2 + d * 2.8 : 3.5 + d * 5.5;
  };
  // Free end is the top: sway fades to zero where the stem roots into the dirt.
  const freeFactor = (y) => Math.pow(1 - depthFrac(y), 1.5);

  const layout = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    docH = document.documentElement.scrollHeight;
    gutterMode = vw < 900;

    const footer = document.querySelector('.site-footer');
    const footerH = footer ? footer.getBoundingClientRect().height : 300;
    const groundH = Math.min(Math.max(footerH * 0.35, 70), 130);
    const groundY = docH - groundH;

    stemTop = 150;
    // End the stem just past the pile crest so the front lip buries it cleanly.
    stemBottom = groundY - 8;
    stemX0 = gutterMode ? 12 : vw / 2;
    stemAmp = gutterMode ? 0 : Math.min(vw * 0.26, 380);

    // Dirt pile: centred under the stem base on desktop, pulled onscreen on mobile.
    const pileW = gutterMode ? Math.min(vw * 0.9, 320) : 420;
    blendY = null;
    const rawBaseX = stemBaseX(stemBottom);
    pileTargetX = gutterMode
      ? 60
      : Math.min(Math.max(rawBaseX, pileW * 0.55), vw - pileW * 0.55);
    blendY = stemBottom - 160;
    dirt = {
      groundY,
      groundH,
      pileX: pileTargetX,
      pileW,
      pileH: gutterMode ? 70 : 110,
    };

    // Stem spine points (doc-space), ~36px apart.
    points = [];
    for (let y = stemTop; y <= stemBottom; y += 36) {
      points.push({ y, off: 0, vel: 0 });
    }
    if (points[points.length - 1].y < stemBottom) points.push({ y: stemBottom, off: 0, vel: 0 });

    // Leaves: anchored in each section's top/bottom padding whitespace,
    // where the canvas is actually visible between cards.
    leaves = [];
    let seed = 7;
    const anchors = [];
    document.querySelectorAll('main > section').forEach(sec => {
      const r = sec.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const bottom = r.bottom + window.scrollY;
      anchors.push(top + 46, bottom - 52);
    });
    anchors.sort((a, b) => a - b);
    const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : docH;
    let lastA = -1e9;
    let side = 1;
    anchors.forEach(a => {
      // No leaves behind footer text; keep them in section whitespace only.
      if (a - lastA < 260 || a < stemTop + vh * 0.5 || a > Math.min(stemBottom - 200, footerTop - 80)) return;
      lastA = a;
      side *= -1;
      const s = seed++;
      leaves.push({
        y: a + (rand(s) - 0.5) * 40,
        side: gutterMode ? 1 : side,
        size: (gutterMode ? 26 : 48) + rand(s + 1) * (gutterMode ? 10 : 18),
        variant: Math.floor(rand(s + 2) * leafFills.length),
        phase: rand(s + 3) * Math.PI * 2,
        tilt: -0.5 - rand(s + 4) * 0.35,
        unfurl: staticMode ? 1 : 0,
        uvel: 0,
        small: false,
      });
    });
    // Small leaflet pairs along the way keep the stem alive between anchors.
    for (let y = stemTop + vh * 0.8; y < Math.min(stemBottom - 300, footerTop - 80); y += 400) {
      const s = seed++;
      const yy = y + rand(s) * 120;
      leaves.push({
        y: yy,
        side: gutterMode ? 1 : (rand(s + 1) > 0.5 ? 1 : -1),
        size: (gutterMode ? 12 : 16) + rand(s + 2) * 8,
        variant: Math.floor(rand(s + 3) * leafFills.length),
        phase: rand(s + 4) * Math.PI * 2,
        tilt: -0.4 - rand(s + 5) * 0.4,
        unfurl: staticMode ? 1 : 0,
        uvel: 0,
        small: true,
      });
    }
    leaves.sort((a, b) => a.y - b.y);

    // Canopy: a fan of leaves at the top of the stem, echoing the brand mark.
    canopy = [];
    const n = gutterMode ? 5 : 7;
    // In the mobile gutter the fan tilts right so leaves stay onscreen.
    const fanCenter = gutterMode ? -Math.PI / 2 + 0.55 : -Math.PI / 2;
    const fanSpread = gutterMode ? 1.5 : 2.2;
    for (let k = 0; k < n; k++) {
      const s = 100 + k;
      const t = n === 1 ? 0.5 : k / (n - 1);
      canopy.push({
        ang: fanCenter + (t - 0.5) * fanSpread + (rand(s) - 0.5) * 0.2,
        size: (gutterMode ? 30 : 46) + Math.sin(t * Math.PI) * (gutterMode ? 16 : 30) + rand(s + 1) * 8,
        variant: k % leafFills.length,
        phase: rand(s + 2) * Math.PI * 2,
        delay: k * 90,
        unfurl: staticMode ? 1 : 0,
        uvel: 0,
      });
    }

    // Dirt dressing.
    pebbles = [];
    for (let k = 0; k < (gutterMode ? 7 : 12); k++) {
      const s = 200 + k;
      pebbles.push({
        x: rand(s) * vw,
        y: groundY + 24 + rand(s + 1) * (groundH - 40),
        rx: 3 + rand(s + 2) * 5,
        ry: 2 + rand(s + 3) * 3,
        rot: rand(s + 4) * Math.PI,
      });
    }
    grassTufts = [];
    for (let k = 0; k < (gutterMode ? 6 : 16); k++) {
      const s = 300 + k;
      grassTufts.push({
        x: rand(s) * vw,
        y: groundY + 4 + rand(s + 1) * 10,
        h: 8 + rand(s + 2) * (gutterMode ? 6 : 12),
        lean: (rand(s + 3) - 0.5) * 0.9,
        phase: rand(s + 4) * Math.PI * 2,
      });
    }

    if (motes.length === 0 && !staticMode) {
      const count = gutterMode ? 16 : 30;
      for (let k = 0; k < count; k++) {
        const s = 400 + k;
        motes.push({
          x: rand(s) * vw,
          y: rand(s + 1) * vh,
          r: 1 + rand(s + 2) * 1.8,
          alpha: 0.1 + rand(s + 3) * 0.2,
          phase: rand(s + 4) * Math.PI * 2,
          gold: rand(s + 5) > 0.72,
          vy: 0,
        });
      }
    }
    staticDirty = true;
  };

  // -- Drawing helpers --

  const drawLeafShape = (L) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(L * 0.25, -L * 0.34, L * 0.72, -L * 0.32, L, 0);
    ctx.bezierCurveTo(L * 0.72, L * 0.24, L * 0.25, L * 0.26, 0, 0);
    ctx.closePath();
  };

  const drawLeaf = (x, y, ang, size, unfurl, variant) => {
    if (unfurl <= 0.01) return;
    ctx.save();
    ctx.translate(x, y);
    // Unfurl: rotate out from the stem while scaling up, with spring overshoot.
    ctx.rotate(ang - (1 - Math.min(unfurl, 1)) * 1.1);
    const sc = Math.max(unfurl, 0.01);
    ctx.scale(sc, sc);
    const [base, tip] = leafFills[variant] || leafFills[0];
    const g = ctx.createLinearGradient(0, 0, size, 0);
    g.addColorStop(0, base);
    g.addColorStop(1, tip);
    ctx.fillStyle = g;
    drawLeafShape(size);
    ctx.fill();
    // Midrib
    ctx.strokeStyle = pal.vein;
    ctx.lineWidth = Math.max(size * 0.02, 0.8);
    ctx.beginPath();
    ctx.moveTo(size * 0.06, 0);
    ctx.quadraticCurveTo(size * 0.5, -size * 0.05, size * 0.94, -size * 0.01);
    ctx.stroke();
    ctx.restore();
  };

  const pointX = (p) => stemBaseX(p.y) + p.off;

  // Interpolated stem position/sway at an arbitrary doc y.
  const stemAt = (y) => {
    if (points.length === 0) return { x: stemBaseX(y), off: 0 };
    const i = Math.min(Math.max(Math.floor((y - stemTop) / 36), 0), points.length - 1);
    const p0 = points[i], p1 = points[Math.min(i + 1, points.length - 1)];
    const span = p1.y - p0.y || 1;
    const t = Math.min(Math.max((y - p0.y) / span, 0), 1);
    const off = p0.off + (p1.off - p0.off) * t;
    return { x: stemBaseX(y) + off, off };
  };

  const drawStem = () => {
    const yMin = scrollY - 80;
    const yMax = scrollY + vh + 80;
    const visible = points.filter(p => p.y >= yMin && p.y <= yMax && p.y <= growFront);
    if (visible.length < 2) return;

    // Ribbon: left edge down, right edge back up, with a taper to a point at the growth front.
    const tip = growFront < stemBottom - 10;
    ctx.beginPath();
    const edge = (dir, list) => {
      list.forEach((p, i) => {
        let w = stemWidth(p.y) / 2;
        if (tip) {
          const fromTip = growFront - p.y;
          if (fromTip < 120) w *= Math.max(fromTip / 120, 0.06);
        }
        const x = pointX(p) + dir * w;
        if (i === 0) ctx.lineTo(x, p.y);
        else {
          const prev = list[i - 1];
          let pw = stemWidth(prev.y) / 2;
          if (tip) {
            const fromTip = growFront - prev.y;
            if (fromTip < 120) pw *= Math.max(fromTip / 120, 0.06);
          }
          const px = pointX(prev) + dir * pw;
          ctx.quadraticCurveTo(px, prev.y, (px + x) / 2, (prev.y + p.y) / 2);
        }
      });
      const last = list[list.length - 1];
      let lw = stemWidth(last.y) / 2;
      if (tip) {
        const fromTip = growFront - last.y;
        if (fromTip < 120) lw *= Math.max(fromTip / 120, 0.06);
      }
      ctx.lineTo(pointX(last) + dir * lw, last.y);
    };
    ctx.moveTo(pointX(visible[0]) - stemWidth(visible[0].y) / 2, visible[0].y);
    edge(-1, visible);
    edge(1, [...visible].reverse());
    ctx.closePath();
    ctx.fillStyle = pal.stem;
    ctx.fill();

    // Highlight line down the left side of the ribbon for roundness.
    ctx.beginPath();
    visible.forEach((p, i) => {
      const x = pointX(p) - stemWidth(p.y) * 0.18;
      if (i === 0) ctx.moveTo(x, p.y);
      else ctx.lineTo(x, p.y);
    });
    ctx.strokeStyle = pal.stemHi;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Growing tip: a soft curl with two tiny leaflets.
    if (tip && growFront >= yMin && growFront <= yMax) {
      const s = stemAt(growFront);
      ctx.save();
      ctx.translate(s.x, growFront);
      ctx.strokeStyle = pal.stem;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(6, 10, 0, 16);
      ctx.quadraticCurveTo(-5, 20, -1, 23);
      ctx.stroke();
      ctx.restore();
      drawLeaf(s.x, growFront + 4, -2.4, 11, 1, 0);
      drawLeaf(s.x, growFront + 4, -0.7, 11, 1, 1);
    }
  };

  const drawDirt = () => {
    if (!dirt) return;
    const { groundY, groundH, pileX, pileW, pileH } = dirt;
    if (groundY - pileH > scrollY + vh) return;

    // Ground layer across the full width, gently undulating.
    const g = ctx.createLinearGradient(0, groundY, 0, docH);
    g.addColorStop(0, pal.soilTop);
    g.addColorStop(1, pal.soilDeep);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, groundY + 14);
    for (let x = 0; x <= vw; x += 90) {
      ctx.quadraticCurveTo(x + 45, groundY + 14 + Math.sin(x * 0.013) * 9 - 9, Math.min(x + 90, vw), groundY + 14);
    }
    ctx.lineTo(vw, docH);
    ctx.lineTo(0, docH);
    ctx.closePath();
    ctx.fill();

    // The dirt pile: a heap under the stem base.
    const pg = ctx.createLinearGradient(0, groundY - pileH, 0, groundY + 40);
    pg.addColorStop(0, pal.pileTop);
    pg.addColorStop(1, pal.pileDeep);
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.moveTo(pileX - pileW / 2, groundY + 20);
    ctx.bezierCurveTo(pileX - pileW * 0.3, groundY - pileH * 0.55, pileX - pileW * 0.16, groundY - pileH, pileX, groundY - pileH);
    ctx.bezierCurveTo(pileX + pileW * 0.18, groundY - pileH, pileX + pileW * 0.32, groundY - pileH * 0.5, pileX + pileW / 2, groundY + 20);
    ctx.closePath();
    ctx.fill();

    // Roots: drooping curves from under the pile lip out into the soil,
    // kept inside the document so they never clip at the page edge.
    ctx.strokeStyle = pal.root;
    ctx.lineCap = 'round';
    for (let k = 0; k < 5; k++) {
      const jit = rand(600 + k);
      const spread = (k - 2) * 0.5 + (jit - 0.5) * 0.24;
      const reach = 0.24 + rand(610 + k) * 0.24;
      const droop = 14 + rand(620 + k) * 22;
      const endX = pileX + spread * pileW * reach;
      const endY = Math.min(groundY + groundH * (0.35 + Math.abs(spread) * 0.2) + droop, docH - 10);
      ctx.lineWidth = 2.8 - Math.abs(k - 2) * 0.55;
      ctx.beginPath();
      ctx.moveTo(pileX, groundY - 26);
      // Dive down first, then bend outward — each root with its own droop.
      ctx.bezierCurveTo(
        pileX + spread * 6, groundY + droop,
        pileX + spread * pileW * reach * 0.4, groundY + groundH * 0.28 + droop * 0.4,
        endX, endY
      );
      ctx.stroke();
      // A short rootlet forking off each main root.
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      const midX = pileX + spread * pileW * reach * 0.35;
      const midY = groundY + groundH * 0.2 + droop * 0.5;
      ctx.moveTo(midX, midY);
      ctx.quadraticCurveTo(midX + spread * 16, midY + 14, midX + spread * 24, midY + 20 + jit * 10);
      ctx.stroke();
    }
  };

  const drawDirtFront = () => {
    if (!dirt) return;
    const { groundY, pileX, pileW, pileH } = dirt;
    if (groundY - pileH > scrollY + vh) return;
    // A front lip of the pile buries the stem base.
    ctx.fillStyle = pal.pileLip;
    ctx.beginPath();
    ctx.moveTo(pileX - pileW * 0.3, groundY + 24);
    ctx.bezierCurveTo(pileX - pileW * 0.14, groundY - pileH * 0.42, pileX + pileW * 0.1, groundY - pileH * 0.4, pileX + pileW * 0.3, groundY + 24);
    ctx.closePath();
    ctx.fill();

    // Pebbles.
    ctx.fillStyle = pal.pebble;
    pebbles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Grass tufts along the crest.
    ctx.strokeStyle = pal.grass;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    grassTufts.forEach(t2 => {
      const sway = staticMode ? 0 : Math.sin(time * 1.3 + t2.phase) * 1.6;
      for (let b = -1; b <= 1; b++) {
        ctx.beginPath();
        ctx.moveTo(t2.x + b * 2.4, t2.y);
        ctx.quadraticCurveTo(
          t2.x + b * 3 + t2.lean * 4 + sway, t2.y - t2.h * 0.6,
          t2.x + b * 4 + t2.lean * 8 + sway, t2.y - t2.h
        );
        ctx.stroke();
      }
    });
  };

  const drawCanopy = () => {
    if (stemTop - 160 > scrollY + vh || stemTop + 60 < scrollY) return;
    const s = stemAt(stemTop);
    canopy.forEach(leaf => {
      const sway = staticMode ? 0 : Math.sin(time * 0.8 + leaf.phase) * 0.045;
      drawLeaf(s.x, stemTop + 6, leaf.ang + sway, leaf.size, leaf.unfurl, leaf.variant);
    });
  };

  const drawLeaves = () => {
    const yMin = scrollY - 120;
    const yMax = scrollY + vh + 120;
    leaves.forEach(leaf => {
      if (leaf.y < yMin || leaf.y > yMax || leaf.y > growFront) return;
      const s = stemAt(leaf.y);
      const sway = staticMode ? 0 : Math.sin(time * 0.9 + leaf.phase) * 0.05 + s.off * 0.004;
      const ang = leaf.side === 1 ? leaf.tilt + sway : Math.PI - leaf.tilt + sway;
      drawLeaf(s.x + leaf.side * stemWidth(leaf.y) * 0.3, leaf.y, ang, leaf.size, leaf.unfurl, leaf.variant);
    });
  };

  const drawMotes = () => {
    motes.forEach(m => {
      ctx.globalAlpha = m.alpha * (0.75 + 0.25 * Math.sin(time * 1.7 + m.phase));
      ctx.fillStyle = m.gold ? pal.moteGold : pal.moteGreen;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  };

  const render = () => {
    ctx.clearRect(0, 0, vw, vh);
    ctx.save();
    ctx.translate(0, -scrollY);
    drawDirt();
    drawStem();
    drawDirtFront();
    drawLeaves();
    drawCanopy();
    ctx.restore();
    if (!staticMode) drawMotes();
  };

  // -- Simulation --

  const stepSpring = (obj, target, k, damp, dt, posKey, velKey) => {
    obj[velKey] += (target - obj[posKey]) * k * dt;
    obj[velKey] *= Math.pow(damp, dt);
    obj[posKey] += obj[velKey] * dt;
  };

  const update = (dt) => {
    // Scroll velocity (px/frame, smoothed) leans the stem as you travel.
    const rawVel = scrollY - lastScrollY;
    lastScrollY = scrollY;
    scrollVel += (rawVel - scrollVel) * 0.12 * dt;
    const lean = Math.max(Math.min(scrollVel * 0.55, 26), -26);

    // Growth front chases just past the viewport bottom and never retreats.
    growTarget = Math.max(growTarget, Math.min(scrollY + vh * 1.15, stemBottom));
    growFront += (growTarget - growFront) * Math.min(0.055 * dt, 1);
    if (growFront > stemBottom - 1) growFront = stemBottom;

    // Stem sway: idle breeze + scroll lean + cursor push, spring-tracked per point.
    const cursorDocY = my + scrollY;
    points.forEach(p => {
      if (p.y < scrollY - 200 || p.y > scrollY + vh + 200) { p.off += (0 - p.off) * 0.02 * dt; return; }
      const f = freeFactor(p.y);
      let target =
        Math.sin(time * 0.9 + p.y * 0.006) * 4.5 * f +
        Math.sin(time * 0.47 + p.y * 0.0115) * 2 * f +
        lean * f;
      if (finePointer && mx > -999) {
        const dx = stemBaseX(p.y) + p.off - mx;
        const dy = p.y - cursorDocY;
        const d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) {
          const d = Math.sqrt(d2) || 1;
          target += (dx / d) * (1 - d / 140) * 24;
        }
      }
      stepSpring(p, target, 0.045, 0.9, dt, 'off', 'vel');
    });

    // Leaf unfurl: spring open when the anchor rises into view (or the stem reaches it).
    const now = performance.now();
    leaves.forEach(leaf => {
      if (leaf.unfurl >= 1 && Math.abs(leaf.uvel) < 0.001) return;
      const inView = leaf.y < scrollY + vh * 0.92 && leaf.y <= growFront + 60;
      if (inView && !leaf.t0) leaf.t0 = now;
      const target = leaf.t0 ? 1 : 0;
      if (target === 0 && leaf.unfurl === 0) return;
      stepSpring(leaf, target, 0.05, 0.87, dt, 'unfurl', 'uvel');
    });

    // Canopy unfurls once the stem starts growing, staggered.
    canopy.forEach(leaf => {
      if (!leaf.t0 && growFront > stemTop + 30) leaf.t0 = now + leaf.delay;
      const target = leaf.t0 && now >= leaf.t0 ? 1 : 0;
      if (target === 0 && leaf.unfurl === 0) return;
      stepSpring(leaf, target, 0.045, 0.86, dt, 'unfurl', 'uvel');
    });

    // Bottom moment: when the stem roots into the pile, puff a few motes upward.
    if (!bottomBurstDone && growFront >= stemBottom - 2 && dirt && scrollY + vh > dirt.groundY - 40) {
      bottomBurstDone = true;
      const px = dirt.pileX;
      const py = dirt.groundY - dirt.pileH - scrollY;
      for (let k = 0; k < 8; k++) {
        const m = motes[k % motes.length];
        if (!m) break;
        m.x = px + (rand(500 + k) - 0.5) * 80;
        m.y = py;
        m.vy = -1.4 - rand(510 + k) * 1.2;
        m.alpha = 0.35;
      }
    }

    // Motes drift upward through the viewport; scrolling adds relative wind.
    motes.forEach(m => {
      m.vy += (-0.22 - m.vy) * 0.02 * dt;
      m.y += (m.vy + scrollVel * 0.3) * dt;
      m.x += Math.sin(time * 0.6 + m.phase) * 0.18 * dt;
      if (finePointer && mx > -999) {
        const dx = m.x - mx, dy = m.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 90 * 90 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          m.x += (dx / d) * (1 - d / 90) * 1.6 * dt;
          m.y += (dy / d) * (1 - d / 90) * 1.6 * dt;
        }
      }
      if (m.y < -10) { m.y = vh + 10; m.x = rand(m.phase * 999) * vw; }
      if (m.y > vh + 12) m.y = -8;
      if (m.x < -10) m.x = vw + 8;
      if (m.x > vw + 10) m.x = -8;
    });
  };

  // -- Loops --

  let rafId = 0;
  const liveLoop = (now) => {
    rafId = requestAnimationFrame(liveLoop);
    if (document.hidden) return;
    const dt = Math.min((now - lastNow) / 16.7, 2.5) || 1;
    lastNow = now;
    time += dt * 0.0167;
    scrollY = window.scrollY;
    update(dt);
    render();
  };

  let staticQueued = false;
  const staticRender = () => {
    if (staticQueued) return;
    staticQueued = true;
    requestAnimationFrame(() => {
      staticQueued = false;
      scrollY = window.scrollY;
      growFront = stemBottom;
      render();
    });
  };

  const start = () => {
    cancelAnimationFrame(rafId);
    layout();
    if (staticMode) {
      growFront = growTarget = stemBottom;
      leaves.forEach(l => { l.unfurl = 1; });
      canopy.forEach(l => { l.unfurl = 1; });
      staticRender();
    } else {
      growFront = growTarget = stemTop;
      lastNow = performance.now();
      rafId = requestAnimationFrame(liveLoop);
    }
  };

  // -- Wiring --

  window.addEventListener('scroll', () => { if (staticMode) staticRender(); }, { passive: true });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const keepGrow = growFront;
      layout();
      growFront = Math.min(Math.max(keepGrow, stemTop), stemBottom);
      growTarget = Math.max(growTarget, growFront);
      if (staticMode) staticRender();
    }, 150);
  });

  // Doc height changes (fonts, lazy content) shift the dirt: relayout quietly.
  if ('ResizeObserver' in window) {
    let lastH = 0;
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastH) > 40) {
        lastH = h;
        const keepGrow = growFront;
        layout();
        growFront = Math.min(Math.max(keepGrow, stemTop), stemBottom);
        if (staticMode) { growFront = stemBottom; staticRender(); }
      }
    });
    ro.observe(document.body);
  }

  if (finePointer) {
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    window.addEventListener('mouseout', (e) => { if (!e.relatedTarget) { mx = -9999; my = -9999; } });
  }

  darkQuery.addEventListener('change', () => {
    colorCache.clear();
    buildPalette();
    if (staticMode) staticRender();
  });

  rmQuery.addEventListener('change', () => {
    staticMode = rmQuery.matches;
    start();
  });

  start();
})();
