import type { StatCard } from '@/types/dashboard';

interface StatsCardsProps {
    stats: StatCard[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {stat.icon}
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                            <a href={stat.href} className="font-medium text-blue-700 hover:text-blue-900">
                                View all
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

type StatCardProps = {
  title: string;
  value: string | number;
};

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}