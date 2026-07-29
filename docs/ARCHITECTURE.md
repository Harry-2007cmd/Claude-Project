# Campus Connect — Architecture & Technical Design

## 1. Tech Stack
- **Frontend:** React (Vite), plain CSS or Tailwind (design system TBD — see Section 5, template image slot)
- **Backend:** Python, FastAPI
- **Database:** SQLite, auto-created and auto-seeded by a seed script (no manual DB setup required)
- **Auth:** Email/password + JWT (via `passlib` for hashing, `python-jose` for JWT)
- **Maps/Places:** Google Maps JavaScript API (display) + Google Places API (search, proxied via backend)

## 2. Repository Structure

```
campus-connect/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── CommunityFeedPage.jsx
│   │   │   ├── PostDetailPage.jsx
│   │   │   ├── CarpoolListPage.jsx
│   │   │   ├── CarpoolDetailPage.jsx
│   │   │   ├── CarpoolCreatePage.jsx
│   │   │   └── FoodPage.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── CommentList.jsx
│   │   │   ├── CommentForm.jsx
│   │   │   ├── RideCard.jsx
│   │   │   ├── RideRequestButton.jsx
│   │   │   ├── MapView.jsx
│   │   │   └── PlaceCard.jsx
│   │   ├── api/
│   │   │   ├── client.js        # axios instance, attaches JWT
│   │   │   ├── auth.js
│   │   │   ├── community.js
│   │   │   ├── carpool.js
│   │   │   └── food.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── assets/
│   │   │   └── design-reference/   ← PUT YOUR TEMPLATE IMAGE HERE
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                       # VITE_API_BASE_URL, VITE_GOOGLE_MAPS_API_KEY
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py            # SQLite engine + session
│   │   ├── models.py              # SQLAlchemy models
│   │   ├── schemas.py             # Pydantic request/response models
│   │   ├── seed.py                # dummy data seeder, runs on startup if DB empty
│   │   ├── auth/
│   │   │   ├── routes.py
│   │   │   └── utils.py           # password hashing, JWT create/verify
│   │   ├── community/
│   │   │   └── routes.py
│   │   ├── carpool/
│   │   │   └── routes.py
│   │   └── food/
│   │       └── routes.py
│   ├── .env                       # DATABASE_URL, JWT_SECRET_KEY, GOOGLE_MAPS_API_KEY, GOOGLE_PLACES_API_KEY
│   └── requirements.txt
│
└── docs/
    ├── PRD.md
    ├── ARCHITECTURE.md
    ├── DECISIONS.md
    ├── CHANGELOG.md
    └── TASKS.md
```

## 3. Database Schema (SQLite)

**users**
| column | type | notes |
|---|---|---|
| id | int, PK | |
| name | text | |
| email | text, unique | |
| password_hash | text | |
| department | text | nullable |
| year | int | nullable, e.g. 1–4 |
| created_at | datetime | |

**posts** (Community)
| column | type | notes |
|---|---|---|
| id | int, PK | |
| user_id | int, FK → users | |
| title | text | |
| body | text | |
| department_tag | text | nullable |
| created_at | datetime | |

**comments**
| column | type | notes |
|---|---|---|
| id | int, PK | |
| post_id | int, FK → posts | |
| user_id | int, FK → users | |
| body | text | |
| created_at | datetime | |

**carpool_rides**
| column | type | notes |
|---|---|---|
| id | int, PK | |
| driver_id | int, FK → users | |
| origin_text | text | |
| destination_text | text | |
| origin_lat / origin_lng | float | |
| destination_lat / destination_lng | float | |
| departure_time | datetime | |
| seats_available | int | |
| notes | text | nullable |
| created_at | datetime | |

**carpool_requests**
| column | type | notes |
|---|---|---|
| id | int, PK | |
| ride_id | int, FK → carpool_rides | |
| passenger_id | int, FK → users | |
| status | text | `pending` / `accepted` / `declined` |
| created_at | datetime | |

**food_favorites**
| column | type | notes |
|---|---|---|
| id | int, PK | |
| user_id | int, FK → users | |
| place_id | text | Google Place ID |
| place_name | text | |
| place_data | text (json) | cached snapshot from Places API |
| created_at | datetime | |

## 4. API Design (FastAPI, REST, JSON)

**Auth**
- `POST /auth/signup` — {name, email, password, department, year} → user + JWT
- `POST /auth/login` — {email, password} → JWT
- `GET /auth/me` — (auth required) → current user profile

**Community**
- `GET /posts` — list all posts, newest first
- `POST /posts` — (auth) create post
- `GET /posts/{id}` — post + its comments
- `POST /posts/{id}/comments` — (auth) add comment

**Carpool**
- `GET /carpool/rides` — list upcoming rides
- `POST /carpool/rides` — (auth) create ride
- `GET /carpool/rides/{id}` — ride detail
- `POST /carpool/rides/{id}/request` — (auth) request a seat
- `GET /carpool/rides/{id}/requests` — (auth, driver-only) list requests on own ride
- `PATCH /carpool/requests/{id}` — (auth, driver-only) {status: accepted/declined}

**Food**
- `GET /food/recommendations?lat=&lng=&query=` — proxies Google Places, returns place list
- `POST /food/favorites` — (auth) save a favorite
- `GET /food/favorites` — (auth) list saved favorites

All authenticated endpoints expect `Authorization: Bearer <JWT>`.

## 5. UI/UX Notes
- A `frontend/src/assets/design-reference/` folder is reserved for your template image. Once added, Claude Code should read it before building shared layout/components (Navbar, cards, color palette, typography) so the generated UI matches your reference rather than a generic default.
- Shared shell: Navbar (Community / Carpool / Food / Profile), consistent card + button styling across all three features.
- Build order for frontend (Phase 1, mock data only): Auth pages → Community → Carpool (with static map) → Food (with map).

## 6. API Keys / Environment Variables
Claude Code should **only reference key names and file locations**, never generate or guess real key values. You will paste real values in manually.

**backend/.env**
```
DATABASE_URL=sqlite:///./campus_connect.db
JWT_SECRET_KEY=PASTE_YOUR_JWT_SECRET_HERE
GOOGLE_PLACES_API_KEY=PASTE_YOUR_GOOGLE_PLACES_KEY_HERE
```

**frontend/.env**
```
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=PASTE_YOUR_GOOGLE_MAPS_JS_KEY_HERE
```

Note: the Maps *display* key (frontend) and the Places *search* key (backend) can be the same Google Cloud key or separate keys — restrict the frontend one by HTTP referrer in Google Cloud Console for safety.

## 7. Security Concerns
- Passwords hashed with bcrypt (`passlib`), never logged.
- JWT secret only in backend `.env`, never committed to git.
- CORS restricted to the frontend's origin only.
- Places API key never sent to the browser — all place search calls go through the backend proxy endpoint.
- Post/comment body rendered as plain text (escaped) on the frontend to prevent stored XSS.
- Authorization checks on every mutating endpoint (e.g., only the driver can accept/decline requests on their own ride).
- No rate limiting in MVP — flagged as a known gap for spam/abuse (see DECISIONS.md).

## 8. Complexity Estimate
| Area | Estimate |
|---|---|
| Auth (signup/login/JWT) | Low–Medium |
| Community (posts/comments) | Low |
| Carpool (rides/requests + Maps) | Medium (Maps integration is the time sink) |
| Food (Places proxy + Maps) | Medium |
| Frontend↔backend integration | Low–Medium |
| **Total (solo, with Claude Code doing the typing)** | Realistically a long single session, not a quick hour — flagging this so "one sitting" expectations are calibrated. |
