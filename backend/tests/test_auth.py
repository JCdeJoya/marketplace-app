def test_login_fail(client):
    response = client.post("/api/v1/auth/login", data={"username": "fail@test.com", "password": "wrong"})
    assert response.status_code == 400

def test_user_signup_and_login(client, current_timestamp):
    # Signup
    res = client.post("/api/v1/users/", json={
        "email": f"testuser_{current_timestamp}@example.com",
        "full_name": "Test User",
        "password": "testpass123"
    })
    assert res.status_code == 200
    assert res.json()["email"] == f"testuser_{current_timestamp}@example.com"

    # Login
    res = client.post("/api/v1/auth/login", data={
        "username": f"testuser_{current_timestamp}@example.com",
        "password": "testpass123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
