from fastapi import APIRouter
from app.api.v1.endpoints import user, auth, product, order, cart, category

api_router = APIRouter()
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(product.router, prefix="/products", tags=["products"])
api_router.include_router(order.router, prefix="/orders", tags=["orders"])
api_router.include_router(cart.router, prefix="/cart", tags=["cart"])
api_router.include_router(category.router, prefix="/category", tags=["category"])