'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart } from '@/types/cart';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    addToCart: (productId: number, quantity: number) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const data = await fetchApi('/cart');
            setCart(data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (productId: number, quantity: number) => {
        try {
            await fetchApi('/cart/items', {
                method: 'POST',
                body: JSON.stringify({ product_id: productId, quantity }),
            });
            await fetchCart();
            toast.success('Added to cart');
        } catch (error) {
            console.error('Failed to add to cart:', error);
            toast.error('Failed to add to cart');
        }
    };

    const removeFromCart = async (productId: number) => {
        try {
            await fetchApi(`/cart/items/${productId}`, { method: 'DELETE' });
            await fetchCart();
            toast.success('Removed from cart');
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            toast.error('Failed to remove from cart');
        }
    };

    const updateQuantity = async (productId: number, quantity: number) => {
        try {
            await fetchApi(`/cart/items/${productId}`, {
                method: 'PUT',
                body: JSON.stringify({ quantity }),
            });
            await fetchCart();
        } catch (error) {
            console.error('Failed to update quantity:', error);
            toast.error('Failed to update quantity');
        }
    };

    const clearCart = async () => {
        try {
            await fetchApi('/cart/clear', { method: 'POST' });
            await fetchCart();
            toast.success('Cart cleared');
        } catch (error) {
            console.error('Failed to clear cart:', error);
            toast.error('Failed to clear cart');
        }
    };

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};