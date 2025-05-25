'use client';

import { useCart } from '@/contexts/CartContext';
import Loading from '@/components/ui/Loading';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cart, loading, removeFromCart, updateQuantity, clearCart } = useCart();
    const router = useRouter();

    if (loading) return <Loading />;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900">Your cart is empty</h2>
                <button
                    onClick={() => router.push('/products')}
                    className="mt-4 text-blue-600 hover:text-blue-500"
                >
                    Continue shopping
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            
            <div className="space-y-4">
                {cart.items.map((item) => (
                    <div key={item.product_id} className="flex items-center space-x-4 border-b pb-4">
                        <div className="flex-shrink-0 w-24 h-24 relative">
                            {item.product.image_url ? (
                                <Image
                                    src={item.product.image_url}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                                    <span className="text-gray-400">No image</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                            <p className="text-gray-500">${item.product.price}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <input
                                type="number"
                                min="1"
                                max={item.product.stock}
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value))}
                                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                                onClick={() => removeFromCart(item.product_id)}
                                className="text-red-600 hover:text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 space-y-4">
                <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>${cart.total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between space-x-4">
                    <button
                        onClick={clearCart}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Clear Cart
                    </button>
                    <button
                        onClick={() => router.push('/checkout')}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}