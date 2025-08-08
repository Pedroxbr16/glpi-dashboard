from fastapi import APIRouter, Query
from typing import Optional
from app.schemas.common import SearchResponse
from app.services.tickets import list_tickets

router = APIRouter()

@router.get("/tickets", response_model=SearchResponse)
async def tickets(
    status: Optional[str] = Query(None, description="Ex.: 1,2,3"),
    technician_id: Optional[int] = None,
    category_id: Optional[int] = None,
    source: Optional[str] = None,
    date_from: Optional[str] = Query(None, description="YYYY-MM-DD"),
    date_to: Optional[str] = Query(None, description="YYYY-MM-DD"),
    page: int = 1,
    per_page: int = 50
):
    filters = {
        "status": status,
        "technician_id": technician_id,
        "category_id": category_id,
        "source": source,
        "date_from": date_from,
        "date_to": date_to
    }
    return await list_tickets(filters, page, per_page)
