'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import { fetchApi } from '@/lib/api';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetchApi('/orders/me');
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                toast.error('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>
            
            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No orders found</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-medium">Order #{order.id}</h2>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(order.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium
                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>

                            <div className="border-t border-gray-200 -mx-6 px-6 py-4">
                                <ul className="divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="py-3 flex justify-between">
                                            <div>
                                                <p className="text-sm font-medium">{item.product_name}</p>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t border-gray-200 -mx-6 px-6 pt-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Total</span>
                                    <span className="font-medium">${order.total_price.toFixed(2)}</span>
                                </div>
                                {order.tracking_number && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Tracking Number: {order.tracking_number}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}