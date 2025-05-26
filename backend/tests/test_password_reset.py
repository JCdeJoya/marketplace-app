def test_password_reset_flow(client, current_timestamp):
    # Create user
    email = f"resetuser_{current_timestamp}@example.com"
    password = "resetpass123"
    res = client.post("/api/v1/users/", json={
        "email": email,
        "full_name": "Reset User",
        "password": password
    })
    assert res.status_code == 200

    # Request password reset
    res = client.post("/api/v1/password-reset/request", json={"email": email})
    assert res.status_code == 200

    # Generate token (simulate backend logic)
    from app.core.password_reset import generate_reset_token
    token = generate_reset_token(email)

    # Confirm password reset
    res = client.post("/api/v1/password-reset/confirm", json={
        "token": token,
        "new_password": "newpass456"
    })
    assert res.status_code == 200

    # Login with new password
    res = client.post("/api/v1/auth/login", data={
        "username": email,
        "password": "newpass456"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_password_reset_invalid_token(client):
    res = client.post("/api/v1/password-reset/confirm", json={
        "token": "invalidtoken",
        "new_password": "irrelevant"
    })
    assert res.status_code == 400