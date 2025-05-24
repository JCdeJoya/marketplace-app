def test_create_user(client, current_timestamp):  # client comes from conftest.py
    res = client.post("/api/v1/users/", json={
        "email": f"testuser_{current_timestamp}@example.com",
        "full_name": "Test User",
        "password": "test1234"
    })
    assert res.status_code == 200
