from datetime import datetime
from typing import Dict, Any, Tuple
from app.core.config import settings
from app.core import cache
from app.clients.glpi import glpi_get
from app.clients.search_map import get_field_id
from app.utils.time import today_range

def _criteria_to_params(criteria: list[Dict[str, str]]) -> Dict[str, str]:
    params: Dict[str, str] = {}
    for i, c in enumerate(criteria):
        for k, v in c.items():
            params[f"criteria[{i}][{k}]"] = v
    return params

def build_search_params(filters: Dict[str, Any], range_header: str = "0-49") -> Dict[str, str]:
    """
    Monta params para /search/Ticket a partir de filtros amigáveis.
    """
    crit: list[Dict[str, str]] = []

    if status := filters.get("status"):
        crit.append({"field": get_field_id("status"), "searchtype": "contains", "value": str(status)})

    if tech := filters.get("technician_id"):
        crit.append({"field": get_field_id("assign_tech"), "searchtype": "equals", "value": str(tech)})

    if cat := filters.get("category_id"):
        crit.append({"field": get_field_id("itilcategories_id"), "searchtype": "equals", "value": str(cat)})

    if src := filters.get("source"):
        # GLPI costuma ter 'source' como campo de ticket
        crit.append({"field": "source", "searchtype": "equals", "value": str(src)})

    if date_from := filters.get("date_from"):
        date_to = filters.get("date_to") or date_from
        # usa date_mod por padrão para intervalo
        crit.append({"field": get_field_id("date_mod"), "searchtype": "contains", "value": f"{date_from}..{date_to}"})

    params = _criteria_to_params(crit)
    params["range"] = range_header
    params["forcedisplay[0]"] = get_field_id("id")
    params["forcedisplay[1]"] = get_field_id("status")
    params["forcedisplay[2]"] = get_field_id("priority")
    params["forcedisplay[3]"] = get_field_id("itilcategories_id")
    params["forcedisplay[4]"] = get_field_id("assign_tech")
    params["forcedisplay[5]"] = get_field_id("users_id_recipient")
    params["forcedisplay[6]"] = get_field_id("date_mod")
    params["forcedisplay[7]"] = get_field_id("solvedate")
    params["forcedisplay[8]"] = get_field_id("closedate")
    params["sort"] = get_field_id("id")
    params["order"] = "DESC"
    return params

async def get_stats() -> Dict[str, int]:
    key = "stats"
    cached = cache.get(key, ttl=settings.CACHE_TTL)
    if cached:
        return cached

    # Abertos
    p_open = build_search_params({"status": settings.OPEN_STATUSES}, range_header="0-0")
    open_data = await glpi_get("/search/Ticket", p_open)
    open_count = int(open_data.get("totalcount", 0))

    # Em atendimento
    p_in = build_search_params({"status": settings.INPROGRESS_STATUSES}, range_header="0-0")
    in_data = await glpi_get("/search/Ticket", p_in)
    in_count = int(in_data.get("totalcount", 0))

    # Resolvidos hoje
    start, end = today_range(settings.TIMEZONE)
    p_today = {
        "criteria[0][field]": get_field_id("solvedate"),
        "criteria[0][searchtype]": "contains",
        "criteria[0][value]": f"{start.isoformat()}..{end.isoformat()}",
        "range": "0-0"
    }
    solved_data = await glpi_get("/search/Ticket", p_today)
    solved_today = int(solved_data.get("totalcount", 0))

    data = {"open": open_count, "in_progress": in_count, "solved_today": solved_today}
    return cache.set(key, data)

async def list_tickets(filters: Dict[str, Any], page: int, per_page: int) -> Dict[str, Any]:
    start = (page - 1) * per_page
    end = (page * per_page) - 1
    params = build_search_params(filters, range_header=f"{start}-{end}")
    return await glpi_get("/search/Ticket", params)

async def latest_ticket_id() -> int:
    params = {"sort": get_field_id("id"), "order": "DESC", "range": "0-0"}
    data = await glpi_get("/search/Ticket", params)
    # alguns GLPI retornam 'data' com linhas e colunas; preferimos pegar 'max id' no payload
    try:
        if isinstance(data, dict) and data.get("data"):
            row = data["data"][0]
            # tenta várias chaves comuns
            return int(row.get("id") or row.get("2") or row.get(get_field_id("id")))
    except Exception:
        pass
    # fallback: tenta /Ticket simples
    d2 = await glpi_get("/Ticket/", {"order": "DESC", "sort": "id", "range": "0-0"})
    if isinstance(d2, list) and d2:
        return int(d2[0]["id"])
    return 0
