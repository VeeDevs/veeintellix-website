# VeeIntellix M3 IT Solutions

Public business profile and portfolio website for VeeIntellix M3 IT Solutions. The site introduces services, shows verified live project pages, and offers a rule-based project planning estimate with editable email and WhatsApp enquiry handoff. Browsing and estimating do not require an account.

## Local development

```sh
npm install
npm run dev
```

The Vite site runs on port `8080`. Enquiry forms hand off to the visitor’s email app through `mailto:` links.

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

## Email enquiries

The Contact and project estimate forms use `mailto:` links. They open the visitor's default email application with the VeeIntellix inbox, subject and message prefilled. The visitor reviews the draft and presses Send. The website does not send or store the enquiry, and it needs no email API, server credentials or provider account. If no email app is set up on the device, visitors can use the direct email link or copy the project brief.

WhatsApp handoff uses `+36705686763` and opens a prefilled draft for the visitor to review and send. It does not send automatically.

## Pricing review

Editable ZAR planning ranges and all feature adjustments are centralized in `src/lib/estimate.ts`. The values are draft assumptions for implementation and **require business-owner approval before public launch**. The estimator labels the output as indicative and excludes hosting, domains, third-party subscriptions, applicable taxes and ongoing maintenance from the project range.

## Portfolio evidence

Portfolio previews are stored in `public/projects/`. The Epoch and SpeakEasy Tutor cards use custom-designed showcase artwork; other project cards use captures from the live project URLs. Descriptions avoid unsupported technology-stack and contribution claims.

## Supabase retirement and security

The public site no longer initializes Supabase, creates accounts, reads profiles or writes quote records. A new migration, `supabase/migrations/20261026090000_lock_down_retired_quotes.sql`, revokes public access to the legacy quotes table while preserving historical rows. Apply it to the connected Supabase project before or during cutover.

The legacy `quote-ai` function source now returns HTTP 410. Remove the already deployed function from Supabase as part of cutover (`supabase functions delete quote-ai --project-ref <project-ref>`), since changing local source does not remove an already deployed remote function. Existing auth/profile tables are retained to avoid destructive deletion of account data; this website no longer uses them.

The provided Downloads copy did not include `.git`, so prior Git history and tracked-file status could not be audited. The old `.env` contained only obsolete Vite/Supabase client configuration and is no longer needed by this site; it was removed from the redesigned copy and `.env` files are now ignored. Check the connected Vercel and Supabase settings separately before cutover; no cloud settings were changed here.

## Deployment

Deploy the repository to Vercel. The included `vercel.json` rewrites public routes to the SPA entry point. No email provider or server-side email environment variables are required. Apply the Supabase locking migration and remove the deployed legacy `quote-ai` function, then verify the email-app handoff and direct contact links on the deployed site.

## Technology

- React, TypeScript, Vite, Tailwind CSS
- React Router, Lucide icons
- Vercel static hosting
