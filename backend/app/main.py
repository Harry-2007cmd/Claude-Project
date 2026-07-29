"""FastAPI entrypoint.

The app object, CORS, a health check, DB table creation plus dummy-data seeding
on startup (T2.1/T2.2), and the auth router (T2.3). The community, carpool and
food routers are wired in at T2.4-T2.6. See docs/TASKS.md.
"""

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import router as auth_router
from app.database import init_db
from app.seed import seed_if_empty

load_dotenv()

# CORS is restricted to the frontend origin only (ARCHITECTURE.md Section 7).
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Create the SQLite file and tables, then seed dummy data if it's empty.

    No manual setup step for the owner (D3); re-seeding never duplicates rows.
    """
    init_db()
    seed_if_empty()
    yield


app = FastAPI(title="Campus Connect API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
