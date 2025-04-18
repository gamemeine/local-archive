import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

UPLOAD_DIR = "app/static/uploads"


def get_env_file():
    env = os.getenv("APP_ENVIRONMENT", "Development")
    if env == "Production":
        return ".env.prod"
    else:
        return ".env.local"


class Settings(BaseSettings):
    database_url: str
    elasticsearch_url: str

    model_config = SettingsConfigDict(env_file=get_env_file())


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
