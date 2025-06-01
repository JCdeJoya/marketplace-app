'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ShippingDetails } from '@/types/checkout';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';
import Loading from '@/components/ui/Loading';

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

    if (loading) return <Loading />;
    if (!cart || cart.items.length === 0) {
        router.push('/cart');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Send shipping details directly without nesting
            await fetchApi('/cart/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    full_name: shippingDetails.full_name,
                    address: shippingDetails.address,
                    city: shippingDetails.city,
                    postal_code: shippingDetails.postal_code,
                    phone: shippingDetails.phone
                }),
            });

            // Clear the local cart after successful order
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
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                <div className="space-y-4">
                    {cart.items.map((item) => (
                        <div key={item.product_id} className="flex justify-between">
                            <div>
                                <span className="font-medium">{item.product.name}</span>
                                <span className="text-gray-500 ml-2">x {item.quantity}</span>
                            </div>
                            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t pt-4 font-medium">
                        <div className="flex justify-between text-lg">
                            <span>Total</span>
                            <span>${cart.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        id="full_name"
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={shippingDetails.full_name}
                        onChange={(e) => setShippingDetails({...shippingDetails, full_name: e.target.value})}
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <input
                        id="address"
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={shippingDetails.address}
                        onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input
                            id="city"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={shippingDetails.city}
                            onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                        />
                    </div>

                    <div>
                        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                            Postal Code
                        </label>
                        <input
                            id="postal_code"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={shippingDetails.postal_code}
                            onChange={(e) => setShippingDetails({...shippingDetails, postal_code: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <input
                        id="phone"
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
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
                    data-testid="place-order"
                >
                    {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
}