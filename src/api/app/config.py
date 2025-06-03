# /src/api/app/config.py
# Application configuration: loads environment variables and settings.

import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


def get_env_file():
    # Select environment file based on APP_ENVIRONMENT variable
    env = os.getenv("APP_ENVIRONMENT", "Development")
    if env == "Production":
        return ".env.prod"
    else:
        return ".env.local"


class Settings(BaseSettings):
    # Application settings loaded from environment
    database_url: str
    elasticsearch_url: str
    elasticsearch_index: str = "media_index"
    upload_dir: str = "app/static/uploads"

    model_config = SettingsConfigDict(env_file=get_env_file())


@lru_cache
def get_settings():
    # Cached settings instance
    return Settings()


settings = get_settings()
