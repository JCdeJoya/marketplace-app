def test_create_order_requires_auth(client, test_product):
    client.cookies.clear()  # removes session/auth cookies
    res = client.post("/api/v1/orders/", json={
        "items": [{"product_id": 1, "quantity": 2}]
    })
    assert res.status_code in [401, 403, 404]


def test_order_history_unauthorized(client, test_product):
    # Add to cart
    cart_item = {"product_id": 1, "quantity": 1}
    client.post("/api/v1/cart/items", json=cart_item)
    # Checkout
    client.post("/api/v1/cart/checkout")
    # Get order history
    res = client.get("/api/v1/orders/me")
    assert res.status_code in (401, 403, 404)
