"""SQLAlchemy models — the six tables from ARCHITECTURE.md Section 3 (T2.1).

users / posts / comments / carpool_rides / carpool_requests / food_favorites.

Timestamps are stored as **naive UTC**. SQLite has no timezone type and silently
drops tzinfo on write, so an aware value in would come back naive anyway —
normalising on the way in keeps every comparison (e.g. "is this ride in the
past?") between two naive UTC datetimes instead of raising on a mixed pair.
"""

from datetime import UTC, datetime

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

# Request statuses used by carpool_requests.status (ARCHITECTURE.md Section 3).
REQUEST_PENDING = "pending"
REQUEST_ACCEPTED = "accepted"
REQUEST_DECLINED = "declined"

# Ride lifecycle used by carpool_rides.status.
RIDE_ACTIVE = "active"
RIDE_CANCELLED = "cancelled"


def utcnow() -> datetime:
    """Current UTC time as a naive datetime — see the module docstring."""
    return datetime.now(UTC).replace(tzinfo=None)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    # Bcrypt hash only — the plaintext password is never stored or logged
    # (ARCHITECTURE.md Section 7).
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    department: Mapped[str | None] = mapped_column(String(120))
    year: Mapped[int | None] = mapped_column(Integer)
    # Shown on the Profile page, editable via PATCH /auth/me (D15).
    bio: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)

    posts: Mapped[list["Post"]] = relationship(back_populates="author")
    comments: Mapped[list["Comment"]] = relationship(back_populates="author")
    rides: Mapped[list["CarpoolRide"]] = relationship(back_populates="driver")
    requests: Mapped[list["CarpoolRequest"]] = relationship(back_populates="passenger")
    favorites: Mapped[list["FoodFavorite"]] = relationship(back_populates="user")

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"


class Post(Base):
    """A Community question (PRD 3.1). No edit/delete in MVP (D6)."""

    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    department_tag: Mapped[str | None] = mapped_column(String(120), index=True)
    # Indexed because the feed is "newest first" (GET /posts).
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False, index=True
    )

    author: Mapped["User"] = relationship(back_populates="posts")
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="post",
        cascade="all, delete-orphan",
        order_by="Comment.created_at",
    )

    def __repr__(self) -> str:
        return f"<Post id={self.id} title={self.title!r}>"


class Comment(Base):
    """A flat answer on a post — no threading in MVP (D6)."""

    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)

    post: Mapped["Post"] = relationship(back_populates="comments")
    author: Mapped["User"] = relationship(back_populates="comments")

    def __repr__(self) -> str:
        return f"<Comment id={self.id} post_id={self.post_id}>"


class CarpoolRide(Base):
    """A ride offer (PRD 3.2). Coordinates drive the Google Map (D7)."""

    __tablename__ = "carpool_rides"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    driver_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)

    origin_text: Mapped[str] = mapped_column(String(255), nullable=False)
    destination_text: Mapped[str] = mapped_column(String(255), nullable=False)
    origin_lat: Mapped[float] = mapped_column(Float, nullable=False)
    origin_lng: Mapped[float] = mapped_column(Float, nullable=False)
    destination_lat: Mapped[float] = mapped_column(Float, nullable=False)
    destination_lng: Mapped[float] = mapped_column(Float, nullable=False)

    # Indexed because the list endpoint filters on "upcoming" (PRD Section 6).
    departure_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    seats_available: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    notes: Mapped[str | None] = mapped_column(Text)
    # Soft-cancel state the frontend already renders. Not in ARCHITECTURE.md's
    # original table — added here because PRD Section 6 requires a cancelled
    # ride to report itself as cancelled rather than silently vanish.
    status: Mapped[str] = mapped_column(String(20), nullable=False, default=RIDE_ACTIVE)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)

    driver: Mapped["User"] = relationship(back_populates="rides")
    requests: Mapped[list["CarpoolRequest"]] = relationship(
        back_populates="ride",
        cascade="all, delete-orphan",
        order_by="CarpoolRequest.created_at",
    )

    def __repr__(self) -> str:
        return f"<CarpoolRide id={self.id} {self.origin_text!r}->{self.destination_text!r}>"


class CarpoolRequest(Base):
    """A passenger's seat request. Only the ride's driver may change status."""

    __tablename__ = "carpool_requests"
    # One request per passenger per ride — a passenger cannot queue up twice,
    # which is what the frontend's "already requested" state assumes.
    __table_args__ = (
        UniqueConstraint("ride_id", "passenger_id", name="uq_request_ride_passenger"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ride_id: Mapped[int] = mapped_column(
        ForeignKey("carpool_rides.id"), nullable=False, index=True
    )
    passenger_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default=REQUEST_PENDING)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)

    ride: Mapped["CarpoolRide"] = relationship(back_populates="requests")
    passenger: Mapped["User"] = relationship(back_populates="requests")

    def __repr__(self) -> str:
        return f"<CarpoolRequest id={self.id} ride_id={self.ride_id} status={self.status!r}>"


class FoodFavorite(Base):
    """A saved Google place (PRD 3.3)."""

    __tablename__ = "food_favorites"
    # "Duplicate favorite save → prevent duplicate entries" (PRD Section 6) —
    # enforced in the DB, not just in the UI.
    __table_args__ = (UniqueConstraint("user_id", "place_id", name="uq_favorite_user_place"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    place_id: Mapped[str] = mapped_column(String(255), nullable=False)
    place_name: Mapped[str] = mapped_column(String(255), nullable=False)
    # JSON snapshot from the Places proxy, stored as text so a favorite still
    # renders if the place later disappears from the API.
    place_data: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="favorites")

    def __repr__(self) -> str:
        return f"<FoodFavorite id={self.id} place_name={self.place_name!r}>"
