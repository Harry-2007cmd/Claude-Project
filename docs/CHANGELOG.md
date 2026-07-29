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

## [Unreleased] — 2026-07-29 (T1.1 — shared shell + routing)
### Added
- `react-router-dom` (v7) as a frontend dependency; `BrowserRouter` mounted in `main.jsx`.
- `components/Navbar.jsx` built for real: brand link + Community / Carpool / Food / Profile, active route highlighted with `--color-primary-soft`, collapses to a stacked row under 560px.
- Route map in `App.jsx` (ARCHITECTURE.md 5.4 / D14): `/` redirects to `/login`; `/login` and `/signup` render without the Navbar; `/community`, `/community/:postId`, `/carpool`, `/carpool/new`, `/carpool/:rideId`, `/food`, `/profile` render inside an `AppLayout` (Navbar + centered 880px column). Unknown paths render a 404 state inside the shell.
- Shell styles added to `tokens.css`: `.app-shell`, `.navbar*`, `.page-state` (reused later for the PRD Section 6 empty states), `.auth-shell`.

### Changed
- `StyleGuide.jsx` deleted and `App.jsx` rewritten as the router, as planned in T1.0.
- Login/Signup stubs given temporary cross-links (`Continue to Community`, and login↔signup) purely so the shell is click-throughable; both bodies are replaced wholesale in T1.2.

### Notes
- No auth guard on the feature routes yet — there is no auth state until T1.2 (fake) / T3.1 (real), so every route is directly reachable for now.

## [Unreleased] — 2026-07-29 (T1.2 — auth pages + fake auth state)
### Added
- `pages/LoginPage.jsx` ("Welcome back!") and `pages/SignupPage.jsx` ("Welcome onboard!"), built from the shared `ui/` components — layout and copy follow design-reference `02B`/`05A`. Signup collects name, email, password, confirm-password, department and year, matching `POST /auth/signup`.
- Client-side validation with per-field inline errors in the reference's red-border style: required fields, email format, 8-character minimum password, password-match check.
- `context/AuthContext.jsx` implemented as **fake** Phase 1 auth: `login`/`signup`/`logout` keep a mock user in state + `localStorage`. No network calls, no JWT — replaced in T3.1.
- Route guards in `App.jsx`: feature routes redirect signed-out visitors to `/login` (remembering the intended path); `/login` and `/signup` redirect to `/community` when already signed in.
- Navbar now shows the signed-in user's name and a Log out control.

### Changed
- **Buttons restyled to match the reference screenshots**, which arrived in `design-reference/` after T1.0 was built: rectangular instead of pill-shaped, uppercase + letter-spaced labels, disabled state as a flat slate block rather than 45% opacity, secondary variant now purple-outlined. Documented in ARCHITECTURE.md Section 5.2.
- `ui/Input.jsx` gained an `as` prop so it can render a `<select>` (used for the signup Year field) while keeping one field/label/error API.
- ARCHITECTURE.md Section 1 now records the settled styling choice (plain CSS, no Tailwind) and `react-router-dom`; Section 6 documents the `FRONTEND_ORIGIN` variable added to `backend/.env` for CORS.

## [Unreleased] — 2026-07-29 (T1.3 / T1.4 — Community feed + post detail)
### Added
- `pages/CommunityFeedPage.jsx`: department filter chips over a card feed, newest first, per the community reference re-skinned to the dark palette (D13). Chips filter the mock list client-side.
- `components/PostCard.jsx`: author avatar (initials placeholder) + department/year, relative timestamp, title, 2-line clamped body preview, department tag and answer count.
- `pages/PostDetailPage.jsx`: full post body, flat comment list, add-answer form. Unknown post ids render a "Post not found" state.
- `components/CommentList.jsx` (flat, no threading per D6) and `components/CommentForm.jsx` (validates non-empty, appends to local state only).
- `mocks/community.js`: 5 mock posts + comment fixtures, shaped like the `GET /posts` response so T3.2 is a source swap. `utils/date.js`: `formatRelativeTime` and `initialsOf`.
- Edge cases from PRD Section 6 covered: empty feed state, empty filter result, long body truncated in the feed but full on detail, "No answers yet" on zero-comment posts.

### Changed
- ARCHITECTURE.md Section 2 folder structure now lists `src/mocks/` (Phase 1 fixtures, removed at Phase 3) and `src/utils/`.

### Notes
- **Gap flagged, not built:** PRD 3.1 says any logged-in user can create a post, but there is no create-post task in Phase 1 and no `PostCreatePage.jsx` in the ARCHITECTURE.md structure. The feed and detail pages are read-only plus commenting until this is resolved.

## [Unreleased] — 2026-07-29 (T1.5–T1.7 — Carpool)
### Added
- `pages/CarpoolListPage.jsx`: upcoming rides only — departed and cancelled rides are filtered out (PRD Section 6) — with an "Offer a ride" action and an empty state.
- `components/RideCard.jsx`: driver + departure, distance, the reference's "Your location → Destination" stack (teal origin dot, purple destination dot, dotted connector), seats-left tag and a "Your ride" tag.
- `pages/CarpoolDetailPage.jsx`: map + bottom-sheet layout per design-reference 10K/10L — the sheet overlaps the map and carries route, departure, seats, notes and the CTA.
- `components/MapView.jsx`: static SVG placeholder that projects the real origin/destination bearing into a stylised route with palette-coloured pins, badged "live map added in T3.3". Props match what the Google Maps integration will need.
- `components/RideRequestButton.jsx`: encapsulates the request states — own ride, cancelled ride, zero seats, and already-requested (pending/accepted/declined).
- `pages/CarpoolCreatePage.jsx`: origin, destination, departure time (past times rejected), seat stepper (1–6, from the reference's occupant control) and notes.
- `mocks/carpool.js`: 6 rides deliberately covering the edge cases — a full ride (0 seats), one already departed, one cancelled, and one driven by the current user.
- Driver view on your own ride: pending seat requests with Accept/Decline, status pills, and seat-capacity validation that blocks accepting past the seat count (PRD Section 6).
- `utils/date.js` gained `formatDeparture` ("Today, 18:30" / "Tomorrow, 07:15") and `toDateTimeLocalValue`.

### Notes
- The driver accept/decline flow goes slightly beyond T1.6's "mock request button", but the PRD Section 6 carpool edge cases can't be demonstrated without it. All state is local — nothing persists.
- `CarpoolCreatePage` does not add to the mock list on submit; the fixture is static, so a new ride would vanish on reload. Real creation arrives with `POST /carpool/rides` in T3.3.

## [Unreleased] — 2026-07-29 (T1.8 — Food)
### Added
- `pages/FoodPage.jsx`: hero search banner over a browse grid, the food reference's layout recoloured from red/orange/yellow into the shared palette (D13). Search matches name, cuisine or street; category chips and a Favorites chip filter the grid; results sort by distance.
- `components/PlaceCard.jsx`: tinted media tile with the rating in the corner badge (where the reference put its discount badge), name, category/distance/price, address, open-now status, rating count, and a Save toggle.
- `mocks/food.js`: 8 nearby places shaped like the Places-proxy response the backend will return in T3.4.
- `components/MapView.jsx` extended with an optional `markers` prop — pins scattered by relative lat/lng for Food, while Carpool keeps the origin→destination route. Saved places render in the primary colour, the rest in accent.
- Edge cases from PRD Section 6 covered: "No places found nearby" empty state for both search and the Favorites filter, and favorites keyed by `place_id` in a Set so a place cannot be saved twice.

### Notes
- Favorites live in component state only — they reset on reload until `POST /food/favorites` is wired in T3.4.
- Place photos are category glyph placeholders; real Places photos arrive with the proxy in T3.4.
- Geolocation is not requested yet. The hero search box is the manual fallback the PRD asks for when location is denied; the permission prompt itself belongs to T3.4.

## [Unreleased] — 2026-07-29 (T1.9 — Profile)
### Added
- `pages/ProfilePage.jsx`: self-view only (D15) — avatar initials, name, email, department/year, bio, and post/ride counts, with "My Posts" / "My Rides" tabs below.
- Inline edit form for department, year and bio. Name and email render disabled, matching PRD 3.4 ("email/name not editable in MVP"). Cancel discards the draft; Save writes through the fake auth state.
- `AuthContext.updateProfile()` — Phase 1 stand-in for `PATCH /auth/me`, persisting to `localStorage` so an edit survives a reload.
- `myMockPosts()` in `mocks/community.js` and `myMockRides()` in `mocks/carpool.js`. Two feed posts are now authored by "You" so My Posts has content; My Rides reuses the ride already marked as the current user's, and deliberately includes past/cancelled rides since it is the driver's own history rather than the public upcoming list.
- Tab styling (`.tabs` / `.tab`) added to `tokens.css` with proper `role="tablist"`/`tabpanel` wiring. Both tabs have empty states.

### Notes
- Profile has no reference screenshot (ARCHITECTURE.md 5.2 says so explicitly), so the layout is deliberately plain and built from the existing shared components rather than inventing a new visual language.
- ✅ Phase 1 checkpoint is now reachable: every frontend page runs on mock data.

## [Unreleased] — 2026-07-29 (cleanup — open gaps resolved)
### Added
- **T1.10 (new task):** `components/PostComposer.jsx`, an "Ask a question" modal on the Community feed with title, details and an optional department tag. Closes the gap where PRD 3.1 promised post creation but no Phase 1 task built it. Validates title/body, closes on Escape or backdrop click, and prepends to the feed's local state — `POST /posts` is wired in T3.2. A modal was chosen over a full page: three fields didn't justify a route, and the ARCHITECTURE.md structure had no `PostCreatePage.jsx`.
- `context/authStore.js` (the context object) and `context/useAuth.js` (the hook), splitting `AuthContext.jsx` down to just the provider component. This clears the last lint warning — a module that mixes component and non-component exports breaks Vite fast refresh, which was forcing a full page reload on every edit to that file.

### Changed
- `frontend/README.md` replaced with a real project README (run commands, env key names, folder layout) instead of the stock Vite template text.
- ARCHITECTURE.md Section 2 updated with `PostComposer.jsx` and the three-way `context/` split; TASKS.md T3.2 now notes the composer needs wiring too.

### Removed
- `frontend/public/icons.svg` — a leftover of the deleted Vite template `App.jsx`, referenced by nothing.
