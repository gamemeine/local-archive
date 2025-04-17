from fastapi import Depends
from elasticsearch import Elasticsearch
from app.config import get_settings


def get_elasticsearch(settings=Depends(get_settings)):
    client = Elasticsearch(settings.elasticsearch_url)
    return client
