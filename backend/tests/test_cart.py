import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.crud import product  # Update import
from app.schemas.cart import CartItemCreate
from app.schemas.product import ProductCreate  # Add this import

def test_add_to_cart_unauthorized(client: TestClient, test_product):
    cart_item = {
        "product_id": 1,
        "quantity": 2
    }

    response = client.post(
        "/api/v1/cart/items",
        json=cart_item
    )
    
    assert response.status_code in (401, 403, 404)