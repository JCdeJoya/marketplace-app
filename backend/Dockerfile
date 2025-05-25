FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip && \
    pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

FROM python:3.11-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create non-root user
RUN adduser --disabled-password --no-create-home appuser

# Copy wheels and requirements
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .

# Copy application code
COPY ./app ./app
COPY init_db.py .
COPY .env .

# Install dependencies and set permissions
RUN pip install --no-cache /wheels/* && \
    rm -rf /wheels && \
    chown -R appuser:appuser /app

USER appuser

# Run database initialization and start the application
CMD python init_db.py && uvicorn app.main:app --host 0.0.0.0 --port 8000