# Repository Guidelines

VEIL is a local frontend for a private AI studio. Its independent visual concept is personal correspondence: paper, folded notes, and blue ink. Latens supplied the original product category; its visual system is not the design reference for the current direction. The project context lives in the personal project note identified as `Projects/veil`; resolve its vault location through Nicol's personal workflow. Keep plans, decisions, and validation summaries in that note.

## Structure

The application uses React, TypeScript, and Vite. `src/main.tsx` mounts the application; `src/App.tsx` owns hash navigation and the landing page. `src/components/Terminal.tsx` owns the workspace, `Docs.tsx` owns documentation and pricing, and `Wallet.tsx` owns the visual wallet selector. Rates live in `src/content/pricing.ts`; page motion lives in `src/hooks/`. Shared tokens are in `src/styles.css`. Serve production SVG/WebP media from `public/assets/` at `/assets/…`; keep original generations and metadata in `assets-src/`, references in `references/`, and real captures in `validation/`. Preserve unrelated projects.

## Commands

Run commands from this project root. `npm install` installs the lockfile dependencies. `npm run dev` serves the local frontend at `127.0.0.1:5186`; `npm run build` runs TypeScript checking and creates the static build in `dist/`; `npm run typecheck` checks types; `npm run preview` serves a built site locally at port 4173. Record actual command outcomes in the project note; do not claim checks that were not run.

## Conventions and Validation

All interface copy, metadata, errors, and accessibility labels must be English. Preserve warm paper `#f5f3ed`, blue ink `#283f83`, Instrument Serif display type, and Inter body text. Keep functional copy as markup; use purpose-made correspondence imagery and CSS/SVG details. Images require a verified estimate of at most 3 credits each before generation. Inspect desktop/mobile captures and relevant breakpoints. Exercise routes, docs search, pricing input validation, wallet selection, studio controls, keyboard focus, and modal cleanup. Support reduced motion. Latens pricing is a dated reference, not a live integration; verify its source before changing rates.

## Boundaries

This scope is frontend design only. Wallet selection is explicitly a visual, in-memory preference flow: no provider calls, RPC, signatures, addresses, login, or transactions. No inference API, payments, remote database, or fabricated assistant responses. Pricing estimates are local arithmetic. Do not show demo banners or implementation disclaimers in the product. No secrets or private customer data belong in source, assets, notes, or captures. Keep development and previews local. Do not publish, push, create a remote repository, or deploy without Nicol's subsequent destination and authorization.
