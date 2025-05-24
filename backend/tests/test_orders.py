def test_create_order_requires_auth(client, test_product):
    client.cookies.clear()  # removes session/auth cookies
    res = client.post("/api/v1/orders/", json={
        "items": [{"product_id": test_product["id"], "quantity": 2}]  # Use .id instead of ["id"]
    })
    assert res.status_code in [401, 403]
