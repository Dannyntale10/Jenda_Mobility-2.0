import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, ArrowRight, Building2, Car, Wifi, Scale, ShieldCheck, Zap, Globe, LayoutDashboard } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-brand-500 selection:text-white overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-brand-500 relative">
               <div className="absolute inset-0 bg-brand-500 blur-sm opacity-50"></div>
               <Hexagon size={32} strokeWidth={2.5} className="relative" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">OmniNexus</span>
          </div>
          <div className="flex items-center gap-6">
             <button onClick={() => navigate('/dashboard')} className="hidden md:block text-slate-400 hover:text-white transition-colors text-sm font-medium">Log In</button>
             <button 
               onClick={() => navigate('/dashboard')}
               className="bg-white text-slate-950 hover:bg-slate-200 px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 flex items-center gap-2 group"
             >
               Launch Console
               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-400 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          v2.5 Now Available with Gemini AI
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          The Operating System for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-blue-400 to-purple-400">Modern Assets</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Unify your Property, Fleet, and Telecom operations into one intelligent command center. Powered by advanced AI to automate billing, maintenance, and compliance.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <button 
             onClick={() => navigate('/dashboard')}
             className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center justify-center gap-2"
          >
            <LayoutDashboard size={20} />
            Enter Dashboard
          </button>
          <button className="px-8 py-4 rounded-xl font-bold text-lg border border-slate-700 hover:border-slate-500 hover:bg-white/5 transition-all text-slate-300">
            View Documentation
          </button>
        </div>
      </section>

      {/* Features Grid (Bento Style) */}
      <section className="px-6 pb-32 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Main Feature - Rental */}
            <div className="md:col-span-2 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-brand-500/30 transition-colors group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Building2 size={120} />
               </div>
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                     <Building2 size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Rental & Short Stays</h3>
                  <p className="text-slate-400 max-w-md">Automated lease generation, tenant tracking, and Airbnb-style booking management with predictive vacancy analysis.</p>
                  
                  <div className="mt-8 flex gap-4">
                     <div className="bg-slate-800/80 px-4 py-2 rounded-lg text-sm border border-white/5">Auto-Invoicing</div>
                     <div className="bg-slate-800/80 px-4 py-2 rounded-lg text-sm border border-white/5">Cleaning Schedulers</div>
                  </div>
               </div>
            </div>

            {/* Feature - Fleet */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 transition-colors relative overflow-hidden group">
               <div className="absolute bottom-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Car size={100} />
               </div>
               <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
                  <Car size={24} />
               </div>
               <h3 className="text-2xl font-bold mb-3">Fleet Ops</h3>
               <p className="text-slate-400">Real-time telematics, maintenance prediction, and driver performance tracking.</p>
            </div>

            {/* Feature - ISP */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-emerald-500/30 transition-colors relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Wifi size={100} />
               </div>
               <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
                  <Wifi size={24} />
               </div>
               <h3 className="text-2xl font-bold mb-3">ISP Billing</h3>
               <p className="text-slate-400">Subscription management with AI-driven plan optimization and automated pruning.</p>
            </div>

            {/* Feature - Legal AI */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900/50 to-brand-900/20 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-brand-500/30 transition-colors flex flex-col md:flex-row items-center gap-8">
               <div className="flex-1">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 text-orange-400">
                     <Scale size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Legal Compliance AI</h3>
                  <p className="text-slate-400">Instant regulatory guidance for East African markets. Draft contracts and check compliance in seconds.</p>
               </div>
               <div className="bg-slate-950 border border-white/10 rounded-xl p-4 max-w-sm w-full shadow-2xl">
                  <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                     <div className="w-2 h-2 rounded-full bg-red-500"></div>
                     <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                     <span className="text-xs text-slate-500 ml-auto">AI Counsel</span>
                  </div>
                  <div className="space-y-2">
                     <div className="bg-slate-800/50 p-2 rounded text-xs text-slate-300">What are the eviction laws for commercial tenants?</div>
                     <div className="bg-brand-900/20 p-2 rounded text-xs text-brand-200 border border-brand-500/20">
                        Commercial eviction requires a 30-day notice under the Landlord and Tenant Act 2022...
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-slate-950">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 opacity-50">
               <Hexagon size={24} />
               <span className="font-semibold">OmniNexus</span>
            </div>
            <div className="text-slate-500 text-sm">
               &copy; 2025 OmniNexus Systems. All rights reserved.
            </div>
            <div className="flex gap-6 text-slate-400">
               <Globe size={20} className="hover:text-white cursor-pointer" />
               <ShieldCheck size={20} className="hover:text-white cursor-pointer" />
               <Zap size={20} className="hover:text-white cursor-pointer" />
            </div>
         </div>
      </footer>
    </div>
  );
};