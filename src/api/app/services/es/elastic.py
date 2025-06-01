# /src/api/app/services/es/elastic.py
# Elasticsearch client dependency for FastAPI.

from fastapi import Depends
from elasticsearch import Elasticsearch
from app.config import get_settings


def get_elasticsearch(settings=Depends(get_settings)):
    # Create and return Elasticsearch client
    client = Elasticsearch(settings.elasticsearch_url)
    return client
