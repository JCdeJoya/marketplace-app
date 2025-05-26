from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional

from app import schemas, crud
from app.db.session import get_db
from app.api.deps import get_current_user, require_admin, get_current_user_optional
from app.db.models import User
from app.services.image import ImageService

router = APIRouter()
image_service = ImageService()

@router.post("/", response_model=schemas.ProductOut)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return crud.product.create_product(db, product)

@router.get("/", response_model=list[schemas.ProductOut])
def read_products(
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    return crud.product.get_products(db, skip=skip, limit=limit)

@router.get("/{product_id}", response_model=schemas.ProductOut)
def read_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    db_product = crud.product.get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    updated = crud.product.update_product(db, product_id, product)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    deleted = crud.product.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"detail": "Product deleted"}

@router.get("/search", response_model=List[schemas.ProductOut])
def search_products(
    query: str = None,
    category_id: int = None,
    min_price: float = None,
    max_price: float = None,
    db: Session = Depends(get_db)
):
    filters = {
        "query": query,
        "category_id": category_id,
        "min_price": min_price,
        "max_price": max_price
    }
    return crud.product.search_products(db=db, filters=filters)

@router.post("/{product_id}/image")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Upload product image and create thumbnail"""
    product = crud.product.get(db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    image_url, thumb_url = await image_service.save_image(file)
    
    # Update product with image URLs
    product = crud.product.update(
        db,
        db_obj=product,
        obj_in={"image_url": image_url, "thumbnail_url": thumb_url}
    )
    
    return {"image_url": image_url, "thumbnail_url": thumb_url}
