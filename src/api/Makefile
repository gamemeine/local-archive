.PHONY: install run lint test

install:
	@echo "Installing dependencies..."
	pip install -r requirements.txt

run:
	@echo "Starting FastAPI application..."
	uvicorn app.main:app --reload

lint:
	@echo "Running linter..."
	flake8 .

test:
	@echo "Running tests..."
	pytest