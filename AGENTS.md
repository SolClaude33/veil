# Repository Guidelines

VEIL is a frontend for a private AI studio. Its v8 correspondence theatre uses a concise blue opening, warm paper, chapter-specific still lifes, and editorial reading. Latens supplied the product category, not the visual system. Project context lives in `Projects/veil`; keep decisions and validation summaries there.

## Structure

The application uses React, TypeScript, and Vite. `src/App.tsx` owns routing and landing composition. Components contain Studio, Docs/Pricing, Wallet, Brand, and correspondence artwork. `StudioShowcase.tsx` passes its model and prompt into Studio; Core and Reason have visible accessible descriptions. `LetterStory.tsx`, `JourneyAnchor.tsx`, and `src/hooks/useCorrespondenceJourney.ts` direct the layered letter in the 210svh desktop/190svh mobile hero and closing. `SectionArtwork.tsx` renders Privacy, Possibilities, and Models art; Possibilities is centered and panoramic above its notebooks. Rates live in `src/content/pricing.ts`; tokens live in `src/styles.css`. Serve media from `public/assets/`; keep sources in `assets-src/`, references in `references/`, and captures in `validation/`.

## Commands

Run commands from the project root. `npm install` installs locked dependencies. `npm run dev` serves at `127.0.0.1:5186`; `npm run build` runs TypeScript and creates `dist/`; `npm run typecheck` checks types; `npm run preview` serves the build at port 4173. Record actual outcomes in the project note.

## Conventions and Validation

All interface copy, metadata, errors, and accessibility labels must be English. Preserve paper `#f5f3ed`, ink `#283f83`, Instrument Serif, and Inter. Open studio is the primary landing action; Wallet stays secondary and becomes an icon on mobile. Keep functional text in markup. Images require a verified estimate no higher than 3 credits each. The nine existing images total 24.75 estimated credits; charges are unknown, and v8 generated none. Inspect desktop, mobile, short viewports, crop, and breakpoints. Exercise routes, Docs search, pricing validation, wallet selection, model hints and transfer, keyboard focus, modal cleanup, and theatre scroll. Preserve reduced motion and cleanup. Verify dated Latens rates before changing pricing.

## Boundaries

This is frontend design only. Wallet selection is a visual, in-memory preference: no provider calls, RPC, signatures, addresses, login, or transactions. No inference API, payments, remote database, or fabricated assistant responses. Pricing estimates use local arithmetic. Do not show demo banners or implementation disclaimers. Keep secrets and private customer data out of source, assets, notes, and captures. Keep work local; do not publish, push, create a remote, or deploy without Nicol's later authorization and destination.
