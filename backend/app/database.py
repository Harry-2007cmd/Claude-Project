"""SQLite engine, session factory and declarative Base (T2.1).

The DB is auto-created — there are no manual setup steps for the owner
(DECISIONS.md D3). `init_db()` is called on startup from main.py; the seeder
joins it in T2.2.

Note on the SQLite path: DATABASE_URL is `sqlite:///./campus_connect.db`, which
is relative to the *working directory*, so run uvicorn from `backend/` and the
file lands at `backend/campus_connect.db` (already covered by .gitignore).
"""

import os
from collections.abc import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./campus_connect.db")

# SQLite refuses cross-thread connection sharing by default, and FastAPI serves
# requests from a thread pool — so the check has to be relaxed for SQLite only.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, future=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


@event.listens_for(Engine, "connect")
def _enable_sqlite_foreign_keys(dbapi_connection, _connection_record):
    """SQLite ignores FOREIGN KEY constraints unless asked, per connection.

    Without this every FK in models.py would be decorative — a comment could
    reference a post id that doesn't exist.
    """
    if DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


class Base(DeclarativeBase):
    """Declarative base shared by every model in models.py."""


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency — one session per request, always closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create any missing tables. Safe to call on every startup."""
    # Imported here (not at module top) so the mappers are registered before
    # create_all runs, without models.py and database.py importing each other.
    from app import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
