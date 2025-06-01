from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.product import ProductOut

class CartItem(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    product: Optional[ProductOut] = None
    
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)

class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0)

class Cart(BaseModel):
    items: List[CartItem] = []
    total: float = 0