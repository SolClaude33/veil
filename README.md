# VEIL

A local React and TypeScript frontend with a landing page, private conversation studio, searchable documentation, and pricing. Its visual identity is personal correspondence: warm paper, blue ink, editorial typography, folded envelopes, and notebook pages.

## Local development

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5186`.

- `/#/studio`: conversation workspace; `/#/terminal` remains supported.
- `/#/docs/overview`: documentation, with getting-started, models, credits, privacy, and wallet topics.
- `/#/pricing`: model rates, usage explanations, and a local cost estimator.

## Validation and build

```sh
npm run typecheck
npm run build
npm run preview
```

`dist/` contains the static build. Fonts, the brand SVG, and generated WebP images are local. No authentication, payment services, wallet providers, or inference APIs are required.

The interface includes responsive navigation, notebook starting points, model selection, expandable questions, conversation composition, session history, and studio settings. Wallet selection offers MetaMask, Rabby, and WalletConnect choices with confirmation, change, and disconnect states; it is a visual preference shared across pages, without real connection or login. Conversation and wallet state stay in memory; assistant responses are not fabricated.

Rates in `src/content/pricing.ts` use [Latens documentation](https://docs.latens.si/docs/pricing), verified October 12, 2026: Core references Small ($0.765 input / $1.275 output per million tokens), and Reason references Large ($1.275 / $2.295). The estimator includes input context and output/reasoning tokens and accepts non-negative safe integers. No credit purchase or billing is implemented.

Three correspondence still-lifes were generated through Higgsfield with GPT Image 2.5, each preflighted at 2.75 credits. Served files are in `public/assets/`; originals, prompts, references, and job IDs are in `assets-src/asset-manifest.json`. The concept sketch is in `references/private-correspondence.svg`. Finite entrance and scroll reveals respect reduced-motion preferences, and modal interfaces support keyboard focus and Escape. Browser evidence is in `validation/`.
