from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.user import User
from app.schemas.user import PasswordResetRequest, PasswordResetConfirm
from app.crud.password_reset import generate_reset_token, verify_reset_token, send_reset_email
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/password-reset/request")
def password_reset_request(
    data: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        # Don't reveal if email exists
        return {"msg": "If the email exists, a reset link will be sent."}
    token = generate_reset_token(user.email)
    background_tasks.add_task(send_reset_email, user.email, token)
    return {"msg": "If the email exists, a reset link will be sent."}

@router.post("/password-reset/confirm")
def password_reset_confirm(
    data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    email = verify_reset_token(data.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"msg": "Password has been reset"}