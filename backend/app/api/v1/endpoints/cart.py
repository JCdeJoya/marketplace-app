from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.api.deps import get_current_user, get_current_user_optional
from app.schemas.cart import Cart, CartItemCreate, CartItemUpdate
from app.schemas.shipping import ShippingDetails
from app.schemas import order as order_schemas
from app.crud import order as order_crud
from app.services.cart import CartService
from app.db.models import User

router = APIRouter()
cart_service = CartService()

@router.get("/", response_model=Cart)
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else "anonymous"
    return await cart_service.get_cart(user_id, db=db)

@router.post("/items", response_model=Cart)
async def add_to_cart(
    item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else "anonymous"
    return await cart_service.add_item(user_id, item, db)

@router.post("/checkout", response_model=order_schemas.OrderOut)
async def checkout(
    shipping_details: ShippingDetails,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    cart_service: CartService = Depends()
):
    # Get current cart
    cart = await cart_service.get_cart(current_user.id, db=db)
    if not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
        
    # Create order from cart
    order = await order_crud.create_order_from_cart(shipping_details=shipping_details, db=db, cart_service=cart_service, user_id=current_user.id)
    
    # Clear cart after successful order
    await cart_service.clear_cart(current_user.id)
    
    return order

@router.post("/clear")
async def clear_cart(
    current_user: User = Depends(get_current_user),
):
    await cart_service.clear_cart(current_user.id)

@router.put("/items/{product_id}", response_model=Cart)
async def update_cart_item(
    product_id: int,
    update: CartItemUpdate,
    current_user: User = Depends(get_current_user),
):
    return cart_service.update_item_quantity(current_user.id, product_id, update.quantity)