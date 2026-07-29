"""FastAPI entrypoint — Phase 0 (T0.1) skeleton.

Only the app object, CORS and a health check exist so far. Routers from
auth/, community/, carpool/ and food/ are wired in during Phase 2
(T2.3-T2.6), and DB create/seed on startup lands with T2.1/T2.2.
See docs/TASKS.md.
"""

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# CORS is restricted to the frontend origin only (ARCHITECTURE.md Section 7).
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app = FastAPI(title="Campus Connect API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}
