import os
from dotenv import load_dotenv


def setup():
    environment = os.getenv("APP_ENVIRONMENT", "Development")
    if environment == "Production":
        load_dotenv('.env.prod')
    else:
        load_dotenv('.env.local')
