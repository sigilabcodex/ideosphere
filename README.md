# Ideosphere v0.01

Ideosphere is a privacy-first, local-first prototype for exploring political and ideological thought as a multidimensional field rather than a single left/right score.

This build is an **early architecture + visualization prototype**:
- Browser-only SPA (no backend, no auth, no tracking)
- Type-safe data model with layer-aware questions/axes
- Interactive Three.js probability cloud inside a bounded ideological space
- Live updates as answers are submitted

## Stack

- Vite
- React + TypeScript
- Three.js
- Simple CSS (no heavy UI framework)

## Quick start

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

Production build:

```bash
npm run build
npm run preview
```

## Current UX (v0.01)

Three-panel layout:
1. **Left panel**: intro, layer toggle, coverage/uncertainty, axis summary
2. **Center panel**: rotatable/zoomable 3D ideosphere with translucent boundary + particle field
3. **Right panel**: question card with Likert controls and profile note

Supported active layers in UI:
- descriptive
- aspirational

Data model is already prepared for:
- pragmatic
- strategic

## Data-driven architecture

All seed content is JSON-driven:

- `src/data/axes/axes.v0.01.json`
- `src/data/questions/questions.v0.01.json`

Each axis includes:
- `id`, `name`, `definition`, `branches`, `supportedLayers`

Each question includes:
- `id`, `family`, `text`, `layer`, `abstractionLevel`, `axisImpacts`, optional `tags`

## Scoring model (prototype)

`src/lib/scoring.ts` implements:
- per-axis weighted aggregation from answer impacts
- per-layer profile state (`coverage`, `uncertainty`, axis scores)
- cloud parameter derivation (`centroid`, `spread`, `density`, `jitter`)

The model is intentionally transparent and non-claiming; it is for interface/architecture prototyping.

## Folder structure

```text
src/
  components/
    AxisSummary.tsx
    IdeosphereCanvas.tsx
    LayerToggle.tsx
    QuestionCard.tsx
  data/
    axes/axes.v0.01.json
    questions/questions.v0.01.json
  lib/
    data.ts
    scoring.ts
  styles/app.css
  types/ideosphere.ts
  App.tsx
  main.tsx
```

## v0.02 candidates

- Persist answers/profile to `localStorage`
- Add question progression controls and history review
- Add tooltips and glossary/lexicon support via Markdown/JSON
- Add layer-comparison mode (descriptive vs aspirational overlay)
- Add attractor/cluster prototypes and confidence visualization modes
- Expand question bank and axis anchor explanations

## License

MIT (see `LICENSE`).
