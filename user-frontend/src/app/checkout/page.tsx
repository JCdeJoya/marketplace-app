'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ShippingDetails } from '@/types/checkout';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const { cart, loading, clearCart } = useCart();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        full_name: '',
        address: '',
        city: '',
        postal_code: '',
        phone: '',
    });

    if (loading) return <div>Loading...</div>;
    if (!cart || cart.items.length === 0) {
        router.push('/cart');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Place the order
            await fetchApi('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    shipping_details: shippingDetails,
                }),
            });

            // Clear the cart after successful order
            await clearCart();
            
            toast.success('Order placed successfully!');
            router.push('/orders');
        } catch (error) {
            console.error('Failed to place order:', error);
            toast.error('Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                <div className="space-y-2">
                    {cart.items.map((item) => (
                        <div key={item.product_id} className="flex justify-between">
                            <span>{item.product.name} x {item.quantity}</span>
                            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t pt-2 font-medium">
                        <div className="flex justify-between">
                            <span>Total</span>
                            <span>${cart.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={shippingDetails.full_name}
                        onChange={(e) => setShippingDetails({...shippingDetails, full_name: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={shippingDetails.address}
                        onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={shippingDetails.city}
                            onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={shippingDetails.postal_code}
                            onChange={(e) => setShippingDetails({...shippingDetails, postal_code: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="tel"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={shippingDetails.phone}
                        onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
}