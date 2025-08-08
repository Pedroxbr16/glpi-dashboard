from pydantic import BaseModel
from typing import Any, List, Dict

class StatsOut(BaseModel):
    open: int
    in_progress: int
    solved_today: int

class SearchResponse(BaseModel):
    totalcount: int | None = None
    count: int | None = None
    content_range: str | None = None
    data: List[Dict[str, Any]] | None = None
