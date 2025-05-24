from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.models import Product
from app.schemas.product import ProductCreate
from typing import List

def create_product(db: Session, product: ProductCreate):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Product).offset(skip).limit(limit).all()

def update_product(db: Session, product_id: int, updates: ProductCreate):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    for field, value in updates.dict().items():
        setattr(db_product, field, value)
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    db.delete(db_product)
    db.commit()
    return db_product

def search_products(db: Session, filters: dict) -> List[Product]:
    query = db.query(Product)
    
    if filters.get("query"):
        search = f"%{filters['query']}%"
        query = query.filter(
            or_(
                Product.name.ilike(search),
                Product.description.ilike(search)
            )
        )
    
    if filters.get("category_id"):
        query = query.filter(Product.category_id == filters["category_id"])
    
    if filters.get("min_price"):
        query = query.filter(Product.price >= filters["min_price"])
    
    if filters.get("max_price"):
        query = query.filter(Product.price <= filters["max_price"])
    
    return query.all()
