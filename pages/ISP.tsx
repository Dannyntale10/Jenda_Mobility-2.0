import React from 'react';
import { MOCK_SUBSCRIBERS } from '../constants';
import { Wifi, Server, AlertTriangle, Send } from 'lucide-react';

export const ISP: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white">ISP Subscription Management</h2>
           <p className="text-slate-400">Automated billing, plan management, and usage analytics.</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          New Subscriber
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main List */}
          <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
             <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-white">Active Subscribers</h3>
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">Total: {MOCK_SUBSCRIBERS.length}</span>
             </div>
             <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                    <tr>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Plan</th>
                        <th className="p-4">Usage (GB)</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Last Paid</th>
                        <th className="p-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 text-sm">
                    {MOCK_SUBSCRIBERS.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-700/30">
                            <td className="p-4 font-medium text-white">{sub.name}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs border
                                    ${sub.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                      sub.plan === 'Pro' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                      'bg-slate-500/10 text-slate-400 border-slate-500/20'}
                                `}>{sub.plan}</span>
                            </td>
                            <td className="p-4 text-slate-300">{sub.usage} GB</td>
                            <td className="p-4">
                                <span className={`flex items-center gap-1.5
                                    ${sub.status === 'Active' ? 'text-green-400' :
                                      sub.status === 'Late' ? 'text-red-400' : 'text-slate-500'}
                                `}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Active' ? 'bg-green-400' : sub.status === 'Late' ? 'bg-red-400' : 'bg-slate-500'}`}></span>
                                    {sub.status}
                                </span>
                            </td>
                            <td className="p-4 text-slate-400">{sub.lastPayment}</td>
                            <td className="p-4">
                                <button className="text-slate-400 hover:text-white"><MoreHorizontalIcon /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>

          {/* Sidebar / Actions */}
          <div className="space-y-6">
             {/* Network Status */}
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Server size={18} className="text-brand-400" />
                    Network Health
                </h3>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Uptime (30d)</span>
                    <span className="text-green-400 font-bold">99.98%</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full mb-6 overflow-hidden">
                    <div className="bg-green-500 h-full w-[99.98%]"></div>
                </div>
                
                <h4 className="text-sm font-semibold text-white mb-3">Alerts</h4>
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3">
                    <AlertTriangle className="text-red-400 shrink-0 w-5 h-5" />
                    <div>
                        <p className="text-sm text-red-200 font-medium">High Latency: Zone B</p>
                        <p className="text-xs text-red-300/70 mt-1">Detected 5 mins ago. AI diagnostics running...</p>
                    </div>
                </div>
             </div>

             {/* Auto-Billing Assistant */}
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                 <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Send size={18} className="text-purple-400" />
                    Quick Billing
                 </h3>
                 <p className="text-sm text-slate-400 mb-4">
                    2 customers are late on payments. Send AI-generated reminders?
                 </p>
                 <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Send size={14} />
                    Send Reminders
                 </button>
             </div>
          </div>
      </div>
    </div>
  );
};

const MoreHorizontalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
);