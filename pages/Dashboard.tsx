import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { StatCard } from '../components/StatCard';
import { MOCK_ANALYTICS, MOCK_FLEET, MOCK_PROPERTIES, MOCK_SUBSCRIBERS } from '../constants';
import { DollarSign, Activity, AlertTriangle, Users, Sparkles } from 'lucide-react';
import { fastAnalyze } from '../services/geminiService';

export const Dashboard: React.FC = () => {
  // Calculate aggregate stats
  const totalRevenue = MOCK_ANALYTICS.reduce((acc, curr) => acc + curr.revenue, 0);
  const activeFleet = MOCK_FLEET.filter(v => v.status === 'Active').length;
  const maintenanceFleet = MOCK_FLEET.filter(v => v.status === 'Service').length;
  const activeSubscribers = MOCK_SUBSCRIBERS.filter(s => s.status === 'Active').length;
  const occupiedProperties = MOCK_PROPERTIES.filter(p => p.status === 'Occupied').length;

  const [insight, setInsight] = useState("OmniNexus AI has detected an anomaly in March expenses. Costs were 400% higher than average.");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const refreshInsight = async () => {
      setLoadingInsight(true);
      const prompt = "Generate a one-sentence fast insight about the current fleet status and revenue trends.";
      const context = `Revenue: ${totalRevenue}, Active Fleet: ${activeFleet}, Maintenance: ${maintenanceFleet}, Subscribers: ${activeSubscribers}`;
      const result = await fastAnalyze(prompt, context);
      setInsight(result);
      setLoadingInsight(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Annual Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          trend="+12.5%" 
          trendUp={true} 
          icon={DollarSign} 
        />
        <StatCard 
          title="System Health" 
          value="98.2%" 
          trend="Stable" 
          trendUp={true} 
          icon={Activity} 
          colorClass="text-green-500"
        />
        <StatCard 
          title="Fleet Maintenance" 
          value={`${maintenanceFleet} Vehicles`} 
          trend="Needs Attention" 
          trendUp={false} 
          icon={AlertTriangle} 
          colorClass="text-amber-500"
        />
        <StatCard 
          title="Active Subscribers" 
          value={activeSubscribers.toString()} 
          trend="+5 New" 
          trendUp={true} 
          icon={Users} 
          colorClass="text-purple-500"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue & Expense Analytics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ANALYTICS}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Split Pie/Bar */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-6">Asset Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Properties', count: occupiedProperties, total: MOCK_PROPERTIES.length },
                { name: 'Fleet', count: activeFleet, total: MOCK_FLEET.length },
                { name: 'ISP Subs', count: activeSubscribers, total: MOCK_SUBSCRIBERS.length },
              ]} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                 <XAxis type="number" stroke="#94a3b8" />
                 <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                 <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                 <Legend />
                 <Bar dataKey="count" name="Active" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                 <Bar dataKey="total" name="Total Assets" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Quick Actions / AI Insights Teaser */}
      <div className="bg-gradient-to-r from-brand-900/50 to-slate-800 p-6 rounded-xl border border-brand-500/20">
         <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-500/20 rounded-lg">
                <Activity className="text-brand-400" size={24} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-semibold text-white">AI Insight Detected</h3>
                    <button 
                        onClick={refreshInsight} 
                        className="text-xs flex items-center gap-1 text-brand-400 hover:text-brand-300"
                        disabled={loadingInsight}
                    >
                        <Sparkles size={12} /> {loadingInsight ? 'Refreshing...' : 'Refresh Analysis'}
                    </button>
                </div>
                <p className="text-slate-300 mt-1 text-sm max-w-2xl leading-relaxed">
                    {insight}
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};