from sqlalchemy.orm import Session
from app.db.models import Order, OrderItem, Product
from app.schemas.order import OrderCreate

def create_order(db: Session, order: OrderCreate):
    db_order = Order()
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
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

def get_orders(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Order).offset(skip).limit(limit).all()

def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()

def get_orders_by_user(db: Session, user_id: int):
    return db.query(Order).filter(Order.user_id == user_id).all()
