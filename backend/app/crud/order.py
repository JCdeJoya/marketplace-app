from sqlalchemy.orm import Session, joinedload
from app.db.models import Order, OrderItem, Product
from app.schemas.order import OrderCreate
from app.schemas.shipping import ShippingDetails
from app.services.cart import CartService
from fastapi import HTTPException
from typing import List, Optional


async def create_order_from_cart(shipping_details: ShippingDetails, db: Session, user_id: int, cart_service: CartService):
    cart = await cart_service.get_cart(user_id, db=db)
    
    db_order = Order(
        user_id=user_id,

        shipping_full_name=shipping_details.full_name,
        shipping_address=shipping_details.address,
        shipping_city=shipping_details.city,
        shipping_postal_code=shipping_details.postal_code,
        shipping_phone=shipping_details.phone,
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in cart.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise ValueError(f"Product with ID {item.product_id} not found.")
        
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=product.price,
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session, skip: int = 0, limit: int = 100) -> List[Order]:
    return db.query(Order)\
        .options(
            joinedload(Order.user),
            joinedload(Order.items)
        )\
        .order_by(Order.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_order(db: Session, order_id: int) -> Optional[Order]:
    return db.query(Order)\
        .options(
            joinedload(Order.user),
            joinedload(Order.items)
        )\
        .filter(Order.id == order_id)\
        .first()

def get_orders_by_user(db: Session, user_id: int):
    return db.query(Order).filter(Order.user_id == user_id).all()

def update_order_status_and_tracking(
    db: Session,
    order_id: int,
    status: str,
    tracking_number: str
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status
    order.tracking_number = tracking_number

    db.commit()
    db.refresh(order)
    return order