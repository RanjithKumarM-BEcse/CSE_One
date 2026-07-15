#!/bin/sh

# Run database migrations
echo "Running migrations..."
alembic upgrade head

# Start FastAPI server
echo "Starting FastAPI server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000
