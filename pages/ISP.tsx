import React, { useState } from 'react';
import { MOCK_SUBSCRIBERS, ISP_PLANS } from '../constants';
import { Wifi, Server, AlertTriangle, Send, MoreHorizontal, Calculator, Sparkles, ArrowRightLeft, CheckCircle, X, Play, Settings, MessageSquare, CalendarClock } from 'lucide-react';
import { Subscriber } from '../types';
import { fastAnalyze } from '../services/geminiService';

// Simulated "Today" date to ensure math aligns with the static mock data (Oct 2023)
// In production, this would be new Date();
const SIMULATED_TODAY = new Date('2023-10-12'); 

export const ISP: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(MOCK_SUBSCRIBERS);
  const [selectedSub, setSelectedSub] = useState<Subscriber | null>(null);
  const [targetPlan, setTargetPlan] = useState<string>('');
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [billingStatus, setBillingStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  
  // SMS Notification State
  const [smsAlert, setSmsAlert] = useState<{ type: 'success' | 'info', message: string } | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  // Mock Billing Cycle Automation
  const runBillingCycle = () => {
    setBillingStatus('processing');
    setTimeout(() => {
      setBillingStatus('done');
      // Mock update: set all Late to Active (simulating payment collection)
      setSubscribers(prev => prev.map(s => s.status === 'Late' ? { ...s, status: 'Active', lastPayment: new Date().toISOString().split('T')[0] } : s));
    }, 2000);
  };

  const openManageModal = (sub: Subscriber) => {
    setSelectedSub(sub);
    setTargetPlan(sub.plan);
    setAiSuggestion('');
  };

  // Helper to calculate proration
  const calculateProration = (sub: Subscriber, targetPlanKey: string) => {
    if (targetPlanKey === sub.plan) return null;
    
    const currentPlan = ISP_PLANS[sub.plan as keyof typeof ISP_PLANS];
    const targetPlanObj = ISP_PLANS[targetPlanKey as keyof typeof ISP_PLANS];
    
    // Cycle Logic
    const lastPaymentDate = new Date(sub.lastPayment);
    const cycleDuration = 30; // days
    const cycleEndDate = new Date(lastPaymentDate);
    cycleEndDate.setDate(lastPaymentDate.getDate() + cycleDuration);
    
    // Time diff
    const diffTime = cycleEndDate.getTime() - SIMULATED_TODAY.getTime();
    let daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) daysRemaining = 0;
    if (daysRemaining > cycleDuration) daysRemaining = cycleDuration;

    // Financials
    const dailyRateOld = currentPlan.price / cycleDuration;
    const dailyRateNew = targetPlanObj.price / cycleDuration;

    const credit = dailyRateOld * daysRemaining;
    const charge = dailyRateNew * daysRemaining;
    const net = charge - credit;

    return {
        daysRemaining,
        credit: credit.toFixed(2),
        charge: charge.toFixed(2),
        net: net.toFixed(2),
        cycleEndDate: cycleEndDate.toLocaleDateString(),
        isUpgrade: net > 0
    };
  };

  const handleAnalyze = async () => {
    if (!selectedSub) return;
    setLoadingAi(true);
    setAiSuggestion('');
    
    const currentPlanDetails = ISP_PLANS[selectedSub.plan as keyof typeof ISP_PLANS];
    
    // Generate financial context for all other plans
    let financialContext = "Proration analysis if changed today:\n";
    Object.keys(ISP_PLANS).forEach(planKey => {
        if (planKey === selectedSub.plan) return;
        const calc = calculateProration(selectedSub, planKey);
        if (calc) {
            financialContext += `- Switch to ${planKey}: Net adjustment ${Number(calc.net) > 0 ? 'Payment of' : 'Credit of'} $${Math.abs(Number(calc.net))} (for ${calc.daysRemaining} days remaining).\n`;
        }
    });

    const prompt = `
      Analyze ISP subscriber usage for: ${selectedSub.name}.
      Current Status: ${selectedSub.status}.
      Current Plan: ${selectedSub.plan} (Limit: ${currentPlanDetails.limit}GB, Price: $${currentPlanDetails.price}).
      Current Usage: ${selectedSub.usage}GB.
      
      Available Plans:
      - Basic: 100GB, $50
      - Pro: 500GB, $120
      - Enterprise: 2000GB, $300
      
      ${financialContext}
      
      Task:
      Recommend the optimal plan. If an upgrade is needed, explicitly mention the prorated cost to pay now. If they are overpaying, suggest downgrade and mention the credit.
      Output a concise 2-sentence recommendation.
    `;

    // Using Fast Analyze (Flash Lite) for quick recommendation
    const response = await fastAnalyze(prompt, "ISP Billing Optimization");
    setAiSuggestion(response);
    setLoadingAi(false);
  };

  const handlePlanChange = () => {
    if (!selectedSub) return;
    setSubscribers(prev => prev.map(s => s.id === selectedSub.id ? { ...s, plan: targetPlan as any } : s));
    setSelectedSub(null);
  };

  const handleSendLateReminders = async () => {
        setProcessingAction('reminders');
        setSmsAlert(null);
        const lateCount = subscribers.filter(s => s.status === 'Late').length;
        if (lateCount === 0) {
             setSmsAlert({ type: 'info', message: "No late subscribers found to notify." });
             setProcessingAction(null);
             return;
        }

        const prompt = "Draft a polite but firm SMS reminder (max 160 chars) for an ISP customer who is late on their payment. Include instructions to pay via mobile money.";
        const message = await fastAnalyze(prompt, "ISP Billing Automation");

        setTimeout(() => {
            setSmsAlert({ type: 'success', message: `Sent to ${lateCount} subscribers: "${message}"` });
            setProcessingAction(null);
        }, 2000);
  };

  const handleReportOutage = async () => {
        setProcessingAction('outage');
        setSmsAlert(null);
        const prompt = "Draft an urgent SMS alert (max 160 chars) regarding a temporary internet service outage in the region due to fiber maintenance. Include estimated resolution time.";
        const message = await fastAnalyze(prompt, "ISP Service Alert");
        
        setTimeout(() => {
             setSmsAlert({ type: 'success', message: `Broadcast sent to all active users: "${message}"` });
             setProcessingAction(null);
        }, 2000);
  };

  const proration = selectedSub && targetPlan ? calculateProration(selectedSub, targetPlan) : null;

  return (
    <div className="space-y-6 relative">
       <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white">ISP Subscription Management</h2>
           <p className="text-slate-400">Automated billing, plan management, and usage analytics.</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          New Subscriber
        </button>
      </div>
      
      {/* SMS Alert Banner */}
      {smsAlert && (
          <div className={`p-4 rounded-lg border flex items-start gap-3 animate-in slide-in-from-top-2 shadow-lg
              ${smsAlert.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}
          `}>
              {smsAlert.type === 'success' ? <CheckCircle className="shrink-0" size={20} /> : <Sparkles className="shrink-0" size={20} />}
              <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1">{smsAlert.type === 'success' ? 'Notifications Sent' : 'Info'}</h4>
                  <p className="text-sm opacity-90">{smsAlert.message}</p>
              </div>
              <button onClick={() => setSmsAlert(null)} className="hover:text-white"><X size={16} /></button>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main List */}
          <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
             <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-white">Active Subscribers</h3>
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">Total: {subscribers.length}</span>
             </div>
             <div className="overflow-auto flex-1">
              <table className="w-full text-left">
                  <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase sticky top-0 z-10 backdrop-blur-md">
                      <tr>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Plan</th>
                          <th className="p-4">Usage (GB)</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Last Paid</th>
                          <th className="p-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700 text-sm">
                      {subscribers.map(sub => (
                          <tr key={sub.id} className="hover:bg-slate-700/30 transition-colors group">
                              <td className="p-4 font-medium text-white">{sub.name}</td>
                              <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs border
                                      ${sub.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                        sub.plan === 'Pro' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'}
                                  `}>{sub.plan}</span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-300 w-12">{sub.usage}</span>
                                  {/* Mini Usage Bar */}
                                  <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${sub.usage > ISP_PLANS[sub.plan as keyof typeof ISP_PLANS].limit ? 'bg-red-500' : 'bg-brand-500'}`}
                                      style={{ width: `${Math.min((sub.usage / ISP_PLANS[sub.plan as keyof typeof ISP_PLANS].limit) * 100, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
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
                              <td className="p-4 text-right">
                                  <button 
                                    onClick={() => openManageModal(sub)}
                                    className="text-slate-400 hover:text-brand-400 transition-colors p-1 rounded hover:bg-slate-700"
                                  >
                                    <Settings size={16} />
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
             </div>
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

             {/* Automated Billing Cycle */}
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                 <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <ArrowRightLeft size={18} className="text-purple-400" />
                    Billing Cycle Automation
                 </h3>
                 <p className="text-sm text-slate-400 mb-4">
                    Current Cycle: <strong>October 2023</strong><br/>
                    Next Run: <strong>Nov 1st</strong>
                 </p>
                 
                 {billingStatus === 'processing' ? (
                   <div className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-3 text-sm text-slate-200 animate-pulse">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      Generating Invoices...
                   </div>
                 ) : billingStatus === 'done' ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3 text-sm text-green-400">
                      <CheckCircle size={16} />
                      <div>
                        <p className="font-bold">Cycle Complete</p>
                        <p className="text-xs opacity-80">5 invoices generated & sent.</p>
                      </div>
                   </div>
                 ) : (
                   <button 
                      onClick={runBillingCycle}
                      className="w-full bg-slate-700 hover:bg-purple-600 hover:text-white text-slate-200 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 group"
                   >
                      <Play size={14} className="group-hover:fill-current" />
                      Run Cycle Now
                   </button>
                 )}
             </div>

             {/* Quick Actions */}
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                 <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Send size={18} className="text-blue-400" />
                    Quick Actions
                 </h3>
                 <button 
                    onClick={handleSendLateReminders}
                    disabled={!!processingAction}
                    className="w-full mb-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                    {processingAction === 'reminders' ? <div className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"/> : <MessageSquare size={14} />}
                    Send Late Reminders
                 </button>
                 <button 
                    onClick={handleReportOutage}
                    disabled={!!processingAction}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                    {processingAction === 'outage' ? <div className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"/> : <AlertTriangle size={14} />}
                    Report Outage
                 </button>
             </div>
          </div>
      </div>

      {/* Subscriber Management Modal */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 w-full max-w-2xl rounded-2xl border border-slate-600 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
             {/* Header */}
             <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                <div>
                  <h3 className="text-xl font-bold text-white">Manage Subscription</h3>
                  <p className="text-slate-400 text-sm">Modifying plan for <span className="text-brand-400">{selectedSub.name}</span></p>
                </div>
                <button onClick={() => setSelectedSub(null)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   
                   {/* Left: Current State & AI */}
                   <div className="space-y-6">
                      <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-700">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Current Usage</h4>
                        <div className="flex justify-between items-end mb-2">
                           <span className="text-2xl font-bold text-white">{selectedSub.usage} <span className="text-sm text-slate-400">GB</span></span>
                           <span className="text-xs text-slate-400">of {ISP_PLANS[selectedSub.plan as keyof typeof ISP_PLANS].limit} GB Limit</span>
                        </div>
                        <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                           <div 
                              className={`h-full rounded-full ${selectedSub.usage > ISP_PLANS[selectedSub.plan as keyof typeof ISP_PLANS].limit ? 'bg-red-500' : 'bg-brand-500'}`} 
                              style={{ width: `${Math.min((selectedSub.usage / ISP_PLANS[selectedSub.plan as keyof typeof ISP_PLANS].limit) * 100, 100)}%` }}
                           />
                        </div>
                      </div>

                      {/* AI Assistant Section */}
                      <div className="bg-gradient-to-br from-purple-900/20 to-slate-800 p-4 rounded-xl border border-purple-500/20">
                         <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                              <Sparkles size={16} />
                              AI Plan Advisor
                            </h4>
                            <button 
                              onClick={handleAnalyze}
                              disabled={loadingAi}
                              className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded transition-colors disabled:opacity-50"
                            >
                              {loadingAi ? 'Thinking...' : 'Analyze Usage'}
                            </button>
                         </div>
                         
                         {aiSuggestion ? (
                           <div className="text-sm text-slate-200 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-purple-500/10 animate-in fade-in">
                             {aiSuggestion}
                           </div>
                         ) : (
                           <div className="text-xs text-slate-500 italic text-center py-2">
                             Click analyze to get recommendation based on usage and proration costs.
                           </div>
                         )}
                      </div>
                   </div>

                   {/* Right: Change Plan & Proration */}
                   <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Change Plan To</label>
                        <div className="space-y-2">
                           {Object.entries(ISP_PLANS).map(([key, plan]) => (
                             <button
                                key={key}
                                onClick={() => setTargetPlan(key)}
                                className={`w-full p-3 rounded-lg border text-left transition-all flex justify-between items-center
                                  ${targetPlan === key 
                                    ? 'bg-brand-600/10 border-brand-500 text-white' 
                                    : 'bg-slate-700/30 border-slate-700 text-slate-400 hover:border-slate-500'}
                                `}
                             >
                                <div>
                                  <div className="font-medium">{key}</div>
                                  <div className="text-xs opacity-70">{plan.limit}GB Limit</div>
                                </div>
                                <div className="font-bold">${plan.price}/mo</div>
                             </button>
                           ))}
                        </div>
                      </div>

                      {/* Proration Calculator */}
                      {targetPlan && targetPlan !== selectedSub.plan && proration && (
                        <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-700 animate-in slide-in-from-top-2">
                           <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
                             <Calculator size={14} />
                             Proration Estimate
                           </h4>
                           
                           <div className="flex items-center justify-between text-xs text-slate-400 mb-3 bg-slate-800/50 p-2 rounded">
                                <span className="flex items-center gap-1"><CalendarClock size={12}/> {proration.daysRemaining} days remaining in cycle</span>
                                <span>Ends: {proration.cycleEndDate}</span>
                           </div>

                           <div className="space-y-2 text-sm border-t border-slate-600/50 pt-2">
                              <div className="flex justify-between text-slate-400">
                                <span>Unused Credit (Old Plan):</span>
                                <span className="text-green-400">-${proration.credit}</span>
                              </div>
                              <div className="flex justify-between text-slate-400">
                                <span>New Plan Charge:</span>
                                <span className="text-white">+${proration.charge}</span>
                              </div>
                              <div className="border-t border-slate-600 my-2 pt-2 flex justify-between font-bold">
                                <span className="text-slate-200">Net Due Now:</span>
                                <span className={Number(proration.net) > 0 ? 'text-white' : 'text-green-400'}>
                                  {Number(proration.net) > 0 ? `+$${proration.net}` : `$${proration.net}`}
                                </span>
                              </div>
                           </div>
                           <p className="text-[10px] text-slate-500 mt-2 text-center">
                             *Calculated based on precise daily rates.
                           </p>
                        </div>
                      )}
                   </div>
                </div>
             </div>

             {/* Footer */}
             <div className="p-6 border-t border-slate-700 bg-slate-900/50 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePlanChange}
                  disabled={!targetPlan || targetPlan === selectedSub.plan}
                  className="bg-brand-600 hover:bg-brand-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-brand-600/20"
                >
                  Confirm Change
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};