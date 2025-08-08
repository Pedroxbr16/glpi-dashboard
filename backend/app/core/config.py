from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    GLPI_URL: str = Field(..., description="Base GLPI REST URL, e.g., https://host/apirest.php")
    GLPI_APP_TOKEN: str
    GLPI_USER_TOKEN: str

    CACHE_TTL: int = 15
    POLL_INTERVAL: int = 10
    TIMEZONE: str = "UTC"

    OPEN_STATUSES: str = "1,2,3,4"
    INPROGRESS_STATUSES: str = "2,3,4"

    CORS_ORIGINS: str = "*"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
