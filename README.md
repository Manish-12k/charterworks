# Charterworks

A production-ready business registration & compliance platform — Next.js
(App Router) + Supabase (Postgres, auth, RLS) + Razorpay (payments) +
Resend (transactional email). Everything below can be run on free tiers.

## What's real vs. what's placeholder

**Real and working once you add your own keys:**
- Every page listed in the nav is a real route (no dead links)
- Services, consultants, testimonials are read from your Supabase database
- Login is real Supabase auth (email one-time-code, genuinely free — no SMS cost)
- Bookings write real rows to Postgres with Row Level Security
- Payments go through Razorpay's real order-creation + signature-verification flow
  (in **test mode** until you switch to live keys)
- Booking confirmations trigger real emails via Resend, to both the client and your team

**Still placeholder — replace before taking real money:**
- Company name, address, phone number, logo (currently invented demo values)
- Privacy Policy / Terms pages (currently generic filler — get these reviewed)
- Consultant/vendor assignment (`profiles.consultant_id`) — currently set manually
  in the Supabase table editor; a real product would have an admin UI for this

---

## 1. Create your Supabase project (free)

1. Go to [supabase.com](https://supabase.com) → New Project. Pick any region close to your users.
2. Once it's created, open **SQL Editor** → **New query**, paste the entire contents of
   `supabase/schema.sql` from this repo, and run it. This creates every table, security
   policy, and seed data (services/consultants/testimonials) in one shot.
3. Go to **Project Settings → API**. You'll need three values in a moment:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this one secret — never
     put it in anything client-side)
4. Go to **Authentication → Providers → Email** and make sure Email is enabled with
   "Confirm email" and OTP sign-in on (this is on by default). No SMS provider needed —
   this app deliberately uses email codes so verification stays free.

**Free tier limits worth knowing:** 500MB database, 50,000 monthly active users,
unlimited API requests — comfortably enough for a new business site. The one gotcha:
a free project **pauses after 7 days of zero API traffic**. Step 5 below fixes that
for free with a scheduled GitHub Action, so don't skip it if you want this genuinely
always-on.

## 2. Create your Razorpay account (free)

1. Sign up at [razorpay.com](https://dashboard.razorpay.com/signup) — no cost, no
   monthly fee. You only ever pay when a real transaction succeeds (~2% + GST — that's
   standard across every payment gateway, not a Razorpay-specific cost).
2. Dashboard → **Settings → API Keys → Generate Test Key**. Use these first — test
   mode processes fake card numbers and charges nothing.
3. You'll get a `Key Id` and `Key Secret`:
   - `Key Id` → both `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `Key Secret` → `RAZORPAY_KEY_SECRET`
4. When you're ready to accept real payments, complete Razorpay's KYC/activation
   flow, generate **live** keys, and swap them in — same code, no changes needed.

## 3. Create your Resend account (free — for booking emails)

1. Sign up at [resend.com](https://resend.com) (100 emails/day free, no card needed).
2. Create an API key → `RESEND_API_KEY`.
3. For `NOTIFY_EMAIL_FROM`, you can use Resend's shared testing address
   (`onboarding@resend.dev`) immediately, or verify your own domain later for a
   branded sender.
4. Set `NOTIFY_EMAIL_TO` to the inbox that should get new-booking alerts.

## 4. Run it locally (optional, but good to check first)

```bash
npm install
cp .env.example .env.local   # then fill in the real values from steps 1–3
npm run dev
```

Open `http://localhost:3000`. Try booking a free consultation end-to-end, then try
a paid service with Razorpay's test card `4111 1111 1111 1111`, any future expiry,
any CVV, and OTP `1234` if prompted.

## 5. Deploy to Vercel (free)

1. Push this project to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) → import that repo. Vercel
   auto-detects Next.js — no config needed.
3. Before the first deploy, add every variable from `.env.example` under
   **Project Settings → Environment Variables** (use your real values, not the
   placeholders). Set `NEXT_PUBLIC_SITE_URL` to your actual Vercel URL
   (e.g. `https://charterworks.vercel.app`) — or your custom domain if you attach one.
4. Deploy. Vercel's free Hobby tier covers this comfortably: 100GB bandwidth/month,
   unlimited serverless function invocations for personal/small business use.

### Keep the free Supabase project from pausing

1. In your GitHub repo → **Settings → Secrets and variables → Actions**, add:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_ANON_KEY` = your Supabase anon key
2. That's it — `.github/workflows/keep-alive.yml` is already in this repo and will
   ping your database every 3 days automatically, for free, forever.

## 6. Set up your first vendor / consultant account

Vendor accounts aren't self-serve yet (a real admin panel is a natural next step,
not built here). To link one manually:

1. Have the person sign in once at `/login` with their email — this creates their
   `profiles` row automatically.
2. In Supabase → **Table Editor → profiles**, find their row and set:
   - `role` → `vendor`
   - `consultant_id` → the matching row's id from the `consultants` table
3. They can now see their assigned cases at `/vendor`.

## Performance notes

- Services, consultants, and testimonials are fetched server-side and cached for
  5 minutes (`revalidate = 300`) — most visitors never hit the database directly.
- Fonts load via `next/font`, self-hosted and subset automatically — no extra
  round-trip to Google Fonts at request time.
- The chat widget and booking form are the only client-heavy code, and both are
  scoped to their own components so the rest of the site ships minimal JS.
- Static assets are cached for a year via the headers in `next.config.mjs`.

## Project structure

```
app/                  routes (App Router — each folder is a URL)
  api/                server-only endpoints (Razorpay, booking confirmation)
components/           shared UI
lib/                  Supabase clients, formatting helpers, email sending
supabase/schema.sql   full database schema + seed data — run this once
.github/workflows/    the free Supabase keep-alive cron
```
