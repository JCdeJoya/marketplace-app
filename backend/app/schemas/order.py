from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from .product import ProductOut
from .shipping import ShippingDetails

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
    id: int
    user_id: int
    shipping_full_name: str
    total_price: float
    status: str
    tracking_number: Optional[str] = None
    shipping_address: str
    created_at: datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True

class OrderCreate(OrderBase):
    shipping_details: ShippingDetails
    items: List[OrderItemCreate]

class OrderOut(OrderBase):
    id: int
    created_at: datetime
    items: List[OrderItemOut]
    total_price: float

    model_config = ConfigDict(from_attributes=True)

class OrderUpdate(BaseModel):
    status: str
    tracking_number: str
