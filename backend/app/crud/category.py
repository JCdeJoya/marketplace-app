from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.models import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

def create_category(db: Session, category: CategoryCreate) -> Category:
    db_category = Category(
        name=category.name,
        description=category.description
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_categories(db: Session, skip: int = 0, limit: int = 100) -> List[Category]:
    return db.query(Category).offset(skip).limit(limit).all()