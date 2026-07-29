# Changelog

## [Unreleased] — 2026-07-29
### Changed
- **Full scope reset.** Original concept (mentorship-only matching app, mobile-first "app") replaced entirely with new scope: a single-university **website** with three independent features:
  - Community (Reddit-style Q&A for cross-year/department peer guidance)
  - Carpool (ride posting/requesting with Google Maps)
  - Food/Place recommendations (Google Places integration)
- Tech stack finalized: React (frontend) + FastAPI/Python (backend) + SQLite (auto-seeded dummy DB).
- Auth approach finalized: email/password + JWT, no `.edu` verification for MVP.

### Added
- Initial PRD.md, ARCHITECTURE.md, DECISIONS.md, TASKS.md created for the new scope.

### Removed
- All prior planning artifacts related to the mentorship-matching-only concept are superseded (not merged forward — explicitly discarded per owner request).

## [Unreleased] — 2026-07-29 (later same day)
### Added
- **Profile page** added to MVP scope: view/edit own department, year, bio; view own posts and own rides. New nullable `bio` column on `users`. New endpoints `PATCH /auth/me`, `GET /profile`, `GET /profile/posts`, `GET /profile/rides`.
- Concrete design system defined from owner-uploaded reference screenshots: shared color tokens (`tokens.css`) — dark background, purple `#7B5CFA` primary, teal `#2FD9C4` accent — applied sitewide, with each feature keeping its own reference layout (Community = card feed, Carpool = map + bottom sheet, Food = hero + grid).
- Navigation flow clarified: Login page is the landing page; Community feed is the home screen post-auth; persistent Navbar (Community / Carpool / Food / Profile).

### Changed
- File structure updated: added `ProfilePage.jsx`, `api/profile.js`, `components/ui/` (Button, Card, Input), `styles/tokens.css`.

## [Unreleased] — 2026-07-29 (Phase 0 scaffolding)
### Added
- **Phase 0 complete (T0.1–T0.3).** `frontend/` (Vite + React) and `backend/` (FastAPI) skeletons created per ARCHITECTURE.md Section 2 — every file/folder in the structure exists as a documented stub, to be filled in at its assigned task.
- `backend/app/main.py` with the FastAPI app, CORS locked to `FRONTEND_ORIGIN`, and a `/health` endpoint; `backend/requirements.txt`.
- `backend/.env` and `frontend/.env` with placeholder key **names** only (ARCHITECTURE.md Section 6) — real values pasted in manually by the owner.
- `.gitignore` entries so `.env`, `*.db`, and `.venv/` are never committed.
- `frontend/src/assets/design-reference/` folder for the owner's reference screenshots.

### Changed
- Replaced the default Vite template `App.jsx`/`main.jsx`/`index.html` with a minimal Campus Connect placeholder shell (the template referenced logo/CSS assets that don't exist in this repo).

## [Unreleased] — 2026-07-29 (T1.0 — design tokens + base components)
### Added
- `frontend/src/styles/tokens.css`: the palette from ARCHITECTURE.md 5.2 verbatim, plus derived tokens (soft/tinted variants, hover surface, focus ring), a type scale, spacing scale, radii, shadows and a base reset. Component styles for Button/Card/Input live here too, so no page can redefine the palette.
- Shared base components built for real: `components/ui/Button.jsx` (primary/secondary/ghost/danger × sm/md/lg, `block`, disabled), `components/ui/Card.jsx` (padding none/sm/md, `interactive` renders a keyboard-accessible `<button>`, `as` override), `components/ui/Input.jsx` (label, hint, error, `multiline` textarea, wired-up `aria-invalid`/`aria-describedby`).
- `frontend/src/StyleGuide.jsx` — **throwaway** T1.0 sanity-check view rendering every token and component state. To be deleted along with its `App.jsx` import when the routing shell lands in T1.1.

### Notes
- The reference screenshots described in ARCHITECTURE.md 5.1 are still absent from `frontend/src/assets/design-reference/`; T1.0 was built from the Section 5.2 token spec alone. Layout-level details for Community/Carpool/Food (T1.3–T1.8) will need those images.
