from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    description = Column(String, nullable=True)
    
    # Relationship with products
    products = relationship("Product", back_populates="category")