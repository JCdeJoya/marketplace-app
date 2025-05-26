"use client";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  created_at: string;
  total: number;
  status: string;
  // Add more fields as needed
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/orders/me")
      .then(res => res.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

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
              <div>Total: ${order.total.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}