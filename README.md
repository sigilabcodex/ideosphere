# Ideosphere v0.02

Ideosphere is a privacy-first, local-first prototype for exploring political and ideological thought as a multidimensional field rather than a single left/right score.

This build is an **early architecture + visualization prototype**:
- Browser-only SPA (no backend, no auth, no tracking)
- Type-safe data model with metadata-rich question structure
- Interactive Three.js probability cloud inside a bounded ideological space
- Live updates as answers are submitted
- Automatic profile persistence in localStorage with import/export portability

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

## Current UX (v0.02)

Three-panel layout:
1. **Left panel**: intro, language toggle, exploration/clarity/coverage indicators, axis summary
2. **Center panel**: rotatable/zoomable 3D ideosphere with translucent boundary + particle field
3. **Right panel**: unified question card with tags, Likert controls, and Skip

Right panel controls also include:
- **Export Profile** (downloads current profile JSON)
- **Import Profile** (loads a previously exported JSON profile)
- **Reset Profile** (clears in-memory + localStorage profile data)

## Question architecture

Questions now run as a **single mixed stream** instead of separate layer questionnaires.
Each question still carries internal metadata used by scoring and balancing:

- `id`
- `family`
- `text.en` / `text.es`
- `layer` (e.g., descriptive, pragmatic, prescriptive)
- `abstractionLevel` (concrete, institutional, abstract)
- `visibleTags` (shown as UI chips)
- `axisImpacts` (`axis`, `branch`, `weight`)

At load time, branch impacts are mapped to axis directions so the existing axis scoring model remains intact.

## Multilingual support

Question text supports English and Spanish in JSON via:

- `text.en`
- `text.es`

The UI includes an `EN/ES` toggle.
If a translation is missing, the app falls back to English.

## Skip behavior

Question cards include a **Skip** option in addition to the 5-point Likert scale.

- Skip does not create an answer record.
- Skip does not affect scoring.
- Skipped questions naturally reappear later in the mixed cycle.
- Completion metrics track answered questions only.

## Profile persistence (local-first)

Ideosphere stores profile state in browser `localStorage` under:

- `ideosphere_profile_v1`

Behavior:
- State is saved after each answer update.
- State is restored on app load.
- Invalid/corrupted or incompatible stored data is ignored and cleared safely.

No profile data is sent to a server.

## Import / export JSON format

Export creates a readable JSON file named:

- `ideosphere-profile-YYYYMMDD.json`

Serialized shape:

```json
{
  "schemaVersion": 1,
  "version": "0.02",
  "created": "2026-03-09T18:00:00Z",
  "answers": {
    "coordination_local_01": 2,
    "authority_expert_01": -1
  },
  "profiles": {
    "descriptive": { "layer": "descriptive", "coverage": 0.2, "uncertainty": 0.8, "axisScores": [] },
    "pragmatic": { "layer": "pragmatic", "coverage": 0.1, "uncertainty": 0.9, "axisScores": [] },
    "prescriptive": { "layer": "prescriptive", "coverage": 0.1, "uncertainty": 0.9, "axisScores": [] }
  }
}
```

Import validates JSON shape/version before applying data to the active session.

## Data-driven architecture

All seed content is JSON-driven:

- `src/data/axes/axes.v0.01.json`
- `src/data/questions/questions.v0.01.json`

## Scoring model (prototype)

`src/lib/scoring.ts` implements:
- per-axis weighted aggregation from answer impacts
- per-layer profile state (`coverage`, `uncertainty`, axis scores)
- unified profile derivation for the single ideosphere cloud
- cloud parameter derivation (`centroid`, `spread`, `density`, `jitter`)

The model is intentionally transparent and non-claiming; it is for interface/architecture prototyping.

## License

MIT (see `LICENSE`).
