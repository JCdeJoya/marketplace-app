from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas import order as order_schemas
from app.crud import order as order_crud
from app.db.session import get_db
from app.api.deps import get_current_user, require_admin
from app.db.models import User

router = APIRouter()

@router.post("/", response_model=order_schemas.OrderOut)
def create_order(order: order_schemas.OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return order_crud.create_order(db, order)

@router.get("/", response_model=List[order_schemas.OrderOut])
def read_orders(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return order_crud.get_orders(db, skip=skip, limit=limit)

@router.get("/me", response_model=List[order_schemas.OrderOut])
def read_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return order_crud.get_orders_by_user(db, user_id=current_user.id)
