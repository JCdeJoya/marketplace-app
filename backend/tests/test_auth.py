from fastapi import HTTPException, status
from app.db.models import User
from app.core.security import verify_password

def test_login_fail(client):
    response = client.post("/api/v1/auth/login", data={"username": "fail@test.com", "password": "wrong"})
    assert response.status_code == 401

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

async def authenticate_user(username: str, password: str):
    user = await User.get_by_email(username)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    return user
