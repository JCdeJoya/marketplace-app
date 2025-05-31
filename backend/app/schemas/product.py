from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    stock: int
    image_url: str | None = None
    thumbnail_url: str | None = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    thumbnail_url: Optional[str] = None

class ProductOut(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
