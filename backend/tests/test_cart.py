import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.crud import product  # Update import
from app.schemas.cart import CartItemCreate
from app.schemas.product import ProductCreate  # Add this import

def test_add_to_cart(client: TestClient, test_product, normal_user_token_headers):
    cart_item = {
        "product_id": test_product["id"],
        "quantity": 2
    }

    response = client.post(
        "/api/v1/cart/items",
        headers=normal_user_token_headers,
        json=cart_item
    )
    
    assert response.status_code == 200
    content = response.json()
    assert len(content["items"]) == 1
    assert content["items"][0]["product_id"] == test_product["id"]
    assert content["items"][0]["quantity"] == 2
    assert content["total"] == 199.98