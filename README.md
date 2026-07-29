# Campus Connect

A single-university website with three features for students:
- **Community** — Reddit-style Q&A where juniors ask questions and seniors/peers answer.
- **Carpool** — post or request rides, with Google Maps for origin/destination.
- **Food** — search nearby restaurants/food spots (Google Places) and save favorites.
- **Profile** — view/edit your own info, see your own posts and rides.

Solo project, built with Claude Code. Full product/technical planning lives in [`docs/`](./docs):
- [`docs/PRD.md`](./docs/PRD.md) — what's in scope and why
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — tech stack, folder structure, DB schema, API design, design system
- [`docs/DECISIONS.md`](./docs/DECISIONS.md) — decisions log
- [`docs/TASKS.md`](./docs/TASKS.md) — step-by-step build tasks
- [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) — change history

See [`CLAUDE.md`](./CLAUDE.md) for the rules Claude Code follows when building this project.

## Tech Stack
- Frontend: React (Vite)
- Backend: Python (FastAPI)
- Database: SQLite (auto-created, auto-seeded with dummy data)
- Auth: email/password + JWT
- Maps/Places: Google Maps JS API + Google Places API

## Getting Started

### Backend
```bash
cd backend
pip install -r requirements.txt
# Fill in real values in backend/.env (see ARCHITECTURE.md Section 6 for key names/locations)
uvicorn app.main:app --reload
```
Swagger docs available at `http://localhost:8000/docs` once running.

### Frontend
```bash
cd frontend
npm install
# Fill in real values in frontend/.env
npm run dev
```

## Status
🚧 In active development — see `docs/TASKS.md` for current build progress.
