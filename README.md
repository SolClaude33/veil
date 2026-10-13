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

Six correspondence images were generated through Higgsfield with GPT Image 2.5, each preflighted at 2.75 credits (16.5 credits total estimated): three editorial still-lifes and three transparent animation layers (envelope front, flap, and blue note). Served WebPs are in `public/assets/`; original PNGs, prompts, references, job IDs, and estimates are in `assets-src/asset-manifest.json`. Actual charged credits were not returned. Docs/Pricing retain their editorial images; the original envelope photograph supplies the static section fallback.

The same layered envelope travels across the landing page: it opens in the sticky hero, settles beside the privacy copy, accompanies the notebook/model sections, moves to the questions, and closes at the final invitation. `EnvelopeArtwork.tsx` composes photographic layers with HTML text and the vector seal. `useCorrespondenceJourney.ts` interpolates reserved `JourneyAnchor` positions using passive listeners and requestAnimationFrame, without an animation library. Mobile follows visible reserved frames and fades between them; reduced motion uses static artwork and removes the extended hero scroll. Listeners, observers, and frames are disposed when leaving the page. The custom vector wordmark and folded V symbol are shared through `Brand.tsx`.

Concept references are in `references/private-correspondence.svg` and `references/correspondence-scroll.svg`. Modal interfaces support keyboard focus and Escape. Browser evidence is in `validation/`; its responsive iframe helper is excluded from the production build.
