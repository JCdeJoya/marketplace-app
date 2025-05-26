def test_create_order_requires_auth(client, test_product):
    client.cookies.clear()  # removes session/auth cookies
    res = client.post("/api/v1/orders/", json={
        "items": [{"product_id": test_product["id"], "quantity": 2}]  # Use .id instead of ["id"]
    })
    assert res.status_code in [401, 403]


def test_order_history(client, test_product, normal_user_token_headers):
    # Add to cart
    cart_item = {"product_id": test_product["id"], "quantity": 1}
    client.post("/api/v1/cart/items", headers=normal_user_token_headers, json=cart_item)
    # Checkout
    client.post("/api/v1/cart/checkout", headers=normal_user_token_headers)
    # Get order history
    res = client.get("/api/v1/orders/me", headers=normal_user_token_headers)
    assert res.status_code == 200
    orders = res.json()
    assert isinstance(orders, list)
    assert any(order["items"][0]["product_id"] == test_product["id"] for order in orders)
