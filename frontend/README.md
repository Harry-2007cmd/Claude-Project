# Campus Connect — frontend

React + Vite client for Campus Connect. See [`../docs/`](../docs) for the
product and technical docs; this file only covers running the frontend.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint` (oxlint).

## Environment

`.env` holds key **names** only — real values are pasted in manually and the
file is gitignored (see ARCHITECTURE.md Section 6):

```
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=PASTE_YOUR_GOOGLE_MAPS_JS_KEY_HERE
```

Maps render as a styled placeholder until the real key is added in Phase 3.

## Layout

```
src/
├── pages/        one component per route
├── components/   feature components + ui/ (shared Button, Card, Input)
├── styles/       tokens.css — the only place colors and component styles live
├── api/          axios client + per-feature modules (wired in Phase 3)
├── context/      AuthContext (fake auth in Phase 1) + useAuth hook
├── mocks/        Phase 1 fixtures — deleted once the backend is wired
├── utils/        date/formatting helpers
└── assets/design-reference/   reference screenshots (not imported)
```

Two rules worth repeating: all colors come from `styles/tokens.css` (never
per-page), and pages must not call the backend until Phase 3 — see
[`../CLAUDE.md`](../CLAUDE.md).
