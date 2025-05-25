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

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    orderCount: 0,
    averageOrderValue: 0,
    topProducts: [],
    salesData: {
      labels: [],
      values: []
    }
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setMetrics(data);
    };
    fetchMetrics();
  }, []);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium">Total Sales</h3>
          <p className="text-2xl font-bold">${metrics.totalSales}</p>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium">Sales Trend</h3>
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
    </AdminLayout>
  );
}