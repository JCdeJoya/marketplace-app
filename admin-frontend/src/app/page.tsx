'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentOrders from '@/components/dashboard/RecentOrders';
import { fetchApi } from '@/lib/api';
import Loading from '@/components/ui/Loading';
import { Order } from '@/types/order';

interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, ordersData] = await Promise.all([
                    fetchApi('/analytics/stats'),
                    fetchApi('/orders?limit=5')
                ]);
                setStats(statsData);
                setRecentOrders(ordersData);
            } catch (error) {
                // Fallback to dummy data so navigation/UI still works
                setStats({
                    totalOrders: 0,
                    totalRevenue: 0,
                    totalProducts: 0,
                    totalCustomers: 0,
                });
                setRecentOrders([]);
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <Loading />;
    if (!stats) return <div>Loading...</div>;

    const statsCards = [
        {
            name: 'Total Users',
            value: stats.totalCustomers,
            href: '/users',
            icon: (
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" />
                </svg>
            ),
        },
        {
            name: 'Total Orders',
            value: stats.totalOrders,
            href: '/orders',
            icon: (
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
        },
        {
            name: 'Total Products',
            value: stats.totalProducts,
            href: '/products',
            icon: (
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2" />
                </svg>
            ),
        },
        {
            name: 'Total Revenue',
            value: `$${stats.totalRevenue.toFixed(2)}`,
            href: '/orders',
            icon: (
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <StatsCards stats={statsCards} />
                <RecentOrders orders={recentOrders} />
            </div>
        </AdminLayout>
    );
}
