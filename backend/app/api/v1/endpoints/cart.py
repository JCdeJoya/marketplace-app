from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.schemas.cart import Cart, CartItemCreate
from app.schemas import order as order_schemas
from app.crud import order as order_crud
from app.services.cart import CartService
from app.db.models import User

router = APIRouter()
cart_service = CartService()

@router.get("/", response_model=Cart)
async def get_cart(
    current_user: User = Depends(get_current_user)
):
    return await cart_service.get_cart(current_user.id)

@router.post("/items", response_model=Cart)
async def add_to_cart(
    item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await cart_service.add_item(current_user.id, item, db)

@router.post("/checkout", response_model=order_schemas.OrderOut)
async def checkout(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    cart_service: CartService = Depends()
):
    # Get current cart
    cart = await cart_service.get_cart(current_user.id)
    if not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
        
    # Create order from cart
    order = order_crud.create_order_from_cart(db=db, cart=cart, user_id=current_user.id)
    
    # Clear cart after successful order
    await cart_service.clear_cart(current_user.id)
    
    return order