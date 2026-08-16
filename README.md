# My Nyumba Identity

You are the design lead at a boutique product studio. This client (My Nyumba,

a Kenyan property-management SaaS) rejected two previous designs for looking

like generic admin templates. They're paying for a distinctive visual

identity — not "clean and modern," a point of view.

BUILD SCOPE: Frontend UI/UX only. Mock data + local state. No backend, no

real auth, no payment integration, no live APIs.

═══════════════════════════════════════

STEP 1 — DESIGN PLAN (write this first, before any code)

═══════════════════════════════════════

Produce a compact design token system:

COLOR (name 5-6 exact hex values, not "emerald green"):

- Primary (CTAs, active nav, financial positives)

- Ink (primary text)

- Muted (secondary text)

- Surface (card background)

- Base (page background — NOT pure white, warm off-white or warm gray)

- Signal set: success / warning / danger / info

TYPE (name real typeface pairs, not Inter+Inter):

- Display face: characterful, used sparingly (page titles, big KPI numbers,

  hero moments) — think a serif or a distinctive grotesk with personality,

  e.g. Söhne, General Sans, Fraunces, GT Alpina, Newsreader — pick ONE that

  fits "Kenyan fintech trust," not a random pick

- Body face: a clean, highly-legible grotesk for tables/forms/UI chrome

- Numeric/data face: tabular-figures font for financial tables (this matters

  — KSh amounts must align in columns, use a font with proper tabular nums)

- Define a type scale: display-xl/lg/md, heading, body, caption — with

  explicit weights and letter-spacing, not "modern typography"

LAYOUT:

- Sidebar width, collapsed width, top-bar height — pick real px values

- Card system: border-radius value (pick ONE and use everywhere — sharp

  corners read as "serious fintech," heavy rounding reads as "consumer app."

  Choose deliberately for a property-management platform run by landlords)

- Border treatment: hairline borders vs shadows — pick a lane, don't mix both

  everywhere. Stripe/Linear use borders + minimal shadow, not drop-shadow soup.

SIGNATURE ELEMENT (the one thing this product is remembered by):

Pick ONE moment that will carry the brand identity — for example:

- A distinctive way rent-collection progress is visualized (not a generic

  donut chart — something specific to "money owed vs money in")

- A specific micro-interaction on the KPI cards when values update

- A distinctive empty-state illustration style used consistently

State what you picked and why it fits a Kenyan property-management context.

═══════════════════════════════════════

STEP 2 — SELF-CRITIQUE (do this before writing code)

═══════════════════════════════════════

Check your own plan against these failure modes and revise anything that

matches:

- Is the palette "deep emerald + white cards + charcoal text"? → too

  default, push it — consider warmer neutrals, a less-expected accent pairing

- Is the display font Inter, Poppins, or system-ui? → reject, pick something

  with actual character

- Are all cards using rounded-2xl + shadow-lg? → that's the generic

  AI-dashboard tell, pick a lane (sharp+bordered OR soft+shadowed, not both)

- Does the dashboard open with a generic 6-KPI-card grid and nothing else?

  → add the signature element as the actual hero, KPIs support it, not lead it

═══════════════════════════════════════

STEP 3 — MOTION CHOREOGRAPHY (be specific, not "subtle animations")

═══════════════════════════════════════

Define exact motion behavior, don't leave it vague:

- Page load: stagger KPI cards in (60-80ms delay each), fade+8px translateY,

  ease-out, ~300ms

- Sidebar collapse/expand: width transition 200ms cubic-bezier, icons

  fade-swap with labels, don't just clip text

- Number transitions: when a KPI value updates, count up/down rather than

  hard-swap (use a tween, ~500ms)

- Charts: bars/lines draw in on mount (stroke-dashoffset or width animation),

  not appear instantly

- Modals/drawers: slide+fade, backdrop fade separately and slightly slower

  than content, so it doesn't feel like one flat layer

- Table row actions (hover): reveal action icons with a quick fade, don't

  pop them in

- Toasts: slide in from top-right, auto-dismiss with a visible progress bar,

  swipe-to-dismiss on mobile

- Status badges: no animation — status should read instantly, don't make

  users wait on a pulse/glow to know if rent is overdue

- Respect prefers-reduced-motion: fall back to opacity-only transitions

Rule: ONE orchestrated moment (the page load stagger, or the signature

element's animation) should be the memorable one. Everything else should be

fast (150-250ms) and quiet. If in doubt, cut animation rather than add it —

excessive motion is what makes AI-generated dashboards feel AI-generated.

═══════════════════════════════════════

STEP 4 — BUILD, IN THIS ORDER

═══════════════════════════════════════

1. Design tokens as CSS variables / Tailwind config first

2. App shell (sidebar, top bar, responsive collapse) — get navigation right

   before any page content

3. Dashboard (this is the first impression — spend the most care here)

4. Properties → Property Detail (establish the card/table/tab patterns

   reused everywhere else)

5. Units, Tenants, Leases (reuse patterns from step 4, don't reinvent)

6. Rent & Payments (highest-stakes financial UI — tabular nums, crystal

   clear status, KSh formatting with proper thousand-separators, M-Pesa

   reference numbers that look real: format like "TFR3K9X2LM")

7. Maintenance, Expenses, Messages, Documents, Reports, Settings

8. Empty states, loading skeletons, error states — do these LAST as a pass

   across all pages, using one consistent system, not page-by-page

═══════════════════════════════════════

CONTENT REALISM

═══════════════════════════════════════

Use real-feeling Nairobi/Kenya data throughout, not placeholder text:

- Property names: e.g. "Kilimani Heights," "Riverside Court Apartments,"

  "Lavington Green Residences" — real Nairobi neighborhoods (Kilimani,

  Lavington, Westlands, Kileleshwa, Karen, South B, Ruaka)

- Tenant names: realistic Kenyan names, mixed

- Rent amounts: realistic for the area (Kilimani 1BR ≈ KSh 35-55k,

  Lavington 3BR ≈ KSh 120-180k — vary by property tier)

- M-Pesa references: realistic Daraja-style alphanumeric codes

- Dates, phone numbers (+254 7XX format) — all realistic

═══════════════════════════════════════

QUALITY BAR

═══════════════════════════════════════

This must read as a real commercial product a Nairobi property-management

company would pay for — not a dashboard template with green swapped in.

Before calling anything done: does the palette, type, and signature element

tell me this is specifically My Nyumba and not any other SaaS dashboard with

the labels changed? If you can't answer yes, revise Step 1 and rebuild.

[Then paste your full original feature spec below this line — Properties,

Units, Tenants, Rent & Payments, Maintenance, etc. — as the scope reference.

Keep it, it's good as a checklist, it just needed a design brief on top of it.]

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/44bef2ae-7c34-4dc5-b143-e67e4cbee213).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
