from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from app.services.sse import new_ticket_stream

router = APIRouter()

@router.get("/events")
async def events():
    return EventSourceResponse(new_ticket_stream())
