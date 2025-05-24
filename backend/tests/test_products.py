def test_get_products_requires_auth(client):
    client.cookies.clear()  # removes session/auth cookies
    res = client.get("/api/v1/products/")
    assert res.status_code in [401, 403]
    assert isinstance(res.json(), list)
