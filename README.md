# VEIL

A local React and TypeScript frontend with a complete landing page and private conversation studio. The original visual concept is personal correspondence: warm paper, blue ink, editorial typography, folded envelopes, and notebook pages.

## Local development

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5186`. The conversation studio is at `/#/studio`; the original `/#/terminal` route is also supported.

## Validation and build

```sh
npm run typecheck
npm run build
npm run preview
```

`dist/` contains the static build. Fonts and the SVG brand asset are local. No external assets, authentication, payment services, or inference APIs are required.

The interface includes responsive navigation, notebook starting points, model selection, expandable questions, conversation composition, a session sidebar, and studio settings. Conversation state stays in memory for the active studio session; assistant responses are not fabricated. The concept sketch is stored in `references/private-correspondence.svg`, outside production assets.
