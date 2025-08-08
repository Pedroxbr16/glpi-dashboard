import httpx
from typing import Any, Dict
from app.core.config import settings

HEADERS = {
    "App-Token": settings.GLPI_APP_TOKEN,
    "Authorization": f"user_token {settings.GLPI_USER_TOKEN}",
    "Content-Type": "application/json"
}

_http: httpx.AsyncClient | None = None

def get_client() -> httpx.AsyncClient:
    global _http
    if _http is None:
        _http = httpx.AsyncClient(base_url=settings.GLPI_URL, timeout=30.0)
    return _http

async def close_http():
    global _http
    if _http:
        await _http.aclose()
        _http = None

async def glpi_get(path: str, params: Dict[str, Any] | None = None) -> Any:
    c = get_client()
    r = await c.get(path, headers=HEADERS, params=params)
    r.raise_for_status()
    return r.json()

async def glpi_post(path: str, json: Dict[str, Any] | None = None) -> Any:
    c = get_client()
    r = await c.post(path, headers=HEADERS, json=json or {})
    r.raise_for_status()
    return r.json()
