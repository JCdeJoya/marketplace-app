from typing import Optional
import json
from fastapi import HTTPException
from redis import Redis
from app.core.config import settings
from app.schemas.cart import Cart, CartItem, CartItemCreate
from app.crud.product import get_product

class CartService:
    def __init__(self):
        self.redis_client = Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=0,
            decode_responses=True
        )
        self.expire_time = 3600 * 24  # 24 hours

    def _get_cart_key(self, user_id: int) -> str:
        return f"cart:{user_id}"

    async def get_cart(self, user_id: int) -> Cart:
        cart_data = self.redis_client.get(self._get_cart_key(user_id))
        if not cart_data:
            return Cart()
        return Cart.parse_raw(cart_data)

    async def add_item(self, user_id: int, item: CartItemCreate, db) -> Cart:
        # Get product details
        product = get_product(db, item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        cart = await self.get_cart(user_id)
        
        # Create new cart item
        new_item = CartItem(
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=product.price
        )

        # Update existing item or add new one
        updated = False
        for cart_item in cart.items:
            if cart_item.product_id == item.product_id:
                cart_item.quantity += item.quantity
                updated = True
                break
        
        if not updated:
            cart.items.append(new_item)

        # Update total
        cart.total = sum(item.quantity * item.unit_price for item in cart.items)

        # Save to Redis
        self.redis_client.set(
            self._get_cart_key(user_id),
            cart.json(),
            ex=self.expire_time
        )

        return cart