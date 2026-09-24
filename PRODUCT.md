# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Solo founders and small business owners (e.g. tradespeople, local service businesses, small clinics/studios) who need an online presence and a way to generate leads from it, but don't have marketing staff or the budget for a full agency. They're evaluating whether to hire SproutDigital instead of a freelance web designer or a larger agency.

## Product Purpose

SproutDigital is a real, operating one-person agency (run by the site owner) that builds modern websites for small businesses and then runs Google Ads, Meta Ads, and SEO on top of them to turn traffic into paying customers. Success is a client who gets a site built and sees measurable leads/revenue from the paid campaigns and SEO work that follows.

## Positioning

One person handles the whole funnel — the same operator designs and builds the site AND plans/runs the ad campaigns and SEO, so there's no handoff between a web vendor and a marketing vendor. The website build is the main source of upfront revenue: it's priced well below freelancer and agency rates so it's still an easy yes for a small business, but high enough to be profitable on its own rather than a loss leader. A mandatory hosting/care retainer (6-month minimum) follows from day one, then optional SEO and paid-ads tiers for clients who want to grow further. Retainers are low-effort once set up (SEO is largely automated), so they add steady recurring income on top of the build. Revenue is tracked to leads/results rather than vanity metrics at every tier above the base build.

## Operating Context

Typical engagement: prospect requests a free audit → SproutDigital reviews their current site/rankings and proposes a plan → one-time site build (Launch), bundled automatically with a recurring hosting/care retainer (Foundation, 6-month minimum) so the site keeps working after handoff → optional upsell into one growth channel, SEO or paid ads (Growth), or both together plus CRO (Scale), once the client is ready to invest in growth. Channels currently covered: Google Search Ads, Meta (Facebook & Instagram) Ads, retargeting, conversion tracking, and organic SEO. Clients who already have a website can skip Launch and start directly on Growth or Scale, which then work on their current site (hosting & care is included only when SproutDigital hosts it). The pricing page presents this as a two-step path (Step 1: Launch + Foundation; Step 2: Growth/Scale) with "talk first" CTAs, since every plan button leads to a free call rather than a checkout; Growth carries a "Recommended" badge rather than an unverifiable "Most popular".

## Capabilities and Constraints

- Solo operator (no team) — capacity constrains how many concurrent clients/campaigns can be run.
- Services: website design & build, Google Ads, Meta Ads, SEO, conversion tracking.
- Site is a static HTML/CSS/vanilla-JS build (no framework/build step), deployed to GitHub Pages at sproutdigital.tech (see CNAME).
- Contact form uses Web3Forms; the access key in `contact/index.html` is still a placeholder (`YOUR_WEB3FORMS_ACCESS_KEY`) and must be replaced before the form can actually deliver submissions.
- Checkout is planned to use Stripe Payment Links (no backend) but isn't wired up yet: pricing CTAs currently link to `/contact/?plan=<name>`. Launch is paid per the client contract (`business/`, gitignored): a 50% deposit (£249.50) on signing and 50% before go-live, with the £49/mo Foundation subscription starting at go-live — so Launch can't be one bundled checkout; use separate deposit/balance payments or invoices. Subscription links' after-payment redirect should point to `/thank-you/?plan=<name>`. Upgrading a client from Foundation to Growth or Scale requires manually cancelling their Foundation subscription in Stripe — there is no automated plan-change flow. Stripe won't enforce Foundation's 6-month minimum on its own; it has to be in the client's written terms and handled manually if someone cancels early.
- Undecided: exact ad-spend minimums, formal service-level guarantees, and whether website builds are ever bundled with ads/SEO into a single contract vs. sold separately.

## Brand Commitments

- Name: SproutDigital. Domain: sproutdigital.tech.
- Logo: a sprout/leaf mark (two curved leaf paths over a stem), used consistently in nav and footer.
- Contact email: hello@sproutdigital.tech.
- Typeface pairing: Bricolage Grotesque (display) + Figtree (body) — currently loaded via Google Fonts.
- Palette anchored in green (OKLCH-based greens) as the primary brand color.
- Social links (Instagram/Facebook/LinkedIn) currently point to generic platform homepages, not real profiles — placeholders, not a binding brand asset yet.

## Evidence on Hand

No real evidence is on the site yet — this is a new agency with early clients, and none of their results are shown. Everything currently shown as proof is invented placeholder content, not fact, and must not be treated as real when referenced by future work:
- Testimonials (e.g. "James T. — NinjaPlumbers") are fabricated quotes.
- Client logos (GIAT LTD, NinjaPlumbers, DiyahAesthetics, ShineyPetGrooming) are fictional/placeholder names, not real clients.
- Stats (4.6x ROAS, +248% organic traffic, -38% cost per lead, 24h campaign launch, funnel numbers like "128k impressions / 6,400 clicks / 512 leads / 137 customers") are illustrative placeholder numbers, not measured results.
- Pricing is the real intended pricing, not placeholder, priced in GBP for a UK small-business audience (raised in September 2026 after early clients said it was too cheap): Launch (£499 one-time website build) with Foundation (£49/mo hosting, domain, security & basic SEO upkeep; 6-month minimum from launch, then rolling monthly) bundled in automatically and not sold on its own, then optional rolling-monthly retainers for clients ready to invest further: Growth (£249/mo, one growth channel: ongoing SEO & content or Google/Meta ads management) and Scale (£449/mo, SEO and Google/Meta ads together, plus CRO testing and a monthly strategy call). Ad spend is always paid directly to Google/Meta on top of the plan.
- Future work must not invent new fake testimonials/logos/stats beyond what's already there, and should flag to the user when real evidence is needed to replace placeholders — not fabricate replacements.

## Product Principles

- Do the whole funnel yourself, credibly: every design/copy choice should support "one operator, full accountability," not imply a bigger team than exists.
- Price and promise for real small-business budgets, not enterprise marketing budgets.
- Track outcomes to revenue/leads, not vanity metrics — this is the stated differentiator and should stay true in any new proof, dashboards, or copy.
- Never let placeholder proof (testimonials, logos, stats) be mistaken for real evidence — keep it visually honest as illustrative until replaced with real client results.
