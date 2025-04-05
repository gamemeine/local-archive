#!/bin/bash

echo "Czekam na PostgreSQL (host=db, port=5432)..."

until python -c "import socket; socket.create_connection(('db', 5432), timeout=3)" 2>/dev/null; do
  echo "Baza danych jeszcze nie działa. Czekam 1s..."
  sleep 1
done

echo "Baza danych gotowa! Startuję FastAPI..."

exec uvicorn main:app --host 0.0.0.0 --port 8080
