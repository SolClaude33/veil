# VEIL

A local React and TypeScript frontend with a landing page, private conversation studio, searchable documentation, and pricing. Its visual identity is personal correspondence: warm paper, blue ink, editorial typography, folded envelopes, and notebook pages. The v6 landing opens as a blue correspondence theatre, then returns to a quiet paper reading experience.

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

The interface includes responsive navigation, notebook starting points, model selection, expandable questions, conversation composition, session history, and studio settings. `StudioShowcase.tsx` is a functional preview of the workspace: choosing Core or Reason and editing its prompt transfers both values into Studio. Wallet selection offers MetaMask, Rabby, and WalletConnect choices with confirmation, change, and disconnect states; it is a visual preference shared across pages, without real connection or login. Conversation and wallet state stay in memory; assistant responses are not fabricated.

Rates in `src/content/pricing.ts` use [Latens documentation](https://docs.latens.si/docs/pricing), verified October 12, 2026: Core references Small ($0.765 input / $1.275 output per million tokens), and Reason references Large ($1.275 / $2.295). The estimator includes input context and output/reasoning tokens and accepts non-negative safe integers. No credit purchase or billing is implemented.

The v6 design reuses the six existing correspondence images; no media was generated for this revision. Those assets were originally generated through Higgsfield with GPT Image 2.5, each preflighted at 2.75 credits (16.5 credits total estimated): three editorial still-lifes and three transparent animation layers (envelope front, flap, and blue note). Served WebPs are in `public/assets/`; original PNGs, prompts, references, job IDs, and estimates are in `assets-src/asset-manifest.json`. Actual charged credits were not returned. Docs/Pricing retain their editorial images; the original envelope photograph supplies static scene fallbacks.

The layered envelope opens inside the sticky blue hero through independent seal, flap, and note channels. After the hero it is docked to the nearest visible `JourneyAnchor`: it fades out, snaps invisibly to the next scene, and fades back in instead of flying across the document. The letter remains open through the intermediate chapters and closes once at the final invitation. `EnvelopeArtwork.tsx` combines the photographic layers with HTML text and the vector seal; `useCorrespondenceJourney.ts` directs native-scroll progress with passive listeners and a settling `requestAnimationFrame` loop. Mobile uses the same docked scenes without crossing content. Reduced motion removes the extended scroll and shows static correspondence artwork. Listeners, observers, and frames are disposed when leaving the page.

Concept references are in `references/private-correspondence.svg`, `references/correspondence-scroll.svg`, and the v6 direction `references/correspondence-theatre.svg`. The custom wordmark and folded V symbol are shared through `Brand.tsx`. Modal interfaces support keyboard focus and Escape. Browser evidence is in `validation/`; its responsive iframe helper is excluded from the production build.
