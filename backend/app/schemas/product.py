from pydantic import BaseModel, ConfigDict
from decimal import Decimal

class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    stock: int
    image_url: str | None = None
    thumbnail_url: str | None = None

class ProductCreate(ProductBase):
    pass

class ProductOut(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
