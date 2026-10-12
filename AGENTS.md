# Repository Guidelines

VEIL is a local frontend for a private AI studio. Its independent visual concept is personal correspondence: paper, folded notes, and blue ink. Latens supplied the original product category; its visual system is not the design reference for the current direction. The project context lives in the personal project note identified as `Projects/veil`; resolve its vault location through Nicol's personal workflow. Keep plans, decisions, and validation summaries in that note.

## Structure

The application uses React, TypeScript, and Vite. `src/main.tsx` mounts the application; `src/App.tsx` owns navigation and the landing page. `src/components/Terminal.tsx` and its companion stylesheet own the conversation workspace. Shared design tokens and landing layouts are in `src/styles.css`. Production vector assets are served from `public/assets/` at `/assets/…`. Keep design references in `references/` and real browser captures in `validation/`, outside served assets. Preserve the existing parent workspace and unrelated projects.

## Commands

Run commands from this project root. `npm install` installs the lockfile dependencies. `npm run dev` serves the local frontend at `127.0.0.1:5186`; `npm run build` runs TypeScript checking and creates the static build in `dist/`; `npm run typecheck` checks types; `npm run preview` serves a built site locally at port 4173. Record actual command outcomes in the project note; do not claim checks that were not run.

## Conventions and Validation

All user-facing interface copy, metadata, validation, and accessibility labels must be English. Use semantic landmarks, accessible button names, visible keyboard focus, readable contrast, responsive layouts, and reduced-motion support. Follow warm paper `#f5f3ed`, blue ink `#283f83`, Instrument Serif display type, and Inter body text. Use folded-letter and notebook illustrations in CSS/SVG; preserve functional text as markup. Do not introduce arbitrary stock imagery. Inspect desktop, mobile, and relevant intermediate widths and exercise navigation, starting-point cards, studio controls, and keyboard behavior.

## Boundaries

This scope is frontend design only: no inference API, authentication, payments, wallet integration, remote database, or fabricated assistant responses. Interface interactions may change local UI state. Do not show demo banners or implementation disclaimers in the product. No secrets or private customer data belong in source, assets, notes, or captures. Keep development, builds, and previews local. Do not publish, push, create a remote repository, or deploy without Nicol's subsequent destination and authorization.
