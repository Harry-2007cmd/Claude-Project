"""Dummy data seeder (T2.2).

Runs from the startup hook in main.py and populates users, posts, comments,
rides and seat requests **only if the DB is empty** — so the owner never runs a
manual setup step (DECISIONS.md D3) and a restart never duplicates rows.

The fixtures deliberately mirror `frontend/src/mocks/` so that when Phase 3
swaps the frontend from mock data to the real API, the screens show the same
content and any difference is a wiring bug rather than different data. The
carpool rides also reproduce the PRD Section 6 edge cases: a full ride, a
departed ride, a cancelled ride, and a ride driven by the signed-in user.

Timestamps are relative to seed time, so the feed looks recent and the
"upcoming rides" list has content. That means rides age: after a couple of days
the seeded upcoming rides will have departed. Delete `backend/campus_connect.db`
and restart to get a fresh set.
"""

from datetime import timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth.utils import hash_password
from app.database import SessionLocal
from app.models import (
    REQUEST_ACCEPTED,
    REQUEST_PENDING,
    RIDE_ACTIVE,
    RIDE_CANCELLED,
    CarpoolRequest,
    CarpoolRide,
    Comment,
    Post,
    User,
    utcnow,
)

# Every seeded account shares this password. Local dummy data only — these are
# not credentials for anything real, and the DB file is gitignored.
SEED_PASSWORD = "campus1234"

# The account to log in with while developing. Owns the posts and the ride that
# the Phase 1 frontend attributed to "You".
DEMO_EMAIL = "demo@campus.edu"

HOUR = timedelta(hours=1)
DAY = timedelta(days=1)
MINUTE = timedelta(minutes=1)

# (key, name, email, department, year, bio)
USERS = [
    ("demo", "Demo Student", DEMO_EMAIL, "Computer Science", 3,
     "Third year CS. Ask me about electives, hostel life or the airport run."),
    ("ananya", "Ananya R.", "ananya.r@campus.edu", "Computer Science", 3, None),
    ("rohit", "Rohit K.", "rohit.k@campus.edu", "Mechanical", 2, None),
    ("meera", "Meera S.", "meera.s@campus.edu", "Business", 4,
     "Final year Business. Happy to talk placements and interview leave."),
    ("dev", "Dev P.", "dev.p@campus.edu", "Electrical", 2, None),
    ("sana", "Sana M.", "sana.m@campus.edu", "Civil", 1, None),
    ("kabir", "Kabir N.", "kabir.n@campus.edu", "Computer Science", 4,
     "Took most of the CS electives. Distributed Systems fan."),
    ("priya", "Priya V.", "priya.v@campus.edu", "Civil", 3, None),
    ("omar", "Omar F.", "omar.f@campus.edu", "Electrical", 3, None),
    ("iris", "Iris T.", "iris.t@campus.edu", "Computer Science", 4, None),
    ("ravi", "Ravi J.", "ravi.j@campus.edu", "Computer Science", 3, None),
    ("arjun", "Arjun L.", "arjun.l@campus.edu", "Mechanical", 4, None),
    ("nikhil", "Nikhil B.", "nikhil.b@campus.edu", "Business", 4, None),
    ("tara", "Tara G.", "tara.g@campus.edu", "Civil", 2, None),
]

# (author_key, title, body, department_tag, age)
POSTS = [
    (
        "ananya",
        "Which electives are actually worth taking in 3rd year CS?",
        "I'm picking electives for next semester and the course catalogue descriptions are "
        "useless. Has anyone taken Distributed Systems or Computer Graphics? Mainly wondering "
        "about the workload and whether the projects are group-based, because I'm already "
        "carrying a heavy core load and can't take on another 4-person group project that turns "
        "into me doing everything the night before the deadline.",
        "Computer Science",
        2 * HOUR,
    ),
    (
        "demo",
        "Best place to print project reports near the north gate?",
        "The stationery shop inside campus closes at 5pm and I need spiral binding done late. "
        "Any recommendations that stay open past 8?",
        "Campus Life",
        7 * HOUR,
    ),
    (
        "meera",
        "How do seniors manage internship applications with attendance rules?",
        "Attendance is 75% minimum but interview rounds are all on weekdays. Did you just take "
        "the shortage, or is there a way to get it excused? Asking before I plan my applications "
        "for the next cycle.",
        "Business",
        DAY + 3 * HOUR,
    ),
    (
        "demo",
        "Lab manual for Signals & Systems — anyone have last year's copy?",
        "The library copies are all issued out and the department store is out of stock. Happy to "
        "pay for photocopying.",
        "Electrical",
        2 * DAY,
    ),
    (
        "sana",
        "Is the 8am shuttle from the hostel reliable during exam week?",
        "First-year here. I've heard it gets full quickly and people end up walking. Should I be "
        "leaving earlier, or is the 8:20 one usually emptier?",
        "Campus Life",
        3 * DAY,
    ),
]

# (post_index, author_key, body, age) — flat, no threading (D6). One post is
# left with zero comments so the "No answers yet" state has real data behind it.
COMMENTS = [
    (0, "kabir",
     "Took Distributed Systems last year. Workload is fair but the project is a 3-person group "
     "and it's genuinely the best thing I did in the degree. Graphics is lighter but the maths "
     "ramps up fast around week 6.", HOUR),
    (0, "iris",
     "Seconding DS. Pick your group early though — the prof does not reshuffle after week 2.",
     40 * MINUTE),
    (0, "ravi",
     "If you want the lighter option go Graphics, but only if you liked linear algebra.",
     20 * MINUTE),
    (1, "priya",
     "There is a shop opposite the north gate bus stop open till 10pm, does binding in about 15 "
     "minutes.", 5 * HOUR),
    (1, "arjun",
     "Careful with that one during placement season, the queue gets long. Go before 8.", 4 * HOUR),
    (2, "nikhil",
     "Talk to your faculty advisor before the interview, not after. Mine logged it as on-duty "
     "leave and it never counted against attendance.", DAY),
    (4, "tara",
     "The 8am fills up at the hostel stop itself. 8:20 is usually fine except on exam days.",
     2 * DAY),
    (4, "omar",
     "During exam week just walk, it takes 12 minutes and you avoid the whole thing.", 2 * DAY),
]

# (driver_key, origin, destination, o_lat, o_lng, d_lat, d_lng, departs_in,
#  seats, notes, status)
RIDES = [
    ("ananya", "54 St Andrew St", "Eastside City Park",
     52.4796, -1.8853, 52.4823, -1.8887, 3 * HOUR, 3,
     "Leaving from the hostel gate. Two bags max, please be on time.", RIDE_ACTIVE),
    # seats_available = 0 → "Request seat" is disabled (PRD Section 6).
    ("rohit", "North Campus Gate", "Central Railway Station",
     52.4862, -1.8904, 52.4778, -1.8996, 6 * HOUR, 0,
     "Boot space is limited, hand luggage only.", RIDE_ACTIVE),
    # Driven by the demo user → the driver's accept/decline view.
    ("demo", "Library Block C", "Airport Terminal 2",
     52.4508, -1.7439, 52.4539, -1.7480, DAY + 2 * HOUR, 2,
     "Early start — I will wait 10 minutes max at the pickup point.", RIDE_ACTIVE),
    ("kabir", "South Hostel Block", "City Centre Mall",
     52.4712, -1.8801, 52.4791, -1.9026, 2 * DAY, 1, None, RIDE_ACTIVE),
    # Already departed → excluded from the upcoming list (PRD Section 6).
    ("priya", "Main Gate", "Riverside Sports Complex",
     52.4655, -1.8712, 52.4601, -1.8555, -4 * HOUR, 2, None, RIDE_ACTIVE),
    # Soft-cancelled → excluded from the list, but still says so on its detail
    # page (PRD Section 6).
    ("omar", "Engineering Block", "Old Town Market",
     52.4688, -1.8764, 52.4832, -1.8931, 9 * HOUR, 2,
     "Car trouble — sorry everyone.", RIDE_CANCELLED),
]

# (ride_index, passenger_key, status, age) — all on the demo user's ride, so the
# driver view has something to accept and decline.
REQUESTS = [
    (2, "meera", REQUEST_PENDING, 2 * HOUR),
    (2, "dev", REQUEST_PENDING, HOUR),
    (2, "sana", REQUEST_ACCEPTED, 3 * HOUR),
]


def _log(message: str) -> None:
    # flush=True because uvicorn leaves stdout block-buffered when it isn't a
    # terminal, which otherwise swallows these lines entirely.
    print(f"[seed] {message}", flush=True)


def _is_empty(db: Session) -> bool:
    return db.scalar(select(func.count()).select_from(User)) == 0


def _populate(db: Session) -> dict[str, int]:
    now = utcnow()

    # Every seeded account shares one password, so hash it once — bcrypt is
    # deliberately slow and hashing 14 times would add seconds to startup.
    shared_hash = hash_password(SEED_PASSWORD)

    users: dict[str, User] = {}
    for key, name, email, department, year, bio in USERS:
        user = User(
            name=name,
            email=email,
            password_hash=shared_hash,
            department=department,
            year=year,
            bio=bio,
            created_at=now - 30 * DAY,
        )
        users[key] = user
        db.add(user)

    posts: list[Post] = []
    for author_key, title, body, tag, age in POSTS:
        post = Post(
            author=users[author_key],
            title=title,
            body=body,
            department_tag=tag,
            created_at=now - age,
        )
        posts.append(post)
        db.add(post)

    for post_index, author_key, body, age in COMMENTS:
        db.add(
            Comment(
                post=posts[post_index],
                author=users[author_key],
                body=body,
                created_at=now - age,
            )
        )

    rides: list[CarpoolRide] = []
    for (
        driver_key, origin, destination, o_lat, o_lng, d_lat, d_lng,
        departs_in, seats, notes, status,
    ) in RIDES:
        ride = CarpoolRide(
            driver=users[driver_key],
            origin_text=origin,
            destination_text=destination,
            origin_lat=o_lat,
            origin_lng=o_lng,
            destination_lat=d_lat,
            destination_lng=d_lng,
            departure_time=now + departs_in,
            seats_available=seats,
            notes=notes,
            status=status,
            created_at=now - DAY,
        )
        rides.append(ride)
        db.add(ride)

    for ride_index, passenger_key, status, age in REQUESTS:
        db.add(
            CarpoolRequest(
                ride=rides[ride_index],
                passenger=users[passenger_key],
                status=status,
                created_at=now - age,
            )
        )

    db.commit()

    return {
        "users": len(USERS),
        "posts": len(POSTS),
        "comments": len(COMMENTS),
        "rides": len(RIDES),
        "requests": len(REQUESTS),
    }


def seed_if_empty() -> None:
    """Populate dummy data on first run. A no-op once any user exists."""
    with SessionLocal() as db:
        if not _is_empty(db):
            _log("database already has data — skipping")
            return

        counts = _populate(db)

    summary = ", ".join(f"{count} {name}" for name, count in counts.items())
    _log(f"seeded {summary}")
    _log(f"log in with {DEMO_EMAIL} / {SEED_PASSWORD} (every seeded account shares it)")


if __name__ == "__main__":
    # Allows a manual reseed: `python -m app.seed` from backend/.
    from app.database import init_db

    init_db()
    seed_if_empty()
