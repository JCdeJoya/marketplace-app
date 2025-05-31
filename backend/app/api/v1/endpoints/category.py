from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import crud
from app.db.session import get_db
from app.api.deps import get_current_user, require_admin
from app.schemas.category import Category, CategoryCreate, CategoryUpdate
from app.db.models import User

router = APIRouter()

@router.post("/", response_model=Category)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    # Only admin users should be able to create categories
    return crud.category.create_category(db=db, category=category)

@router.get("/", response_model=List[Category])
def read_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # Public endpoint - no auth required
    categories = crud.category.get_categories(db, skip=skip, limit=limit)
    return categories

# Add update endpoint with admin protection
@router.put("/{category_id}", response_model=Category)
def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    db_category = crud.category.update_category(db=db, category_id=category_id, updates=category)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

# Add delete endpoint with admin protection
@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    if not crud.category.delete_category(db=db, category_id=category_id):
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}