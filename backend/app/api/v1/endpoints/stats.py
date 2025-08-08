from fastapi import APIRouter
from app.schemas.common import StatsOut
from app.services.tickets import get_stats

router = APIRouter()

@router.get("/stats", response_model=StatsOut)
async def stats():
    return await get_stats()
