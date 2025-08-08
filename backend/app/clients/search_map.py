"""
Carrega e mantém um 'mapa' de campos de busca do GLPI, para sabermos
os IDs corretos ao montar queries em /search/Ticket.

Se não conseguir carregar dinamicamente, usa um fallback comum.
"""
from typing import Dict, Any
from app.clients.glpi import glpi_get, close_http as _close_http
from app.utils.logging import setup

log = setup()

_map: Dict[str, Any] | None = None

FALLBACK = {
    # chaves amigáveis → nomes/ids “comuns” em GLPI 9.5/10.x
    "id": "id",
    "status": "status",
    "solvedate": "solvedate",
    "closedate": "closedate",
    "date_mod": "date_mod",
    "assign_tech": "assign_tech",
    "itilcategories_id": "itilcategories_id",
    "users_id_recipient": "users_id_recipient",
    "priority": "priority",
    "urgency": "urgency",
    "impact": "impact",
    "name": "name",
}

async def ensure_loaded():
    global _map
    if _map is not None:
        return _map
    try:
        # Algumas instalações aceitam ?list_search_options=1
        data = await glpi_get("/search/Ticket", params={"list_search_options": "1"})
        # Resultado esperado: {"searchOptions": {"1": {...}, "2": {...}}}
        so = data.get("searchOptions", {})
        by_fieldname: Dict[str, str] = {}
        for k, v in so.items():
            # exemplo v: {"id":2,"name":"ID","field":"glpi_tickets.id"}
            field = (v.get("field") or "").split(".")[-1]
            if field:
                by_fieldname[field] = k  # id numérico da opção
        # Monta nosso mapa amigável
        _map = {}
        for friendly, raw in FALLBACK.items():
            _map[friendly] = by_fieldname.get(raw, raw)  # usa id numérico se achou; senão usa nome bruto
        log.info("Search map carregado dinamicamente com %d campos.", len(_map))
    except Exception as e:
        log.warning("Não foi possível carregar searchOptions do GLPI (%s). Usando FALLBACK.", e)
        _map = FALLBACK.copy()
    return _map

def get_field_id(name: str) -> str:
    if _map is None:
        return FALLBACK.get(name, name)
    return _map.get(name, name)

async def close_http():
    await _close_http()
