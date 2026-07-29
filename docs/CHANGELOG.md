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
