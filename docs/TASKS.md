# Campus Connect — Task Breakdown (for Claude Code)

Build order: **Phase 1 (Frontend, mock data) → Phase 2 (Backend) → Phase 3 (Integration)**.
Each task should be built, then manually checked/run, before starting the next one.

## Phase 0 — Scaffolding
- [x] T0.1: Create `frontend/` (Vite + React) and `backend/` (FastAPI) skeletons per ARCHITECTURE.md folder structure.
- [x] T0.2: Create `backend/.env` and `frontend/.env` with placeholder key names only (no real values) — see ARCHITECTURE.md Section 6.
- [x] T0.3: Create `frontend/src/assets/design-reference/` folder for the template image (owner to drop file in when ready).

## Phase 1 — Frontend (mock data only, no backend calls yet)
- [ ] T1.0: Create `styles/tokens.css` (design tokens per ARCHITECTURE.md Section 5.2) + base `components/ui/Button.jsx`, `Card.jsx`, `Input.jsx`. Render a throwaway style-guide view to sanity check colors before building real pages.
- [ ] T1.1: Build shared shell — Navbar + routing (Community / Carpool / Food / Profile / Login / Signup). Community is the default post-login route.
- [ ] T1.2: Build Login and Signup pages (UI only, form validation, fake submit handler) — this is the landing page.
- [ ] T1.3: Build Community Feed page with mock post list (`PostCard` component), styled per ARCHITECTURE.md 5.2 (card-feed layout, dark palette).
- [ ] T1.4: Build Post Detail page with mock comments (`CommentList`, `CommentForm`).
- [ ] T1.5: Build Carpool List page with mock rides (`RideCard`).
- [ ] T1.6: Build Carpool Detail page with static `MapView` (placeholder map, real key added later) + mock request button, styled per the map/bottom-sheet reference.
- [ ] T1.7: Build Carpool Create page (form: origin, destination, time, seats, notes).
- [ ] T1.8: Build Food page with mock place list (`PlaceCard`) + static map placeholder, styled per the hero/grid reference.
- [ ] T1.9: Build Profile page (mock data) — own info display/edit form + "My Posts" / "My Rides" tabs.
- [ ] ✅ Checkpoint: full frontend click-through works end-to-end on mock data before moving to Phase 2.

## Phase 2 — Backend
- [ ] T2.1: Set up `database.py` (SQLite engine) + `models.py` (all tables from ARCHITECTURE.md Section 3).
- [ ] T2.2: Write `seed.py` — auto-seeds dummy users/posts/rides/comments on first run if DB is empty.
- [ ] T2.3: Build `auth/routes.py` — signup, login, JWT issuing, `/auth/me`. Test with a REST client.
- [ ] T2.4: Build `community/routes.py` — posts + comments endpoints. Test.
- [ ] T2.5: Build `carpool/routes.py` — rides, requests, accept/decline. Test.
- [ ] T2.6: Build `food/routes.py` — Places API proxy endpoint + favorites endpoints. Test (will need the real Places key to fully verify — until then, confirm the endpoint at least calls out correctly and handles a missing/invalid key gracefully).
- [ ] T2.7: Add `PATCH /auth/me` + `GET /profile`, `GET /profile/posts`, `GET /profile/rides` endpoints. Test.
- [ ] ✅ Checkpoint: all endpoints tested individually (e.g. via FastAPI's `/docs` Swagger UI) before integration.

## Phase 3 — Integration
- [ ] T3.1: Wire `api/client.js` (axios) + `AuthContext` to real `/auth` endpoints. Replace fake login/signup.
- [ ] T3.2: Wire Community pages to real `/posts` and `/comments` endpoints.
- [ ] T3.3: Wire Carpool pages to real `/carpool` endpoints; add real Google Maps key to render live maps.
- [ ] T3.4: Wire Food page to real `/food/recommendations` endpoint; confirm map + place cards render live data.
- [ ] T3.5: Wire Profile page to real `/profile` endpoints (view/edit info, My Posts, My Rides).
- [ ] T3.6: Full end-to-end pass: sign up → post a question → get a comment → post a ride → request a seat → accept it → search food → save a favorite → edit profile. Fix any bugs found.
- [ ] ✅ Checkpoint: MVP complete.

## Deferred (explicitly out of MVP — do not build now)
- Real-time chat/notifications
- Post/comment edit or delete
- Nested comment threads
- Multi-university support
- `.edu` email verification
- Rate limiting / spam protection
