---
name: SproutDigital
description: Websites, SEO, and Google & Meta Ads for small businesses that want to grow.
colors:
  ink: "light-dark(oklch(0.22 0.015 150), oklch(0.93 0.012 150))"
  ink-soft: "light-dark(oklch(0.4 0.015 150), oklch(0.78 0.015 150))"
  muted: "light-dark(oklch(0.48 0.015 150), oklch(0.68 0.015 150))"
  sprout-green: "light-dark(oklch(0.6 0.15 150), oklch(0.66 0.15 150))"
  sprout-green-dark: "light-dark(oklch(0.5 0.15 150), oklch(0.58 0.15 150))"
  sprout-green-deep: "light-dark(oklch(0.4 0.13 150), oklch(0.82 0.12 150))"
  sprout-green-soft: "light-dark(oklch(0.94 0.03 150), oklch(0.27 0.035 150))"
  sprout-green-label: "light-dark(oklch(0.48 0.14 150), oklch(0.75 0.14 150))"
  canvas: "light-dark(oklch(0.98 0.008 150), oklch(0.17 0.015 150))"
  card: "light-dark(oklch(1 0 0), oklch(0.22 0.018 150))"
  card-glass: "light-dark(oklch(1 0 0 / 0.78), oklch(0.2 0.02 150 / 0.82))"
  border: "light-dark(oklch(0.92 0.008 150), oklch(0.31 0.015 150))"
  border-strong: "light-dark(oklch(0.85 0.02 150), oklch(0.38 0.02 150))"
  hover-fill: "light-dark(oklch(0.95 0.02 150), oklch(0.27 0.02 150))"
  link: "light-dark(oklch(0.5 0.13 150), oklch(0.72 0.13 150))"
  link-hover: "light-dark(oklch(0.4 0.13 150), oklch(0.82 0.13 150))"
  shadow-tint: "light-dark(oklch(0.3 0.05 150), oklch(0 0 0))"
  amber-soft: "light-dark(oklch(0.95 0.045 85), oklch(0.28 0.04 85))"
  blue-soft: "light-dark(oklch(0.95 0.025 240), oklch(0.27 0.03 250))"
  star-gold: "oklch(0.72 0.15 80)"
  google-blue: "oklch(0.65 0.17 250)"
  meta-purple: "oklch(0.65 0.2 300)"
  retarget-green: "oklch(0.7 0.16 150)"
  conversion-gold: "oklch(0.75 0.15 80)"
typography:
  display:
    fontFamily: "'Bricolage Grotesque', sans-serif"
    fontSize: "clamp(38px, 4.6vw + 10px, 64px)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Bricolage Grotesque', sans-serif"
    fontSize: "clamp(29px, 2.4vw + 8px, 40px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Bricolage Grotesque', sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "'Figtree', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Figtree', sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  xs: "4px"
  sm: "10px"
  md: "16px"
  lg: "20px"
  xl: "28px"
  pill: "100px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "clamp(72px, 9vw, 120px)"
components:
  button-primary:
    backgroundColor: "{colors.sprout-green}"
    textColor: "white"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "14px 30px"
  button-primary-hover:
    backgroundColor: "{colors.sprout-green-dark}"
    textColor: "white"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "14px 30px"
  button-secondary-hover:
    backgroundColor: "{colors.hover-fill}"
    textColor: "{colors.ink}"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.md}"
    padding: "28px"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "13px 16px"
---

# Design System: SproutDigital

## Overview

**Creative North Star: "The Living Greenhouse"**

SproutDigital's interface reads like a warm, glassy greenhouse: a sticky glass-panel nav with backdrop blur floats over drifting organic blobs and a dot-grid backdrop, while everything under that glass pane is built from confident, growth-green surfaces, soft pill badges, and cards that lift toward the viewer on hover like leaves catching light. Bricolage Grotesque gives numbers and headlines a slightly architectural, geometric weight; Figtree keeps the body text warm and easy. The mood is fresh, optimistic, and credible — energetic enough to feel like a growing business, but never loud or gimmicky. Explicitly avoid cold enterprise-SaaS blue/gray monochrome, and avoid cutesy or toy-like illustration; the "greenhouse" is real glass and real plants, not a cartoon.

Every color, shadow, and hover state is authored through native `light-dark()` + OKLCH, so the whole system flips between light and dark mode without a second token set — dark mode isn't a reskin, it's the same greenhouse at dusk.

**Key Characteristics:**
- Glass-panel navigation (backdrop blur) floating above the page, not flush with it
- A single hue (150°, sprout green) carries almost all color; amber and blue appear only as rare seasoning
- Generous, consistent rounding — pill shapes for labels/badges, 16–20px cards, circles for avatars and dots
- Soft, brand-tinted ambient shadows at rest, deepening and lifting further on hover
- Organic decorative elements (blurred blobs, dot-grid mask) behind precise, data-forward UI (bento stats, funnel bars, animated counters)

## Colors

The palette is built from one hue family (150°, green) doing almost all of the work, with amber and blue held in reserve as rare, single-purpose accents.

### Primary
- **Sprout Green** (`light-dark(oklch(0.6 0.15 150), oklch(0.66 0.15 150))`): the brand color. Used on primary CTAs, links, the nav's active-state underline, icon-wrap accents, and the scroll-progress bar. This is the color a visitor should associate with SproutDigital.
- **Sprout Green Dark** (`light-dark(oklch(0.5 0.15 150), oklch(0.58 0.15 150))`): the hover/pressed state for Sprout Green — buttons and nav CTAs darken into this on hover rather than lightening.
- **Sprout Green Deep** (`light-dark(oklch(0.4 0.13 150), oklch(0.82 0.12 150))`): a higher-contrast green for text/numbers sitting on `sprout-green-soft` tinted backgrounds (bento ROAS number, testimonial metric pill, avatar initials).
- **Sprout Green Soft** (`light-dark(oklch(0.94 0.03 150), oklch(0.27 0.035 150))`): the tint background for eyebrow badges, icon-wrap chips, and the "green" testimonial card variant.
- **Sprout Green Label** (`light-dark(oklch(0.48 0.14 150), oklch(0.75 0.14 150))`): the dedicated color for uppercase `.eyebrow-label` section kickers — distinct from body-text green so labels stay legible at small sizes.

### Secondary (rare accents — not a second brand color)
- **Amber Soft** (`light-dark(oklch(0.95 0.045 85), oklch(0.28 0.04 85))`): background tint for exactly one testimonial-card variant, breaking up an all-green testimonials grid. Not used elsewhere.
- **Blue Soft** (`light-dark(oklch(0.95 0.025 240), oklch(0.27 0.03 250))`): background tint for the other testimonial-card variant, and echoed in the Google-ads split card (blue = "Google" association). Not used elsewhere.
- **Star Gold** (`oklch(0.72 0.15 80)`): fixed (no light/dark split) — used only for 5-star rating icons.

### Channel Identity (fixed, chip-dot only)
Four fixed-hue colors used exclusively as the small dot inside the paid-ads channel chips on the homepage and `services.html`. They exist to let a Google chip read as "Google" and a Meta chip read as "Meta" at a glance — a recognizable external association, not part of the brand palette. Never promote these to backgrounds, text, buttons, or any other role.
- **Google Blue** (`oklch(0.65 0.17 250)`): the dot on Google Search Ads / Search campaigns / Keyword strategy chips.
- **Meta Purple** (`oklch(0.65 0.2 300)`): the dot on Meta / Facebook & Instagram / Retargeting / Creative & copy chips.
- **Retarget Green** (`oklch(0.7 0.16 150)`): the dot on the Retargeting chip on the homepage ads section — deliberately a different green value from Sprout Green so it reads as its own channel, not as the brand accent.
- **Conversion Gold** (`oklch(0.75 0.15 80)`): the dot on the Conversion tracking chip.

### Neutral
- **Ink** (`light-dark(oklch(0.22 0.015 150), oklch(0.93 0.012 150))`): primary text color. Note the faint green cast (chroma 0.015 at hue 150) — even neutrals stay inside the greenhouse's hue family rather than going true gray.
- **Ink Soft** (`light-dark(oklch(0.4 0.015 150), oklch(0.78 0.015 150))`): secondary/supporting text — lede paragraphs, card body copy.
- **Muted** (`light-dark(oklch(0.48 0.015 150), oklch(0.68 0.015 150))`): tertiary text — plan descriptions, testimonial roles, footnotes.
- **Canvas** (`light-dark(oklch(0.98 0.008 150), oklch(0.17 0.015 150))`): page background.
- **Card** (`light-dark(oklch(1 0 0), oklch(0.22 0.018 150))`): the surface color for cards, tiles, and the contact form panel.
- **Card Glass** (`light-dark(oklch(1 0 0 / 0.78), oklch(0.2 0.02 150 / 0.82))`): translucent card surface, used specifically for the backdrop-blur nav.
- **Border** (`light-dark(oklch(0.92 0.008 150), oklch(0.31 0.015 150))`): default 1px hairline border on cards and inputs at rest.
- **Border Strong** (`light-dark(oklch(0.85 0.02 150), oklch(0.38 0.02 150))`): the heavier border on `.btn-secondary` and pricing CTAs — anything outlined that needs to read as clickable without a fill.
- **Hover Fill** (`light-dark(oklch(0.95 0.02 150), oklch(0.27 0.02 150))`): the background wash for hovered ghost/secondary buttons.
- **Link / Link Hover** (`light-dark(oklch(0.5 0.13 150), oklch(0.72 0.13 150))` / `light-dark(oklch(0.4 0.13 150), oklch(0.82 0.13 150))`): inline text link colors, one step off Sprout Green so links stay distinguishable from CTA buttons.
- **Shadow Tint** (`light-dark(oklch(0.3 0.05 150), oklch(0 0 0))`): the base color every ambient shadow is mixed from via `oklch(from var(--shadow-tint) l c h / alpha)` — see the Tinted Shadow rule under Elevation.

### Named Rules
**The One Hue Rule.** Sprout Green (hue 150°) is the only color allowed to carry brand meaning — CTAs, links, active states, icon accents. Amber and Blue are reserved strictly for the two testimonial-card variants and the Google-ads split card; they must never appear on a CTA, nav element, or primary metric. If a new component needs a second color, reach for a green tint (`sprout-green-soft`, `sprout-green-deep`) before reaching for amber or blue.

## Typography

**Display Font:** Bricolage Grotesque (with sans-serif fallback)
**Body Font:** Figtree (with sans-serif fallback)

**Character:** Bricolage Grotesque's slightly architectural, high-contrast letterforms carry headlines and numbers with geometric confidence; Figtree keeps paragraphs, labels, and UI text warm, rounded, and easy to scan. The pairing is "confident number, friendly sentence."

### Hierarchy
- **Display** (700, `clamp(38px, 4.6vw + 10px, 64px)`, line-height 1.04, letter-spacing -0.02em): the single hero `<h1>` only.
- **Headline** (700, `clamp(29px, 2.4vw + 8px, 40px)`, line-height ~1.15, letter-spacing -0.01em): every `<h2>` section heading, paired above with an uppercase Label kicker.
- **Title** (700, 21px, Bricolage Grotesque): card-level headings — service card titles, plan names, work-card titles. Also used at 800 weight and larger sizes (30–68px) for standalone stat numbers (bento tiles, plan price).
- **Body** (400–600, 14.5–16px, line-height 1.6, Figtree): paragraph copy, card descriptions, form labels/inputs. Line length is naturally constrained by card/column width rather than an explicit `ch` cap.
- **Label** (700, 13px, letter-spacing 0.1em, uppercase, Figtree): `.eyebrow-label` section kickers and the hero `.eyebrow` pill — always uppercase, always Sprout Green Label colored.

### Named Rules
**The Kicker-Before-Headline Rule.** Every section `<h2>` is preceded by an uppercase Label-style eyebrow in Sprout Green Label. A headline never appears without its kicker; the pair is one unit, not two independent elements.

## Layout

Content sits in a single `.wrap` container, `max-width: 1280px`, with fluid side padding `clamp(20px, 5vw, 64px)` — no breakpoint-specific container widths, the clamp does the work continuously. Section vertical rhythm uses one repeated fluid value, `clamp(72px, 9vw, 120px)`, for top/bottom section padding, so pacing stays consistent from hero to footer.

Grids are explicit CSS Grid, not auto-fill: services and work use `repeat(3, 1fr)` at desktop, collapsing to single-column on mobile; the results section uses a named-area 4-column bento grid (`roas roas cpl launch` / `roas roas quote quote`) that also collapses to a simple stack on mobile. Card/grid gaps run 18–24px.

The nav is `position: sticky; top: 12px`, floating clear of the viewport edge rather than flush against it, reinforcing the "glass pane" reading. A sticky mobile CTA bar appears only below the desktop breakpoint.

## Elevation & Depth

Surfaces carry a **soft ambient lift at rest**, not just on interaction: the nav, browser-mock, bento tiles, testimonial/contact cards, and buttons all sit above a diffuse, brand-tinted shadow even when idle. Hover doesn't introduce depth from nothing — it deepens and spreads an already-present shadow while lifting the element (`translateY(-3px)` to `-6px`) and, for primary buttons, darkening the fill. Depth here signals warmth and tactility, not just z-order hierarchy.

### Shadow Vocabulary
- **Ambient nav** (`box-shadow: 0 8px 24px -16px oklch(from var(--shadow-tint) l c h / 0.3)`): resting elevation for the sticky glass nav.
- **Ambient card** (`box-shadow: 0 24px 48px -20px oklch(from var(--shadow-tint) l c h / 0.35)`): the `.liftcard` hover state shared by service/testimonial/work cards.
- **Ambient hero mock** (`box-shadow: 0 40px 80px -30px oklch(from var(--shadow-tint) l c h / 0.45)`): the largest, softest shadow — reserved for the hero's browser-frame mockup, the page's single largest floating surface.
- **Button hover glow** (`box-shadow: 0 16px 32px -12px oklch(0.5 0.15 150 / 0.5)`): a Sprout-Green-tinted glow specific to `.btn-primary:hover`, distinct from the neutral shadow-tint family.

### Named Rules
**The Tinted Shadow Rule.** No shadow in this system uses plain black. Every `box-shadow` derives its color from `--shadow-tint` (a dark, faintly-green OKLCH value in light mode; near-black in dark mode) via `oklch(from var(--shadow-tint) l c h / alpha)`, or from Sprout Green directly for interactive glows. A shadow that reads as neutral gray/black is a bug, not a stylistic choice.

## Shapes

Rounding is generous and consistent: buttons and inputs at 10px, standard cards at 16px, larger feature tiles (bento, testimonials, contact form) at 18–20px, and the largest showcase panels (ads box) at 28px. Labels, badges, chips, and metric pills always use full pill rounding (`100px`), never the card radius scale — a badge should never look like a small card. Avatars, status dots, and decorative blobs are perfect circles (`50%`). Borders are hairline (1–1.5px) and low-contrast at rest (`--border`), stepping up to `--border-strong` only where an outline must read as clickable on its own (secondary buttons, pricing CTAs).

## Components

Buttons, cards, and inputs share one tactile signature: **confident and tactile** — generous radii, pill badges, and hover states that visibly lift and deepen rather than just recolor.

### Buttons
- **Shape:** 10px radius (`--rounded.sm`), except the compact nav CTA at the same visual weight with a slightly tighter radius.
- **Primary:** Sprout Green background, white text, 700 weight, `14px 30px` padding, 48px min-height (touch target). Hover: background steps to Sprout Green Dark, lifts `translateY(-3px)`, and gains the Sprout-Green-tinted glow shadow.
- **Secondary:** transparent background, 1.5px Border Strong outline, Ink text. Hover: fills with Hover Fill and lifts the same `-3px`.
- **Nav CTA:** same green fill as Primary but smaller (15px text, `10px 22px` padding); hover scales `1.04` instead of translating, since it sits inline in the nav rather than floating on a section.

### Chips
- **Style:** pill radius (100px), small colored dot + label, used for the ads-section channel chips (Google Search / Meta / Retargeting / Conversion tracking) and testimonial metric pills. Background is a low-opacity neutral, text/dot carry the channel's identity color.
- **State:** hover lifts slightly (`translateY(-3px)`) and brightens the background — chips are interactive-feeling even where they're not links.

### Cards / Containers
- **Corner Style:** 16px for standard cards (service, work), 18–20px for feature-weight cards (pricing, bento, testimonial, contact).
- **Background:** `--card` (opaque) for standard cards; `--card-glass` (translucent + blur) reserved for the nav only.
- **Shadow Strategy:** ambient at rest, deepened + lifted on hover — see Elevation.
- **Border:** 1px `--border` at rest; the featured pricing plan replaces the border and background with solid Sprout Green instead of a border treatment.
- **Internal Padding:** 26–40px depending on card weight, fluid via `clamp()` on the larger cards.

### Inputs / Fields
- **Style:** `--canvas` background (not `--card` — inputs sit visually "recessed" relative to the card that holds them), 1.5px `--border`, 12px radius, `13px 16px` padding, 48px min-height.
- **Focus:** border shifts to Sprout Green plus a 3px Sprout-Green glow ring (`box-shadow: 0 0 0 3px oklch(0.6 0.15 150 / 0.18)`) — no default browser outline.
- **Error / Disabled:** invalid fields swap the border/glow to a red-orange OKLCH pair and reveal a `.field-error` message; there is no distinct disabled treatment defined yet.

### Navigation
- Glass panel (`--card-glass` + 14px backdrop blur), sticky with a 12px offset from the viewport top, 16px radius, ambient nav shadow.
- Links are Ink Soft at rest, an animated underline (`::after`, 2px, Sprout Green) grows to full width on hover/active, and text color shifts to Link Hover.
- Mobile collapses to a full-width dropdown panel below the nav bar; the hamburger animates into an X via rotated spans, and mobile nav links get a filled Sprout-Green-Soft background on hover/active instead of the underline (underline doesn't work well at full-width touch size).

### Signature Component: Bento Results Grid
A 4-column, named-area CSS Grid mixing a large hero stat tile (ROAS, with its own gradient background and sparkline SVG) with two smaller stat tiles and a quote tile — the pattern used whenever the site needs to make several different data shapes (a huge number, a small number, a quote) feel like one coherent panel rather than a row of mismatched cards.

## Do's and Don'ts

### Do:
- **Do** keep Sprout Green (hue 150°) as the only color that carries brand/CTA meaning; reach for a green tint before introducing a new hue.
- **Do** author every shadow from `--shadow-tint` via `oklch(from var(--shadow-tint) l c h / alpha)`, never a flat black/gray shadow.
- **Do** give new cards a resting ambient shadow, not just a hover shadow — depth here is always-on, per the confirmed elevation philosophy.
- **Do** pair every section `<h2>` with an uppercase Label-style eyebrow above it (the Kicker-Before-Headline Rule).
- **Do** use full pill radius (100px) for any badge, chip, or metric pip — never the card radius scale.
- **Do** give new interactive elements a hover state that visibly lifts (`translateY`) and deepens its shadow or fill, matching the "confident and tactile" component character.
- **Do** author new color tokens as `light-dark(oklch(...), oklch(...))` pairs so dark mode stays a native, first-class state rather than a bolted-on override.

### Don't:
- **Don't** let Amber or Blue appear on a CTA, nav element, or primary stat — they're reserved strictly for testimonial-card variance and the Google-ads split card.
- **Don't** remove or flatten the resting shadows on cards, the nav, or the hero mockup in the name of a "flatter" aesthetic — always-on soft elevation was explicitly confirmed, not a default to erode.
- **Don't** mix true-gray neutrals into the palette — even Ink/Muted carry a faint green chroma (hue 150) rather than going hue-neutral.
- **Don't** treat the testimonials, work-grid case studies, or bento/funnel stats as real content when reusing these components elsewhere — see PRODUCT.md's Evidence on Hand; they're structurally real components with currently-placeholder data.
- **Don't** introduce a second display typeface; Bricolage Grotesque owns every heading and standalone number, Figtree owns everything else.
- **Don't** use Google Blue, Meta Purple, Retarget Green, or Conversion Gold anywhere but a channel chip's dot — they identify an external platform, not the brand, and must never appear on a CTA, background, or text color.
