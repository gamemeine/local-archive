FROM python:3.10-slim

WORKDIR /tests

COPY src/api/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt && \
    pip install pytest

COPY tests/ ./tests/
COPY tests/pytest.ini .

CMD ["pytest", "tests/api/integration/test_db_integration.py"]
