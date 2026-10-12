# VEIL

A local React and TypeScript frontend with a complete landing page and conversation workspace, inspired by the visual language of [Latens](https://latens.si/).

## Local development

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5186`. The conversation workspace is at `/#/terminal`.

## Validation and build

```sh
npm run typecheck
npm run build
npm run preview
```

`dist/` contains the static build. Fonts and the SVG brand asset are local. No external assets, authentication, payment services, or inference APIs are required.

The interface includes responsive navigation, keyboard-accessible workflow tabs, model selection, expandable questions, conversation composition, a session sidebar, and workspace settings. Conversation state stays in memory for the active workspace session; assistant responses are not fabricated.
