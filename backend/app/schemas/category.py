from typing import Optional
from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int

    model_config = ConfigDict(from_attributes=True)