from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.api import deps

router = APIRouter()

@router.post("/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    db_user = crud.user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.user.create_user(db=db, user=user)

@router.get("/", response_model=list[schemas.UserOut], dependencies=[Depends(deps.require_admin)])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(deps.get_db)):
    return crud.user.get_users(db, skip=skip, limit=limit)

@router.get("/me", response_model=schemas.UserOut)
def read_current_user(current_user=Depends(deps.get_current_user)):
    return current_user

@router.get("/{user_id}", response_model=schemas.UserOut, dependencies=[Depends(deps.require_admin)])
def read_user(user_id: int, db: Session = Depends(deps.get_db)):
    user = crud.user.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{user_id}", response_model=schemas.UserOut, dependencies=[Depends(deps.require_admin)])
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(deps.get_db)):
    user = crud.user.update_user(db, user_id, user_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}/status", response_model=schemas.UserOut, dependencies=[Depends(deps.require_admin)])
def update_user_status(user_id: int, status: schemas.UserUpdate, db: Session = Depends(deps.get_db)):
    user = crud.user.set_user_active_status(db, user_id, status.is_active)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}", dependencies=[Depends(deps.require_admin)])
def delete_user(user_id: int, db: Session = Depends(deps.get_db)):
    user = crud.user.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}
