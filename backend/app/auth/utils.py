"""Password hashing, JWT create/verify, and the current-user dependency.

The hashing half landed early with T2.2, because `seed.py` needs to write real
bcrypt hashes for its dummy users; the JWT half is T2.3.

Passwords are hashed with bcrypt via passlib and never stored or logged in
plaintext. JWT_SECRET_KEY lives only in backend/.env and never reaches the
frontend (ARCHITECTURE.md Section 7, DECISIONS.md D4).
"""

import logging
import os
from datetime import UTC, datetime, timedelta

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

# passlib 1.7.4 tries to read `bcrypt.__about__.__version__`, which modern
# bcrypt no longer exposes. It handles the failure fine but logs the traceback
# at WARNING on first use, which looks like a crash in the server output.
logging.getLogger("passlib.handlers.bcrypt").setLevel(logging.ERROR)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# bcrypt hashes at most 72 bytes and errors on anything longer, so both hashing
# and verification truncate identically — otherwise a long password would 500 on
# signup instead of simply working.
BCRYPT_MAX_BYTES = 72


def _clamp(password: str) -> bytes:
    return password.encode("utf-8")[:BCRYPT_MAX_BYTES]


def hash_password(password: str) -> str:
    """Return a bcrypt hash of `password`."""
    return pwd_context.hash(_clamp(password))


def verify_password(password: str, password_hash: str) -> bool:
    """Check `password` against a stored bcrypt hash."""
    return pwd_context.verify(_clamp(password), password_hash)


# --------------------------------------------------------------------------
# JWT (T2.3)
# --------------------------------------------------------------------------

load_dotenv()

# The placeholder that ships in backend/.env. Signing works with it, so local
# development is never blocked, but it is not a secret and is warned about.
_PLACEHOLDER_SECRET = "PASTE_YOUR_JWT_SECRET_HERE"

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", _PLACEHOLDER_SECRET)
JWT_ALGORITHM = "HS256"
# A week — long enough that a student isn't logged out mid-project, short enough
# that a leaked token expires. There is no refresh-token flow in the MVP.
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

if JWT_SECRET_KEY == _PLACEHOLDER_SECRET:
    logging.getLogger(__name__).warning(
        "JWT_SECRET_KEY is still the placeholder in backend/.env — tokens are "
        "signed with a publicly known value. Generate one with:\n"
        '    python -c "import secrets; print(secrets.token_urlsafe(32))"\n'
        "and paste it into backend/.env before this goes anywhere real."
    )

# Swagger renders this as an "Authorize" button that takes a pasted token, which
# matches how the frontend authenticates: `Authorization: Bearer <JWT>`.
# (OAuth2PasswordBearer would give Swagger a username/password form, which does
# not fit our JSON login body.)
bearer_scheme = HTTPBearer(auto_error=False)

CREDENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials.",
    headers={"WWW-Authenticate": "Bearer"},
)


def create_access_token(user_id: int) -> str:
    """Sign a JWT whose subject is the user's id."""
    expires_at = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # `sub` must be a string per the JWT spec, and python-jose enforces it.
    payload = {"sub": str(user_id), "exp": expires_at}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> int:
    """Return the user id from a valid token, or raise 401."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        subject = payload.get("sub")
        if subject is None:
            raise CREDENTIALS_EXCEPTION
        return int(subject)
    except (JWTError, ValueError) as exc:
        # Covers a bad signature, an expired token, and a non-numeric subject.
        raise CREDENTIALS_EXCEPTION from exc


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Dependency for every authenticated endpoint.

    Resolves the bearer token to a live User row — a token for a user who no
    longer exists is rejected rather than trusted.
    """
    if credentials is None:
        raise CREDENTIALS_EXCEPTION

    user_id = decode_access_token(credentials.credentials)
    user = db.get(User, user_id)
    if user is None:
        raise CREDENTIALS_EXCEPTION
    return user
