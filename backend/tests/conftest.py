import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="module")
def client():
    return TestClient(app)

@pytest.fixture
def current_timestamp(client):
    import time
    return int(time.time() * 1000)  # milliseconds to avoid reuse

@pytest.fixture
def test_product(client, current_timestamp):
    res = client.post("/api/v1/products/", json={
        "name": f"Product {current_timestamp}",
        "description": "Test Product",
        "price": 10.0,
        "stock": 100
    })
    return res.json()

