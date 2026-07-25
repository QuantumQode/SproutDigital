# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Solo founders and small business owners (e.g. tradespeople, local service businesses, small clinics/studios) who need an online presence and a way to generate leads from it, but don't have marketing staff or the budget for a full agency. They're evaluating whether to hire SproutDigital instead of a freelance web designer or a larger agency.

## Product Purpose

SproutDigital is a real, operating one-person agency (run by the site owner) that builds modern websites for small businesses and then runs Google Ads, Meta Ads, and SEO on top of them to turn traffic into paying customers. Success is a client who gets a site built and sees measurable leads/revenue from the paid campaigns and SEO work that follows.

## Positioning

One person handles the whole funnel — the same operator designs and builds the site AND plans/runs the ad campaigns and SEO, so there's no handoff between a web vendor and a marketing vendor. The website build itself is priced as a volume driver, not a profit center: it's deliberately cheap to get anyone with an idea in the door. The real business is the recurring ladder that follows — a mandatory hosting/care retainer from day one, then optional SEO and paid-ads tiers for clients who want to grow further. Revenue is tracked to leads/results rather than vanity metrics at every tier above the base build.

## Operating Context

Typical engagement: prospect requests a free audit → SproutDigital reviews their current site/rankings and proposes a plan → low-cost one-time site build (Launch), bundled automatically with a small recurring hosting/care retainer (Foundation) so the site keeps working after handoff → optional upsell into ongoing SEO (Growth) and/or paid-ads management (Scale) once the client is ready to invest in growth. Channels currently covered: Google Search Ads, Meta (Facebook & Instagram) Ads, retargeting, conversion tracking, and organic SEO.

## Capabilities and Constraints

- Solo operator (no team) — capacity constrains how many concurrent clients/campaigns can be run.
- Services: website design & build, Google Ads, Meta Ads, SEO, conversion tracking.
- Site is a static HTML/CSS/vanilla-JS build (no framework/build step), deployed to GitHub Pages at sproutdigital.tech (see CNAME).
- Contact form uses Web3Forms; the access key in `pages/contact.html` is still a placeholder (`YOUR_WEB3FORMS_ACCESS_KEY`) and must be replaced before the form can actually deliver submissions.
- Checkout uses Stripe Payment Links (no backend): each purchasable plan's `stripeLink` in `js/main.js` is still a placeholder (`STRIPE_LINK_PLACEHOLDER_*`) and must be replaced with real Stripe-generated URLs before payments work. Launch's link must bundle the one-time £200 build with the £29/mo Foundation subscription in one checkout; each link's after-payment redirect should point to `pages/thank-you.html?plan=<name>`. Upgrading a client from Foundation to Growth requires manually cancelling their Foundation subscription in Stripe — there is no automated plan-change flow.
- Undecided: exact ad-spend minimums, formal service-level guarantees, and whether website builds are ever bundled with ads/SEO into a single contract vs. sold separately.

## Brand Commitments

- Name: SproutDigital. Domain: sproutdigital.tech.
- Logo: a sprout/leaf mark (two curved leaf paths over a stem), used consistently in nav and footer.
- Contact email: hello@sproutdigital.tech.
- Typeface pairing: Bricolage Grotesque (display) + Figtree (body) — currently loaded via Google Fonts.
- Palette anchored in green (OKLCH-based greens) as the primary brand color.
- Social links (Instagram/Facebook/LinkedIn) currently point to generic platform homepages, not real profiles — placeholders, not a binding brand asset yet.

## Evidence on Hand

No real evidence exists yet — this is a new agency with no clients so far. Everything currently shown as proof is invented placeholder content, not fact, and must not be treated as real when referenced by future work:
- Testimonials (e.g. "James T. — NinjaPlumbers") are fabricated quotes.
- Client logos (GIAT LTD, NinjaPlumbers, DiyahAesthetics, ShineyPetGrooming) are fictional/placeholder names, not real clients.
- Stats (4.6x ROAS, +248% organic traffic, -38% cost per lead, 24h campaign launch, funnel numbers like "128k impressions / 6,400 clicks / 512 leads / 137 customers") are illustrative placeholder numbers, not measured results.
- Pricing is the real intended pricing, not placeholder, priced in GBP for a budget-conscious UK small-business audience: Launch (£200 one-time website build) with Foundation (£29/mo hosting, domain, security & basic SEO upkeep) bundled in automatically and not sold on its own, then optional Growth (£350/mo ongoing SEO & content) and Scale (£750/mo Google/Meta ads management) retainer tiers for clients ready to invest further.
- Future work must not invent new fake testimonials/logos/stats beyond what's already there, and should flag to the user when real evidence is needed to replace placeholders — not fabricate replacements.

## Product Principles

- Do the whole funnel yourself, credibly: every design/copy choice should support "one operator, full accountability," not imply a bigger team than exists.
- Price and promise for real small-business budgets, not enterprise marketing budgets.
- Track outcomes to revenue/leads, not vanity metrics — this is the stated differentiator and should stay true in any new proof, dashboards, or copy.
- Never let placeholder proof (testimonials, logos, stats) be mistaken for real evidence — keep it visually honest as illustrative until replaced with real client results.
