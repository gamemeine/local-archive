# Use Python 3.10 or later
FROM python:3.10

# Set the working directory
WORKDIR /app

# Copy dependencies
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENV APP_ENVIRONMENT=Production

# Expose FastAPI port
EXPOSE 8080

# Start the FastAPI application
ENTRYPOINT ["./entrypoint.sh"]
