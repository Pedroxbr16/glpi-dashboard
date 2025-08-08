import time
import threading
from typing import Any, Optional

_lock = threading.Lock()
_store: dict[str, dict[str, Any]] = {}

def get(key: str, ttl: int) -> Optional[Any]:
    with _lock:
        v = _store.get(key)
        if not v:
            return None
        if time.time() - v["ts"] > ttl:
            _store.pop(key, None)
            return None
        return v["data"]

def set(key: str, data: Any) -> Any:
    with _lock:
        _store[key] = {"ts": time.time(), "data": data}
    return data

def clear():
    with _lock:
        _store.clear()
