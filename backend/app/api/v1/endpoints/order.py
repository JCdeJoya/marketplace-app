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

@router.get("/", response_model=List[order_schemas.OrderBase])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    orders = order_crud.get_orders(db, skip=skip, limit=limit)
    
    # Add user details to order response
    for order in orders:
        order.user_email = order.user.email
    
    return orders

@router.get("/me", response_model=List[order_schemas.OrderOut])
def read_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return order_crud.get_orders_by_user(db, user_id=current_user.id)

@router.put("/{order_id}", response_model=order_schemas.OrderUpdate)
def update_order(
    order_id: int,
    update_data: order_schemas.OrderUpdate,
    db: Session = Depends(get_db)
):
    return order_crud.update_order_status_and_tracking(
        db=db,
        order_id=order_id,
        status=update_data.status,
        tracking_number=update_data.tracking_number
    )

@router.get("/{order_id}", response_model=order_schemas.OrderBase)
def read_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = order_crud.get_order(db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if not current_user.is_admin and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Add user details to order response
    order.user_email = order.user.email
    
    return order
