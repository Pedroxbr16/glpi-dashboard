import asyncio
from sse_starlette.sse import EventSourceResponse
from app.core.config import settings
from app.services.tickets import latest_ticket_id

async def new_ticket_stream():
    last = 0
    while True:
        try:
            current = await latest_ticket_id()
            if current and current != last:
                last = current
                yield {"event": "new_ticket", "data": str(current)}
        except Exception as e:
            yield {"event": "error", "data": str(e)}
        await asyncio.sleep(settings.POLL_INTERVAL)
