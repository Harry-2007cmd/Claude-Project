"""Auth routes (T2.3) — signup, login, and the current-user lookup.

`PATCH /auth/me` and the /profile endpoints arrive in T2.7.
See ARCHITECTURE.md Section 4.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.utils import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models import User
from app.schemas import LoginRequest, SignupRequest, TokenResponse, UserPublic

router = APIRouter(prefix="/auth", tags=["auth"])

# Verified against when an email doesn't exist, so a wrong-email login costs the
# same time as a wrong-password one and can't be used to enumerate accounts.
_DUMMY_HASH = hash_password("dummy-password-for-constant-time-login")


def _normalise_email(email: str) -> str:
    """Emails are matched case-insensitively — SQLite's unique index is not."""
    return email.strip().lower()


def _token_response(user: User) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(user.id),
        user=UserPublic.model_validate(user),
    )


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)) -> TokenResponse:
    """Create an account and return a token, so signup lands straight in the app.

    No `.edu` verification in the MVP — any email is accepted (D4).
    """
    email = _normalise_email(payload.email)

    if db.scalar(select(User).where(User.email == email)) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        name=payload.name,
        email=email,
        password_hash=hash_password(payload.password),
        department=payload.department,
        year=payload.year,
        bio=None,
    )
    db.add(user)

    try:
        db.commit()
    except IntegrityError as exc:
        # Two simultaneous signups with the same email: the unique index is the
        # real guard, the check above just produces the friendlier message.
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        ) from exc

    db.refresh(user)
    return _token_response(user)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    """Exchange email + password for a JWT."""
    user = db.scalar(select(User).where(User.email == _normalise_email(payload.email)))

    # One message for both failure modes — revealing which half was wrong would
    # tell an attacker which emails are registered.
    password_ok = verify_password(payload.password, user.password_hash if user else _DUMMY_HASH)
    if user is None or not password_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return _token_response(user)


@router.get("/me", response_model=UserPublic)
def read_current_user(current_user: User = Depends(get_current_user)) -> User:
    """The signed-in user's own profile."""
    return current_user
