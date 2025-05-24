from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from .product import ProductOut

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemOut(OrderItemBase):
    id: int
    product: Optional["ProductOut"]  # Import this from product schemas if needed

    model_config = ConfigDict(from_attributes=True)

class OrderBase(BaseModel):
    status: Optional[str] = "pending"

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderOut(OrderBase):
    id: int
    created_at: datetime
    items: List[OrderItemOut]
    total_price: float

    model_config = ConfigDict(from_attributes=True)
