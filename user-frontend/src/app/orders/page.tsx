'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import { fetchApi } from '@/lib/api';
import Loading from '@/components/ui/Loading';

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
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Order History</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className="space-y-4">
                    {orders.map(order => (
                        <li key={order.id} className="border rounded p-4">
                            <div>Order #{order.id}</div>
                            <div>Date: {new Date(order.created_at).toLocaleString()}</div>
                            <div>Status: {order.status}</div>
                            <div>Total: ${order.total_amount.toFixed(2)}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}