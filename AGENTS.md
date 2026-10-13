# Repository Guidelines

VEIL is a frontend for a private AI studio. Its v6 concept is a correspondence theatre: a blue opening stage gives way to warm paper, folded notes, and editorial reading. Latens supplied the product category, not the visual system. Project context lives in the personal note `Projects/veil`; keep plans, decisions, and validation summaries there.

## Structure

The application uses React, TypeScript, and Vite. `src/App.tsx` owns routing and landing composition. Components contain Studio, Docs/Pricing, Wallet, Brand, and the correspondence artwork. `StudioShowcase.tsx` previews the workspace and passes its selected model and prompt into Studio. `LetterStory.tsx`, `JourneyAnchor.tsx`, and `src/hooks/useCorrespondenceJourney.ts` direct the hero and docked scene states: independent seal/flap/note channels, invisible fade-and-snap handoffs, an open middle journey, and one final close. Rates live in `src/content/pricing.ts`; shared tokens live in `src/styles.css`. Serve media from `public/assets/`; keep source generations in `assets-src/`, references—including `correspondence-theatre.svg`—in `references/`, and captures in `validation/`.

## Commands

Run commands from this project root. `npm install` installs the lockfile dependencies. `npm run dev` serves the local frontend at `127.0.0.1:5186`; `npm run build` runs TypeScript checking and creates the static build in `dist/`; `npm run typecheck` checks types; `npm run preview` serves a built site locally at port 4173. Record actual command outcomes in the project note; do not claim checks that were not run.

## Conventions and Validation

All interface copy, metadata, errors, and accessibility labels must be English. Preserve paper `#f5f3ed`, ink `#283f83`, Instrument Serif, and Inter. Keep functional text in markup. Images require a verified estimate of at most 3 credits each before generation; v6 reuses six existing assets and generated none. Inspect desktop, mobile, short viewports, and breakpoints. Exercise routes, Docs search, pricing validation, wallet selection, showcase-to-Studio transfer, keyboard focus, modal cleanup, and forward/reverse theatre scroll. Preserve the static reduced-motion path and dispose listeners, observers, and frames on unmount. Latens pricing is dated source material; verify it before changing rates.

## Boundaries

This scope is frontend design only. Wallet selection is explicitly a visual, in-memory preference flow: no provider calls, RPC, signatures, addresses, login, or transactions. No inference API, payments, remote database, or fabricated assistant responses. Pricing estimates are local arithmetic. Do not show demo banners or implementation disclaimers in the product. No secrets or private customer data belong in source, assets, notes, or captures. Keep development and previews local. Do not publish, push, create a remote repository, or deploy without Nicol's subsequent destination and authorization.
