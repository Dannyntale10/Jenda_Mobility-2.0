import React, { useState } from 'react';
import { MOCK_PROPERTIES } from '../constants';
import { Home, Calendar, MoreVertical, FileText } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';

export const Rentals: React.FC = () => {
  const [selectedProp, setSelectedProp] = useState<string | null>(null);
  const [draftingLease, setDraftingLease] = useState(false);
  const [generatedLease, setGeneratedLease] = useState<string>('');

  const handleDraftLease = async (propertyName: string, tenant: string) => {
    setDraftingLease(true);
    setGeneratedLease('Generating lease agreement with AI...');
    
    const prompt = `Draft a short, professional rental lease agreement for property "${propertyName}" to tenant "${tenant}". Include clauses for monthly rent payment and maintenance responsibilities.`;
    const response = await generateAIResponse(prompt, "Property Management Context");
    
    setGeneratedLease(response);
    setDraftingLease(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white">Property Management</h2>
           <p className="text-slate-400">Manage long-term rentals and short-stay bookings.</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROPERTIES.map((prop) => (
          <div key={prop.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors group">
            <div className="h-32 bg-slate-700 relative">
               <img 
                 src={`https://picsum.photos/seed/${prop.id}/400/200`} 
                 alt={prop.name} 
                 className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
               />
               <div className="absolute top-3 right-3">
                 <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                   ${prop.status === 'Occupied' ? 'bg-green-500/90 text-white' : 
                     prop.status === 'Vacant' ? 'bg-red-500/90 text-white' : 'bg-amber-500/90 text-white'}
                 `}>
                   {prop.status}
                 </span>
               </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                   <h3 className="font-bold text-white text-lg">{prop.name}</h3>
                   <span className="text-xs text-brand-400 bg-brand-900/30 px-2 py-0.5 rounded border border-brand-500/30">
                     {prop.type}
                   </span>
                </div>
                <button className="text-slate-500 hover:text-white">
                  <MoreVertical size={18} />
                </button>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm text-slate-400">
                  <DollarSignIcon className="w-4 h-4 mr-2 text-slate-500" />
                  <span>${prop.monthlyRevenue}/mo</span>
                </div>
                {prop.tenantName && (
                  <div className="flex items-center text-sm text-slate-400">
                    <UserIcon className="w-4 h-4 mr-2 text-slate-500" />
                    <span>{prop.tenantName}</span>
                  </div>
                )}
                {prop.nextCleaning && (
                   <div className="flex items-center text-sm text-amber-400">
                     <Calendar className="w-4 h-4 mr-2" />
                     <span>Clean: {prop.nextCleaning}</span>
                   </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 flex gap-2">
                 <button 
                    onClick={() => {
                        setSelectedProp(prop.id);
                        handleDraftLease(prop.name, prop.tenantName || "Future Tenant");
                    }}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                 >
                    <FileText size={14} />
                    {prop.type === 'LongTerm' ? 'Lease' : 'Booking'}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Lease Generation Modal (Simplified as inline expansion for demo) */}
      {selectedProp && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-slate-800 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="text-brand-500" />
                    AI Lease Drafter
                 </h3>
                 <button onClick={() => setSelectedProp(null)} className="text-slate-400 hover:text-white"><MoreVertical className="rotate-90" size={24} /></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                 {draftingLease ? (
                   <div className="flex items-center justify-center h-40 gap-3 text-brand-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-400"></div>
                      Generating legal document...
                   </div>
                 ) : (
                   <div className="prose prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed">
                        {generatedLease}
                      </pre>
                   </div>
                 )}
              </div>
              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                 <button onClick={() => setSelectedProp(null)} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
                 <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500">Save & Email</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Simple icons for this component
const DollarSignIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);
const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);