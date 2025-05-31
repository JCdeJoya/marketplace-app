# def test_get_products_requires_auth(client):
#     client.cookies.clear()  # removes session/auth cookies
#     res = client.get("/api/v1/products/")
#     assert res.status_code in [401, 403]
#     assert isinstance(res.json(), list)

def test_get_products(client):
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

""" def test_get_product_by_id(client):
    response = client.get("/api/v1/products/1")
    assert response.status_code == 200
    assert "id" in response.json() """

def test_create_product_unauthorized(client):
    product_data = {
        "name": "Test Product",
        "price": 99.99,
        "description": "Test description",
        "category_id": 1
    }
    response = client.post("/api/v1/products", json=product_data)
    assert response.status_code in (401, 403)

""" def test_product_crud_operations(client, admin_token_headers):
    # Create
    product_data = {
        "name": "Test Product",
        "description": "Test Description",
        "price": 99.99,
        "stock": 10,
        "category_id": 1
    }
    
    response = client.post(
        "/api/v1/products/",
        headers=admin_token_headers,
        json=product_data
    )
    assert response.status_code == 200
    product_id = response.json()["id"]
    
    # Read
    response = client.get(f"/api/v1/products/{product_id}")
    assert response.status_code == 200
    assert response.json()["name"] == product_data["name"]
    
    # Update
    update_data = {**product_data, "price": 149.99}
    response = client.put(
        f"/api/v1/products/{product_id}",
        headers=admin_token_headers,
        json=update_data
    )
    assert response.status_code == 200
    assert response.json()["price"] == 149.99
    
    # Delete
    response = client.delete(
        f"/api/v1/products/{product_id}",
        headers=admin_token_headers
    )
    assert response.status_code == 200 """