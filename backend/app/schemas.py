"""Pydantic request/response models (ARCHITECTURE.md Section 4).

Filled in alongside each router: auth here at T2.3, then community (T2.4),
carpool (T2.5), food (T2.6) and profile (T2.7).

`password_hash` appears in no response model anywhere in this file — that is the
point of having response models at all (ARCHITECTURE.md Section 7).
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

# Matches the frontend's own rule (SignupPage.jsx MIN_PASSWORD_LENGTH).
MIN_PASSWORD_LENGTH = 8


class UserPublic(BaseModel):
    """A user as the API returns them — never includes the password hash."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    department: str | None
    year: int | None
    bio: str | None
    created_at: datetime


class SignupRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=MIN_PASSWORD_LENGTH, max_length=128)
    department: str | None = Field(default=None, max_length=120)
    # 1-4, matching the year options the signup form offers.
    year: int | None = Field(default=None, ge=1, le=4)

    @field_validator("name", "department")
    @classmethod
    def _strip(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        return stripped or None

    @field_validator("name")
    @classmethod
    def _name_required(cls, value: str | None) -> str:
        if not value:
            raise ValueError("Name cannot be blank.")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Signup and login both return the token *and* the user.

    ARCHITECTURE.md Section 4 only promises a JWT from login, but the frontend
    needs the user's name immediately (the navbar renders it), so returning it
    here saves a follow-up GET /auth/me on every login.
    """

    access_token: str
    token_type: str = "bearer"
    user: UserPublic
