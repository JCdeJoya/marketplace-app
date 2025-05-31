import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.crud import category
from app.schemas.category import CategoryCreate

def test_create_category_unauthorized(client: TestClient):
    category_data = {"name": "Electronics", "description": "Electronic items"}
    response = client.post("/api/v1/categories/", json=category_data)
    assert response.status_code in (401, 403)