'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/types/order';

interface OrderDetailsProps {
    order: Order;
    onClose: () => void;
    onStatusUpdate: (orderId: number, status: OrderStatus, tracking_number?: string) => Promise<void>;
}

export default function OrderDetails({ order, onClose, onStatusUpdate }: OrderDetailsProps) {
    const [status, setStatus] = useState<OrderStatus>(order.status);
    const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onStatusUpdate(order.id, status, trackingNumber);
            onClose();
        } catch (error) {
            console.error('Failed to update order:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium">Customer Information</h3>
                        <p className="mt-1 text-sm text-gray-500">{order.user_email}</p>
                        <p className="mt-1 text-sm text-gray-500">{order.shipping_address}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium">Order Items</h3>
                        <ul className="mt-2 divide-y divide-gray-200">
                            {order.items.map((item) => (
                                <li key={item.id} className="py-3 flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium">{item.product_name}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-3 flex justify-between border-t pt-3">
                            <p className="text-sm font-medium">Total</p>
                            <p className="text-sm font-medium">${order.total_amount.toFixed(2)}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Order Status
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="tracking" className="block text-sm font-medium text-gray-700">
                                Tracking Number
                            </label>
                            <input
                                type="text"
                                id="tracking"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter tracking number"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Order'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}