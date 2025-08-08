from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints.stats import router as stats_router
from app.api.v1.endpoints.tickets import router as tickets_router
from app.api.v1.endpoints.events import router as events_router
from app.clients.search_map import ensure_loaded, close_http

app = FastAPI(title="GLPI Dashboard API", version="1.0.0")

# CORS
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def _startup():
    await ensure_loaded()

@app.on_event("shutdown")
async def _shutdown():
    await close_http()

# Rotas
app.include_router(stats_router, prefix="/api", tags=["stats"])
app.include_router(tickets_router, prefix="/api", tags=["tickets"])
app.include_router(events_router, prefix="/api", tags=["events"])

@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok"}
