# VeeIntellix M3 IT Solutions

Public business profile and portfolio website for VeeIntellix M3 IT Solutions. The site introduces services, shows verified live project pages, and offers a rule-based project planning estimate with editable email and WhatsApp enquiry handoff. Browsing and estimating do not require an account.

## Local development

```sh
npm install
npm run dev
```

The Vite site runs on port `8080`. To exercise the server-side email endpoint locally, install the Vercel CLI and use `vercel dev` so `/api/project-enquiry` is served as a function.

## Scripts

```sh
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm run test
npm run format
```

## Email delivery and environment

Email submissions are handled by the Vercel function at `api/project-enquiry.ts`. It validates required fields, applies a per-instance best-effort rate limit, and sends plain-text email through Resend. Enquiries are not written to Supabase or another public table.

Set these **server-side Vercel environment variables** for Preview and Production:

| Variable            | Purpose                                                              |
| ------------------- | -------------------------------------------------------------------- |
| `RESEND_API_KEY`    | Resend API key. Keep this server-side; never prefix it with `VITE_`. |
| `RESEND_FROM_EMAIL` | Sender address on a domain verified with Resend.                     |
| `ENQUIRY_TO_EMAIL`  | Optional destination; defaults to `veerambaufx@gmail.com`.           |

WhatsApp handoff uses `+36705686763` and opens a prefilled draft for the visitor to review and send. It does not send automatically. If Resend is unavailable or unconfigured, the page keeps the brief visible and offers WhatsApp.

The current rate limiter uses memory local to a Vercel function instance. For stronger cross-instance abuse protection, configure a Vercel Firewall rule or replace it with a shared rate-limit store before a high-traffic launch. No email credentials are present in the frontend.

## Pricing review

Editable ZAR planning ranges and all feature adjustments are centralized in `src/lib/estimate.ts`. The values are draft assumptions for implementation and **require business-owner approval before public launch**. The estimator labels the output as indicative and excludes hosting, domains, third-party subscriptions, applicable taxes and ongoing maintenance from the project range.

## Portfolio evidence

Portfolio screenshots in `public/projects/` were captured from the live project URLs listed in `src/data/site.ts`. Descriptions are limited to visible project purpose and functionality; technology stacks and individual contribution claims are omitted where they could not be verified from public pages.

## Supabase retirement and security

The public site no longer initializes Supabase, creates accounts, reads profiles or writes quote records. A new migration, `supabase/migrations/20261026090000_lock_down_retired_quotes.sql`, revokes public access to the legacy quotes table while preserving historical rows. Apply it to the connected Supabase project before or during cutover.

The legacy `quote-ai` function source now returns HTTP 410. Remove the already deployed function from Supabase as part of cutover (`supabase functions delete quote-ai --project-ref <project-ref>`), since changing local source does not remove an already deployed remote function. Existing auth/profile tables are retained to avoid destructive deletion of account data; this website no longer uses them.

The provided Downloads copy did not include `.git`, so prior Git history and tracked-file status could not be audited. The old `.env` contained only obsolete Vite/Supabase client configuration and is no longer needed by this site; it was removed from the redesigned copy and `.env` files are now ignored. Check the connected Vercel and Supabase settings separately before cutover; no cloud settings were changed here.

## Deployment

Deploy the repository to Vercel. The included `vercel.json` rewrites public routes to the SPA entry point; the `/api` project enquiry route is served as a serverless function. Configure the Resend environment variables, apply the Supabase locking migration, remove the deployed legacy `quote-ai` function, then verify email delivery and all direct contact links on the deployed preview.

## Technology

- React, TypeScript, Vite, Tailwind CSS
- React Router, Lucide icons
- Vercel serverless function and Resend email API
