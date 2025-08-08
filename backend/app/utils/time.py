from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

def today_range(tz_name: str):
    tz = ZoneInfo(tz_name)
    now = datetime.now(tz)
    start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end = start + timedelta(days=1)
    return start, end
