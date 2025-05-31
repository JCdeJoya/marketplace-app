'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import AdminLayout from '@/components/layout/AdminLayout';
import { fetchApi } from '@/lib/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

type SalesData = {
  labels: string[];
  values: number[];
};

type AnalyticsMetrics = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  salesData: SalesData;
};

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    salesData: {
      labels: [],
      values: []
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [statsRes, salesRes] = await Promise.all([
          fetchApi(`/analytics/stats`),
          fetchApi(`/analytics/sales-data`)
        ]);
        const stats = await statsRes.json();
        const salesData = await salesRes.json();
        setMetrics({
          ...stats,
          salesData
        });
      } catch (error) {
        // Fallback to dummy data so navigation/UI still works
        setMetrics({
          totalRevenue: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalCustomers: 0,
          salesData: {
            labels: ['Day 1', 'Day 2', 'Day 3'],
            values: [0, 0, 0]
          }
        });
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Sales</h3>
            <p className="text-2xl font-bold">${metrics.totalRevenue}</p>
            <Line
              data={{
                labels: metrics.salesData.labels,
                datasets: [{
                  label: 'Sales',
                  data: metrics.salesData.values,
                  borderColor: 'rgb(59, 130, 246)',
                  tension: 0.1
                }]
              }}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}