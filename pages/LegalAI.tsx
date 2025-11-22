import React, { useState } from 'react';
import { Scale, FileCheck, Globe, ShieldCheck } from 'lucide-react';
import { fastAnalyze } from '../services/geminiService';

export const LegalAI: React.FC = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConsultation = async () => {
        if(!query) return;
        setLoading(true);
        // Using fastAnalyze for quicker legal compliance checks as requested by "fast AI responses" feature
        const prompt = `As a legal compliance expert for rental and ISP businesses in Uganda/East Africa, answer the following query: ${query}`;
        const response = await fastAnalyze(prompt, "Legal Compliance Module");
        setResult(response);
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Scale size={32} className="text-purple-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Legal & Compliance AI</h2>
                    <p className="text-slate-400">Automated regulatory checks for Rental Agreements and ISP Licensing.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Ask a Compliance Question</label>
                        <textarea 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., What are the tenant eviction notice requirements in Kampala?"
                            className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-brand-500 focus:outline-none resize-none"
                        ></textarea>
                        <div className="mt-4 flex justify-end">
                            <button 
                                onClick={handleConsultation}
                                disabled={loading}
                                className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Analyzing Law...' : 'Consult AI'}
                            </button>
                        </div>
                    </div>

                    {result && (
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <ShieldCheck className="text-green-400" />
                                Legal Advice Summary
                            </h3>
                            <div className="prose prose-invert max-w-none text-slate-300 text-sm">
                                <pre className="whitespace-pre-wrap font-sans">{result}</pre>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500">
                                Disclaimer: This is AI-generated advice. Consult a real lawyer for binding decisions.
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="font-medium text-white mb-4">Quick Templates</h3>
                        <div className="space-y-2">
                            {['Tenant Eviction Notice', 'ISP Service Contract', 'Vehicle Lease Agreement', 'Employee NDA'].map(template => (
                                <button key={template} className="w-full text-left p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm transition-colors flex items-center justify-between group">
                                    {template}
                                    <FileCheck size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                     <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="font-medium text-white mb-4">Regional Compliance</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-400 mb-2">
                            <Globe size={16} />
                            <span>Jurisdiction: <strong>Uganda (Default)</strong></span>
                        </div>
                        <p className="text-xs text-slate-500">
                            The AI is currently optimized for East African rental and telecommunications laws.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};