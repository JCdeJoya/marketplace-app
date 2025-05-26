from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from fastapi import HTTPException
from app.core.config import settings

SECRET_KEY = settings.SECRET_KEY
RESET_TOKEN_EXPIRES = 3600  # 1 hour

def generate_reset_token(email: str) -> str:
    s = URLSafeTimedSerializer(SECRET_KEY)
    return s.dumps(email, salt="password-reset")

def verify_reset_token(token: str) -> str | None:
    s = URLSafeTimedSerializer(SECRET_KEY)
    try:
        email = s.loads(token, salt="password-reset", max_age=RESET_TOKEN_EXPIRES)
        return email
    except (SignatureExpired, BadSignature):
        return None

def send_reset_email(email: str, token: str):
    # In production, send an actual email!
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    print(f"[DEV] Password reset link for {email}: {reset_link}")