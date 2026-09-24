---
target: pricing page (desktop and mobile)
total_score: 22
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 3
target_identity: "file:/Users/pouria/Projects/SproutDigital/pricing/index.html"
target_fingerprint: "sha256:e620ee8d2f711925c13ba4eaeeb763be10ca029e947ecca26a47b56b7d8dc5ad"
target_path: /Users/pouria/Projects/SproutDigital/pricing/index.html
timestamp: 2026-09-24T11-13-53Z
slug: pricing-index-html
---
Method: dual-agent (A: design review sub-agent · B: detector + browser sub-agent)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Tabs/nav clear; nothing says what follows "Get started" |
| 2 | Match System / Real World | 2 | "Get started — £249" implies checkout, opens contact form; ladder shown as parallel tiers |
| 3 | User Control and Freedom | 3 | Rolling terms, audit fallback, easy tab switching |
| 4 | Consistency and Standards | 2 | Duplicate "Not sure which plan fits?", repeated ad-spend note, POPULAR + MOST POPULAR together |
| 5 | Error Prevention | 2 | True cost scattered: mobile tab "£499 one-time" hides +£49/mo; no £793 first-6-months total |
| 6 | Recognition Rather Than Recall | 2 | Mobile Scale says "Everything in Growth" with Growth hidden |
| 7 | Flexibility and Efficiency | n/a | Single-decision marketing page |
| 8 | Aesthetic and Minimalist Design | 3 | 7 audit CTAs (8 mobile) vs 3 buy CTAs |
| 9 | Error Recovery | 3 | Wrong plan is reversible |
| 10 | Help and Documentation | 2 | FAQ 3/5 about ads; nothing on build timeline, deposit, revisions, ownership |
| Total | | 22/36 (61%) | Acceptable |

## Design Specificity Verdict
On-brand surface, stock SaaS pricing structure (generic hero, 3 equal cards + highlighted middle, checklists, FAQ, "Not sure?"). Foundation strip is the only product-specific move. One-operator accountability differentiator absent. Detector: 54 CLI findings / 26 desktop, 28 mobile in browser; real = green-card contrast (16); 13 contrast FPs (light-dark()/blob backgrounds), marquee FP; browser-only: 9px mobile "Popular" tab label; kicker flags conflict with DESIGN.md's kicker rule (brief wins).

## Priority Issues
- [P0] Stale cached CSS paired with new HTML → unstyled strip, giant icons. Fixed (asset ?v= versioning, SVG width/height, test, CLAUDE.md rule), uncommitted. /impeccable harden
- [P1] Ladder (Launch → Foundation → Growth/Scale) presented as three parallel tiers; unclear whether existing-site owners can buy Growth directly. Fix: Step 1 Launch+Foundation, Step 2 Growth/Scale. /impeccable shape → layout
- [P1] "No long contracts" (hero, meta, OG) contradicts 6-month minimum; true cost scattered. Fix: honest lede, "£499 + £49/mo" tab, "First 6 months: £793". /impeccable clarify
- [P1] Featured Growth card contrast 3.7:1 / 3.1:1 (dark 2.9 / 2.5); green focus ring invisible on green card; site-wide white-on-green buttons 3.7:1. /impeccable harden → colorize
- [P2] "Get started" leads to contact form; per-card audit links pre-select plan; 7–8 audit CTAs; mobile sticky audit bar outshouts plan CTA. /impeccable distill + clarify

## Persona Red Flags
Jordan: needs Launch AND Growth? "Hosting & care included" of what? Audit with no site? "Conversion rate testing" jargon.
Riley: "No long contracts" vs 6-month min; mobile tab hides £294; SEO wording mismatch; unverifiable "Most popular".
Casey: sticky audit bar outshouts Get started; tabs not sticky; 353px Foundation strip; decorative bubble behind Scale tab.

## Minor Observations
Price rows misaligned (572/590/554px); CTAs start at y=884 just below 1440x900 fold; plan names not headings; 768px single tall column; small tap targets (What's included, Not sure yet?) 16–18px; FAQ lacks build/deposit/revisions.

## Questions to Consider
Why is Growth the hero if everyone starts with Launch? One honest "Book a 15-minute call with me" instead of pretend checkout? Sell the one accountable person, face and name by the price?
