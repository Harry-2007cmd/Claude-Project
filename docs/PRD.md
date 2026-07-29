# Campus Connect — Product Requirements Document (PRD)

## 1. Vision
Campus Connect is a single-university **website** (not a mobile app) that helps students solve three concrete, everyday problems:
1. Getting guidance from seniors/peers on academic and campus questions.
2. Finding a carpool for commuting.
3. Discovering good nearby restaurants/food spots.

Solo-built, one project, three independent features sharing one login and one shell UI.

## 2. Target Users
- University students, single campus, single university for MVP (no multi-tenant support yet).
- No `.edu` domain verification in MVP — any email/password account can sign up.

## 3. Features (MVP Scope)

### 3.1 Community (Reddit-style Q&A)
**Goal:** Let junior students ask questions and get guided by seniors/peers, cross-department and cross-year.
- Any logged-in user can create a **post** (title + body, optional department tag).
- Any logged-in user can **comment** on any post (flat comments, no nested threads in MVP).
- Feed view: list of posts, most recent first.
- Post detail view: post + all comments.
- No upvotes/likes, no post editing/deleting in MVP (add later).

### 3.2 Carpool
**Goal:** Let students offer or find rides.
- Any logged-in user can **post a ride** (origin, destination, departure time, seats available, notes).
- Origin/destination shown on a **Google Map**.
- Any other logged-in user can **request a seat** on a ride.
- Ride owner (driver) can **accept/decline** requests.
- List view of all upcoming rides; detail view per ride with map + request button.

### 3.3 Food/Place Recommendations
**Goal:** Recommend nearby restaurants/food spots.
- User can search/browse nearby food places (via Google Places API, proxied through backend).
- Results shown as cards (name, rating, distance) + map.
- User can save a place to **favorites**.

## 4. Explicitly Out of Scope for MVP
- Real-time chat/messaging
- Push notifications / email notifications
- Post/comment editing or deletion
- Nested comment threads
- Multi-university support
- `.edu` email verification
- Payments for carpool
- Ratings/reviews written by users for food places (only Google's own rating shown)
- Mobile app (this is web-only)

## 5. Core User Flows
1. **Sign up / Log in** → JWT stored client-side → lands on Community feed.
2. **Community:** Feed → Post detail → Add comment.
3. **Carpool:** Ride list → Post a ride (map picker) → Ride detail → Request seat → Driver accepts/declines.
4. **Food:** Food page → Search/browse → View on map → Save favorite.

## 6. Edge Cases to Handle
**Community**
- Empty feed (no posts yet) → show empty state, not a blank page.
- Very long post body → truncate in feed view, full text on detail page.
- Post with zero comments → show "No answers yet" state.
- Duplicate/spam posting → not blocked in MVP, flagged as a known gap (see DECISIONS.md).

**Carpool**
- Ride departure time in the past → don't show in active list.
- Seats available = 0 → disable "Request seat" button.
- User requests a seat on their own ride → block this.
- Two passengers accepted beyond seat capacity → validate seat count on accept.
- Ride cancelled after requests were accepted → notify request status as "ride cancelled" (soft state, no email in MVP).

**Food**
- No results near the given location → show "No places found nearby" state.
- Invalid/missing location (user denies location permission) → fall back to manual search box.
- External API key invalid/quota exceeded → show a graceful error, not a crash.
- Duplicate favorite save → prevent duplicate entries.

## 7. Security Requirements (summary — full detail in ARCHITECTURE.md)
- Passwords hashed, never stored/logged in plaintext.
- JWT secret and all third-party API keys live only in `.env` files, never committed or sent to frontend where avoidable.
- Google Places lookups proxied through backend so the Places key never reaches the browser.
- Google Maps *display* key is a separate, domain-restricted key (this one is fine client-side).
- Authorization checks: only a ride's driver can accept/decline requests on that ride.

## 8. Success Criteria for MVP (solo build)
- All three features work end-to-end against the real FastAPI backend (not mock data) by the end of the build.
- Google Maps renders correctly in Carpool and Food pages once the real API key is added.
- A new user can sign up, post a question, post/request a ride, and search food places without errors.
