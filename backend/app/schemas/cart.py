from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

class CartItem(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    unit_price: float
    
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)

class Cart(BaseModel):
    items: List[CartItem] = []
    total: float = 0