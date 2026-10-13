# VEIL

A local React and TypeScript frontend with a landing page, private conversation studio, searchable documentation, and pricing. Its visual identity is personal correspondence: warm paper, blue ink, editorial typography, folded envelopes, and notebook pages. The v7 landing opens as a blue correspondence theatre, then moves through a quiet paper reading experience with distinct still-life artwork for each major idea.

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

The site uses nine generated correspondence images. V7 adds three transparent still lifes for Privacy, Possibilities, and Models: a paper sanctuary, an unfolding paper ribbon, and a paired model study. They were generated through Higgsfield with GPT Image 2.5 (`gpt_image_2_5`), flare, high quality, 2K, 3:2, and transparency. Each was preflighted at 2.75 credits, for 8.25 estimated credits in v7. All nine generated images were estimated at 24.75 credits in total; actual charged credits were not returned. Served WebPs are in `public/assets/`; source images, prompts, references, job IDs, and estimates are recorded in `assets-src/asset-manifest.json`.

The layered envelope opens inside the sticky blue hero through independent seal, flap, and note channels. It fades away after the hero and returns only for the final invitation, where it closes once. `SectionArtwork.tsx` places the three chapter-specific transparent images in Privacy, Possibilities, and Models; the FAQ remains text-led without repeated artwork. `EnvelopeArtwork.tsx` combines the photographic layers with HTML text and the vector seal, while `useCorrespondenceJourney.ts` directs native-scroll progress with passive listeners and a settling `requestAnimationFrame` loop. Reduced motion removes the extended scroll and keeps a static reading path. Listeners, observers, and frames are disposed when leaving the page. V7 adds no dependency and does not change Studio, Docs, Pricing, wallet behavior, or rates.

Concept references are in `references/private-correspondence.svg`, `references/correspondence-scroll.svg`, and the v6 direction `references/correspondence-theatre.svg`. The custom wordmark and folded V symbol are shared through `Brand.tsx`. Modal interfaces support keyboard focus and Escape. Browser evidence is in `validation/`; its responsive iframe helper is excluded from the production build.
