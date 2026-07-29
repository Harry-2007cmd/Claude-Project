# Campus Connect — Decisions Log

| # | Decision | Rationale |
|---|---|---|
| D1 | Platform is a **website**, not a mobile app | Solo dev, faster to build and iterate with React + Claude Code |
| D2 | Full scope reset from original mentorship-matching concept to a 3-feature app (Community, Carpool, Food) | Owner's requirements changed; old plan is discarded, not merged |
| D3 | Database = **SQLite**, auto-created and auto-seeded, not hardcoded JSON | Just as automatable by Claude Code with zero manual setup, but far easier to extend later than hardcoded data |
| D4 | Auth = email/password + **JWT**, no `.edu` verification | JWT is low-effort to add in FastAPI and was explicitly requested if achievable with low effort; `.edu` verification adds complexity not needed for MVP |
| D5 | Community feature modeled as a **Reddit-style Q&A board** (posts + flat comments), not profile-based matching | Owner's actual want: juniors post questions, seniors/peers answer in comments — simpler and more directly useful than a matching system |
| D6 | No comment threading, no post edit/delete, no upvotes in MVP | Keep scope small for a solo one-sitting build; easy to add later |
| D7 | Carpool uses **Google Maps JS API** (display) + coordinates stored per ride | Needed for visual origin/destination, explicitly requested |
| D8 | Food recommendations proxy **Google Places API** through the backend | Keeps the Places key server-side; only the Maps display key touches the frontend |
| D9 | Build order: **Frontend first (mock data) → Backend → Integration**, in small checkable steps | Matches owner's preferred workflow for solo building with Claude Code |
| D10 | API keys are never generated/guessed by Claude Code — only key **names and file locations** are referenced; owner pastes real values manually | Explicit owner requirement, also a security best practice |
| D11 | No rate limiting / spam protection in MVP | Accepted as a known gap for a fast solo build; flagged for post-MVP hardening |
| D12 | Single university only, no multi-tenant support in MVP | Confirmed by owner |
