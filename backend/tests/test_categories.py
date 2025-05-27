import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.crud import category
from app.schemas.category import CategoryCreate

def test_create_category(client: TestClient):
    category_data = {"name": "Electronics", "description": "Electronic items"}
    response = client.post("/api/v1/categories/", json=category_data)
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == category_data["name"]
    assert "id" in content