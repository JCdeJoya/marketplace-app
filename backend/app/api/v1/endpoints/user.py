from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app import crud, schemas
from app.api.dependencies import get_current_user
from app.db.models import User

router = APIRouter()

@router.post("/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.user.create_user(db=db, user=user)

@router.get("/", response_model=list[schemas.UserOut])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.user.get_users(db, skip=skip, limit=limit)

@router.get("/me", response_model=schemas.UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
