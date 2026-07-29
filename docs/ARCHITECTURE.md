# Campus Connect — Architecture & Technical Design

## 1. Tech Stack
- **Frontend:** React (Vite), **plain CSS** (settled at T1.0 — no Tailwind; all tokens and shared component styles live in `styles/tokens.css`), `react-router-dom` for routing
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
│   │   │   ├── FoodPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── CommentList.jsx
│   │   │   ├── CommentForm.jsx
│   │   │   ├── PostComposer.jsx   # "Ask a question" modal (PRD 3.1)
│   │   │   ├── RideCard.jsx
│   │   │   ├── RideRequestButton.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── PlaceCard.jsx
│   │   │   └── ui/                # shared base components (design system)
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       └── Input.jsx
│   │   ├── styles/
│   │   │   └── tokens.css         # color/typography variables, see Section 5
│   │   ├── api/
│   │   │   ├── client.js        # axios instance, attaches JWT
│   │   │   ├── auth.js
│   │   │   ├── community.js
│   │   │   ├── carpool.js
│   │   │   ├── food.js
│   │   │   └── profile.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # AuthProvider component
│   │   │   ├── authStore.js       # the context object
│   │   │   └── useAuth.js         # the consumer hook
│   │   │   # split three ways so Vite fast refresh works (a file may export
│   │   │   # only components, or only non-components — not a mix)
│   │   ├── mocks/                 # Phase 1 fixtures only — deleted at Phase 3
│   │   │   ├── community.js
│   │   │   ├── carpool.js
│   │   │   └── food.js
│   │   ├── utils/
│   │   │   └── date.js            # relative timestamps, avatar initials
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
| bio | text | nullable, shown on Profile page |
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
- `PATCH /auth/me` — (auth required) {department?, year?, bio?} → update own profile fields

**Profile**
- `GET /profile` — (auth) alias of `/auth/me`, returns current user + their post/ride counts
- `GET /profile/posts` — (auth) list of the current user's own posts
- `GET /profile/rides` — (auth) list of rides the current user is driving

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

## 5. UI/UX & Design System

### 5.1 Reference templates
Uploaded reference screenshots live conceptually in `frontend/src/assets/design-reference/` (Claude Code should read them before building any shared components). They show three different visual styles:
- **Carpool references** — dark background, purple/violet primary buttons, teal/cyan map markers, rounded bottom-sheet cards over a live map.
- **Community reference** — light, card-feed layout (subreddit tiles, post cards with thumbnail/upvote count).
- **Food references** — light, hero banner + browse grid of place/dish cards, red/orange/yellow accents.

### 5.2 Unified design decision
Per owner direction ("same color theme, each feature has its own design"): the site uses **one shared color palette and typography sitewide**, while each feature keeps **its own layout/structure** from its reference, re-skinned into that shared palette.

**Button shape (from the references, settled at T1.2):** CTAs are rectangular
(`--radius-md`), uppercase and letter-spaced — matching `10L`/`02A` — not pills.
Disabled buttons render as a flat slate block with muted text (`02C`, `05A`),
never a faded primary. Secondary buttons are outlined in purple (`02A`).

**Shared tokens (`frontend/src/styles/tokens.css`):**
```css
:root {
  --color-bg:            #121218;   /* app background, dark */
  --color-surface:       #1C1C24;   /* cards, sheets */
  --color-primary:       #7B5CFA;   /* purple — primary buttons, active nav, links */
  --color-primary-hover: #6A4CE0;
  --color-accent:        #2FD9C4;   /* teal — map markers, highlights */
  --color-text:          #F5F5F7;
  --color-text-muted:    #9A9AA5;
  --color-border:        #2A2A33;
  --color-success:       #34D399;
  --color-danger:        #F87171;
  --radius-card: 16px;
  --font-family: 'Inter', system-ui, sans-serif;
}
```

**Per-feature layout mapping (colors above apply to all, only layout differs):**
| Feature | Layout kept from reference | Notes |
|---|---|---|
| Carpool | Map + bottom-sheet card, "Your location → Destination" row, purple CTA button, seat count stepper | Closest match to shared theme already — least re-skinning needed |
| Community | Horizontal filter/tag chips at top, card feed with thumbnail + comment count | Recolor light cards → dark `--color-surface` cards, keep the tile/feed structure |
| Food | Hero search banner, grid of place cards with % badge / rating | Recolor red/orange/yellow → `--color-primary`/`--color-accent`, keep hero + grid structure |
| Profile | New page, not in references | Simple layout: avatar placeholder, name/dept/year/bio, tabs for "My Posts" / "My Rides" |

### 5.3 Shared shell
- Navbar/tab bar: **Community / Carpool / Food / Profile** (Community is the home tab after login).
- Base components (`components/ui/Button.jsx`, `Card.jsx`, `Input.jsx`) should be built once, styled from `tokens.css`, and reused across all four pages so the palette actually stays consistent instead of being redefined per page.

### 5.4 Navigation flow
- **Landing page = Login page** (no marketing splash screen for MVP).
- After login/signup → redirect to **Community feed** (home).
- From Community, Navbar links to Carpool, Food, or Profile at any time.

### 5.5 Build order
Frontend (Phase 1, mock data only): **Design tokens + base UI components → Auth pages → Community → Carpool (static map) → Food → Profile.**

## 6. API Keys / Environment Variables
Claude Code should **only reference key names and file locations**, never generate or guess real key values. You will paste real values in manually.

**backend/.env**
```
DATABASE_URL=sqlite:///./campus_connect.db
JWT_SECRET_KEY=PASTE_YOUR_JWT_SECRET_HERE
GOOGLE_PLACES_API_KEY=PASTE_YOUR_GOOGLE_PLACES_KEY_HERE
FRONTEND_ORIGIN=http://localhost:5173
```

(`FRONTEND_ORIGIN` is not a secret — it's the single origin CORS is restricted to, see Section 7.)

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
