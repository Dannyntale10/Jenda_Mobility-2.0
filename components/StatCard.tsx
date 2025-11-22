import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon: Icon, colorClass = "text-brand-500" }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className={`p-2 bg-slate-700/50 rounded-lg ${colorClass}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend && (
          <div className={`text-xs font-semibold px-2 py-1 rounded ${trendUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};