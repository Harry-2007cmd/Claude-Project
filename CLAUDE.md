# CLAUDE.md — Instructions for Claude Code on this project

This file is read automatically by Claude Code. It exists so you don't have to re-explain
project context every session. **Docs in `docs/` are the source of truth — read them before
writing any code, and update them if a decision changes.**

## Read these first, in this order
1. `docs/PRD.md` — what we're building and why
2. `docs/ARCHITECTURE.md` — tech stack, folder structure, DB schema, API design, design system
3. `docs/DECISIONS.md` — settled decisions; don't re-litigate these without asking the owner
4. `docs/TASKS.md` — the exact task list and build order; work through it top to bottom

## Ground rules
1. **One task at a time.** Complete a single task from `docs/TASKS.md`, then stop and let the owner check/run it before starting the next task. Do not batch multiple tasks into one pass.
2. **Follow the build order exactly:** Phase 1 (frontend, mock data) → Phase 2 (backend) → Phase 3 (integration). Do not wire real API calls during Phase 1.
3. **Never invent or guess API key values.** For any third-party key (Google Maps, Google Places, JWT secret), only write the key **name** as a placeholder in the relevant `.env` file (e.g. `GOOGLE_PLACES_API_KEY=PASTE_YOUR_GOOGLE_PLACES_KEY_HERE`) and tell the owner which file/line to fill in. Never fetch, generate, or fabricate a real key.
4. **Design system is fixed** — use the color tokens and component structure in `docs/ARCHITECTURE.md` Section 5 (`tokens.css`, shared `components/ui/` Button/Card/Input). Don't introduce new colors or redefine styles per-page; reuse the shared components.
5. **Database is SQLite, auto-created and auto-seeded.** No manual DB setup steps for the owner — `seed.py` should populate dummy data on first run if the DB is empty.
6. **Don't build anything in the "Deferred" list** at the bottom of `docs/TASKS.md` (real-time chat, edit/delete, threading, multi-university, `.edu` verification, rate limiting) unless the owner explicitly asks.
7. **If a request conflicts with something in `docs/DECISIONS.md`**, flag the conflict to the owner instead of silently picking one — decisions should change through conversation, not get overwritten mid-build.
8. **When a feature is added, changed, or removed**, update the relevant doc(s) in `docs/` (PRD/ARCHITECTURE/DECISIONS/TASKS) and add an entry to `docs/CHANGELOG.md` — don't let code and docs drift apart.

## Tech stack (see ARCHITECTURE.md for detail)
- Frontend: React + Vite
- Backend: Python + FastAPI
- DB: SQLite (via SQLAlchemy)
- Auth: email/password + JWT (`passlib`, `python-jose`)
- Maps/Places: Google Maps JS API (frontend display) + Google Places API (backend proxy)
