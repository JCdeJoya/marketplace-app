'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import { fetchApi } from '@/lib/api';
import Loading from '@/components/ui/Loading';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetchApi('/orders');
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div 
                        key={order.id}
                        className="bg-white shadow rounded-lg overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'}`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                    className="text-blue-600 hover:text-blue-500 text-sm"
                                >
                                    {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                                </button>
                            </div>

                            {selectedOrder?.id === order.id && (
                                <div className="mt-4 space-y-4">
                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-medium mb-2">Items</h4>
                                        <div className="space-y-2">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span>{item.product_name} x {item.quantity}</span>
                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
                                        <p className="text-sm text-gray-600">{order.shipping_address}</p>
                                    </div>

                                    {order.tracking_number && (
                                        <div className="border-t pt-4">
                                            <h4 className="text-sm font-medium mb-2">Tracking Number</h4>
                                            <p className="text-sm text-gray-600">{order.tracking_number}</p>
                                        </div>
                                    )}

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Total</span>
                                            <span className="font-medium">${order.total_amount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
}