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
