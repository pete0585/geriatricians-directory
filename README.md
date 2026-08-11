# GeriatricianDirectory.com

The most complete directory of board-certified geriatricians in the US. Built on Next.js 15 + Supabase.

**Domain:** geriatriciandirectory.com  
**Revenue model:** $99/yr Verified, $199/yr Featured  
**GitHub repo:** pete0585/geriatricians-directory  
**Vercel project:** prj_OPExx3RL2s81eaoR8aq5BzYVXnL1

---

## Tech Stack

- **Framework:** Next.js 15.3.9 (App Router, TypeScript strict mode)
- **Styling:** Tailwind CSS (custom navy/sage/gold palette)
- **Database/Auth:** Supabase (`fbuqrnzofktepkzyfmhy`, `geriatrician_` prefixed tables)
- **Payments:** Stripe ($99/yr Verified, $199/yr Featured)
- **Email:** Resend (`mail.geriatriciandirectory.com`)
- **Deployment:** Vercel (auto-deploy from GitHub main)

---

## Local Development

### Prerequisites
- Node.js 20+
- npm

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/pete0585/geriatricians-directory.git
   cd geriatricians-directory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in `.env.local` with your credentials (get from Vercel dashboard or vault).

5. Run development server:
   ```bash
   npm run dev
   ```

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `NEXT_PUBLIC_SITE_URL` | Full site URL (e.g. https://geriatriciandirectory.com) |
| `NEXT_PUBLIC_DIRECTORY_SLUG` | `geriatricians` |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_VERIFIED_PRICE_ID` | Stripe price ID for Verified tier ($99/yr) |
| `STRIPE_FEATURED_PRICE_ID` | Stripe price ID for Featured tier ($199/yr) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | `hello@mail.geriatriciandirectory.com` |
| `ADMIN_EMAIL` | Admin user email for admin panel access |
| `INBOUND_WEBHOOK_SECRET` | Resend inbound webhook secret |

All variables are pre-configured in Vercel by the bootstrap agent.

---

## Database Setup

The Supabase schema is defined in `supabase/migrations/001_initial_schema.sql`.

Tables:
- `geriatrician_listings` — main listings table
- `geriatrician_claims` — claim verification tokens
- `geriatrician_payments` — Stripe payment records
- `geriatrician_inquiries` — family inquiry form submissions (month 6+ feature)

The bootstrap agent applied this migration via MCP. To re-apply manually, run the SQL in the Supabase SQL Editor at https://supabase.com/dashboard/project/fbuqrnzofktepkzyfmhy/sql/new.

---

## Data Seeding

### Quick start (10 sample listings):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://fbuqrnzofktepkzyfmhy.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service-key> \
npx ts-node scripts/seed.ts
```

### Full seed from NPI registry (~7,000 geriatricians):
The `data-seeder` agent handles this. Trigger with:
```
data-seeder geriatricians
```

The NPI bulk download is free from https://npiregistry.cms.hhs.gov — filter by taxonomy `207QG0300X` (Geriatric Medicine).

---

## Deployment

Deployment is automatic via Vercel — push to `main` triggers a production deploy.

**Stripe webhook endpoint:**  
`https://www.geriatriciandirectory.com/api/webhooks/stripe`

**Resend inbound email webhook:**  
`https://www.geriatriciandirectory.com/api/inbound-email`

Note: Always use `www.geriatriciandirectory.com` for webhooks — non-www redirects 307 and Resend/Stripe don't follow redirects.

---

## Revenue Model

| Tier | Price | Features |
|---|---|---|
| Free | $0 | Auto-seeded from NPI registry. Name, city, state, NPI visible. Contact info hidden. |
| Verified | $99/yr | Full profile: photo, bio, subspecialties, contact info visible, ABIM badge, priority placement |
| Featured | $199/yr | Everything in Verified + pinned first in city results, Featured badge, dedicated SEO page, monthly inquiry report |

**Stripe price IDs:**
- Verified: `price_1U3KxOGzK9Siblue5fmFmBBY`
- Featured: `price_1U3KxPGzK9SiblueOIi8zXAF`

---

## Admin Panel

Visit `/admin` — protected by Supabase magic link auth.

Set `ADMIN_EMAIL` env var to restrict access to a single admin email.

Features:
- Approve/reject submitted listings
- View paid conversion stats
- Browse all listings

---

## SEO Architecture

- City browse: `/listings?state=FL&city=Miami`
- Category pages: `/categories/memory-care`, `/categories/fall-prevention`, etc.
- Individual listing: `/listings/dr-jane-smith-miami-fl`
- Sitemap: `/sitemap.xml`
- JSON-LD structured data (Physician schema) on every listing page

---

## Cross-Links

- ElderLawyerDirectory.com — same family, different need (Medicaid planning after dementia diagnosis)
- findvaattorney.com — VA benefits for older veterans
