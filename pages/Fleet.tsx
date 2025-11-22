import React, { useState } from 'react';
import { MOCK_FLEET } from '../constants';
import { Car, AlertCircle, CheckCircle, Wrench, Fuel, MapPin, Navigation, Zap, X, MessageSquare, Send, Calendar, Clock } from 'lucide-react';
import { fastAnalyze } from '../services/geminiService';
import { Vehicle } from '../types';

export const Fleet: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [routeInsight, setRouteInsight] = useState('');
  
  // SMS State
  const [sendingSMS, setSendingSMS] = useState(false);
  const [lastSentMessage, setLastSentMessage] = useState<string | null>(null);

  // Maintenance State
  const [checkingMaintenance, setCheckingMaintenance] = useState(false);
  const [maintenanceDueList, setMaintenanceDueList] = useState<string[]>([]); // List of vehicle IDs
  const [maintenanceNotifResult, setMaintenanceNotifResult] = useState<string | null>(null);

  const handleOptimizeRoute = async (vehicle: Vehicle) => {
    setOptimizing(true);
    setRouteInsight('');
    
    // Simulate current time context
    const time = new Date().toLocaleTimeString();
    
    const prompt = `
      Analyze optimal route and traffic conditions for vehicle: ${vehicle.model} (${vehicle.plate}).
      Current Location: ${vehicle.location.address}.
      Status: ${vehicle.status}.
      Fuel Level: ${vehicle.fuelLevel}%.
      Current Time: ${time}.
      
      Task: Predict potential traffic bottlenecks near this location and suggest an optimal route strategy.
      Keep it concise (2-3 sentences).
    `;

    const response = await fastAnalyze(prompt, "Fleet Traffic & Route AI");
    setRouteInsight(response);
    setOptimizing(false);
  };

  const handleSendSMS = async (vehicle: Vehicle) => {
      setSendingSMS(true);
      setLastSentMessage(null);
      
      const prompt = `Draft a concise SMS alert (max 160 chars) for the driver of vehicle ${vehicle.plate} (${vehicle.model}). Current status: ${vehicle.status}. Context: The fleet manager needs to notify them about an immediate action required related to their status (e.g. return to base, maintenance due, or route update).`;
      const message = await fastAnalyze(prompt, "Fleet Management SMS Gateway");
      
      // Simulate network delay
      setTimeout(() => {
          setLastSentMessage(message);
          setSendingSMS(false);
      }, 1500);
  };

  const checkMaintenance = async () => {
    setCheckingMaintenance(true);
    setMaintenanceNotifResult(null);

    // Filter vehicles due for maintenance (Mock logic: within 1000km of next service OR > 6 months since last service)
    const dueVehicles = MOCK_FLEET.filter(v => {
        const mileageDue = v.mileage >= (v.nextServiceMileage - 1000);
        const lastService = new Date(v.lastServiceDate).getTime();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const timeDue = lastService < sixMonthsAgo.getTime();
        return mileageDue || timeDue;
    });

    setMaintenanceDueList(dueVehicles.map(v => v.id));

    if (dueVehicles.length > 0) {
        // Generate Bulk SMS content via AI for the first vehicle as a template
        const templatePrompt = `Draft a standard maintenance reminder SMS for a driver. Vehicle: [Model] ([Plate]). Reason: Mileage/Time limit reached. Instruction: Book service within 48hrs.`;
        const smsTemplate = await fastAnalyze(templatePrompt, "Fleet Maintenance System");
        
        // Simulate sending to all
        setTimeout(() => {
            setMaintenanceNotifResult(`Sent ${dueVehicles.length} automated SMS reminders. Template: "${smsTemplate}"`);
            setCheckingMaintenance(false);
        }, 2000);
    } else {
        setMaintenanceNotifResult("All vehicles are within healthy service intervals.");
        setCheckingMaintenance(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white">Fleet Operations</h2>
           <p className="text-slate-400">Real-time vehicle tracking and maintenance logs.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={checkMaintenance}
                disabled={checkingMaintenance}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                {checkingMaintenance ? (
                    <div className="animate-spin w-4 h-4 border-2 border-slate-400 border-t-white rounded-full"></div>
                ) : (
                    <Wrench size={18} className="text-amber-400" />
                )}
                Run Maintenance Check
            </button>
            <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Add Vehicle
            </button>
        </div>
      </div>

      {/* Maintenance Notification Result Banner */}
      {maintenanceNotifResult && (
          <div className="bg-slate-800 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="p-1 bg-amber-500/20 rounded-full text-amber-500">
                  <CheckCircle size={20} />
              </div>
              <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Maintenance Scheduler Report</h4>
                  <p className="text-slate-300 text-sm mt-1">{maintenanceNotifResult}</p>
              </div>
              <button onClick={() => setMaintenanceNotifResult(null)} className="text-slate-400 hover:text-white"><X size={16} /></button>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle List */}
          <div className="lg:col-span-1 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col max-h-[600px]">
             <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                <h3 className="font-semibold text-white">Active Vehicles</h3>
                <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-400">{MOCK_FLEET.length} Units</span>
             </div>
             <div className="overflow-y-auto flex-1">
                 {MOCK_FLEET.map(vehicle => {
                    const isDue = maintenanceDueList.includes(vehicle.id);
                    return (
                        <div 
                            key={vehicle.id} 
                            onClick={() => { setSelectedVehicle(vehicle); setRouteInsight(''); setLastSentMessage(null); }}
                            className={`p-4 border-b border-slate-700 cursor-pointer transition-colors hover:bg-slate-700/50 flex items-start gap-3 relative
                                ${selectedVehicle?.id === vehicle.id ? 'bg-slate-700/50 border-l-4 border-l-brand-500' : 'border-l-4 border-l-transparent'}
                            `}
                        >
                            {isDue && (
                                <div className="absolute top-2 right-2 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </div>
                            )}
                            <div className={`p-2 rounded-lg shrink-0 ${vehicle.status === 'Active' ? 'bg-green-500/20 text-green-400' : vehicle.status === 'Service' ? 'bg-red-500/20 text-red-400' : 'bg-slate-600/20 text-slate-400'}`}>
                                <Car size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-white truncate">{vehicle.model}</h4>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${vehicle.status === 'Active' ? 'border-green-500/30 text-green-400' : 'border-slate-500/30 text-slate-400'}`}>
                                        {vehicle.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 font-mono mt-1">{vehicle.plate}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><MapPin size={10} /> {vehicle.location.address.split(',')[0]}</span>
                                    {isDue && <span className="text-amber-400 font-bold flex items-center gap-1"><Wrench size={10} /> Service Due</span>}
                                </div>
                            </div>
                        </div>
                    );
                 })}
             </div>
          </div>

          {/* Interactive Map & AI Panel */}
          <div className="lg:col-span-2 space-y-6">
              {/* Map Visualization */}
              <div className="bg-slate-900 rounded-xl border border-slate-700 h-[400px] relative overflow-hidden group">
                  {/* Faux Map Background - Styled to look like a dark mode map */}
                  <div className="absolute inset-0 bg-[#0f172a] opacity-80" 
                       style={{ 
                           backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', 
                           backgroundSize: '20px 20px' 
                       }}>
                  </div>
                  {/* Decorative Map Lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 200 Q 150 100 250 200 T 450 200" stroke="#38bdf8" strokeWidth="2" fill="none" />
                      <path d="M100 50 Q 100 250 300 350" stroke="#38bdf8" strokeWidth="2" fill="none" />
                      <path d="M300 50 L 300 400" stroke="#38bdf8" strokeWidth="1" fill="none" strokeDasharray="5,5" />
                  </svg>
                  
                  {/* Markers */}
                  {MOCK_FLEET.map(vehicle => (
                      <button
                        key={vehicle.id}
                        onClick={() => { setSelectedVehicle(vehicle); setRouteInsight(''); setLastSentMessage(null); }}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group/marker
                            ${selectedVehicle?.id === vehicle.id ? 'z-20 scale-125' : 'z-10 hover:scale-110'}
                        `}
                        style={{ top: `${vehicle.location.lat}%`, left: `${vehicle.location.lng}%` }}
                      >
                          <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 
                              ${maintenanceDueList.includes(vehicle.id) ? 'bg-amber-900 border-amber-500 text-amber-500 animate-pulse' :
                                vehicle.status === 'Active' ? 'bg-slate-900 border-green-500 text-green-500' : 
                                vehicle.status === 'Service' ? 'bg-slate-900 border-red-500 text-red-500' : 
                                'bg-slate-900 border-slate-500 text-slate-500'}
                          `}>
                              <Car size={14} />
                              {selectedVehicle?.id === vehicle.id && (
                                  <span className="absolute -bottom-1 w-2 h-2 rotate-45 bg-inherit border-r border-b border-inherit"></span>
                              )}
                          </div>
                          {/* Tooltip */}
                          <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-slate-600 opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none`}>
                              {vehicle.plate} {maintenanceDueList.includes(vehicle.id) ? '(Service Due)' : ''}
                          </div>
                      </button>
                  ))}

                  <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur border border-slate-600 rounded-lg p-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Active</div>
                      <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Service Due</div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> In Service</div>
                  </div>
              </div>

              {/* Vehicle Detail / AI Route Optimizer */}
              {selectedVehicle ? (
                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 animate-in slide-in-from-bottom-2">
                      <div className="flex justify-between items-start mb-6">
                          <div>
                              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                  {selectedVehicle.model} 
                                  <span className="text-base font-normal text-slate-400">({selectedVehicle.plate})</span>
                              </h3>
                              <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                  <MapPin size={14} className="text-brand-400" />
                                  Currently at {selectedVehicle.location.address}
                              </p>
                          </div>
                          <button onClick={() => setSelectedVehicle(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                           <div className="space-y-6">
                                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                                    <div className="text-xs text-slate-400 uppercase font-semibold mb-3 flex items-center gap-2">
                                        <Wrench size={14} /> Service Status
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-300">Odometer</span>
                                            <span className="text-sm text-white font-mono">{selectedVehicle.mileage.toLocaleString()} km</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-300">Next Service</span>
                                            <span className={`text-sm font-mono ${selectedVehicle.mileage >= selectedVehicle.nextServiceMileage ? 'text-amber-400 font-bold' : 'text-slate-200'}`}>
                                                {selectedVehicle.nextServiceMileage.toLocaleString()} km
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${selectedVehicle.mileage >= selectedVehicle.nextServiceMileage ? 'bg-amber-500' : 'bg-brand-500'}`} 
                                                style={{ width: `${Math.min((selectedVehicle.mileage / selectedVehicle.nextServiceMileage) * 100, 100)}%`}}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-600/50">
                                            <span className="text-sm text-slate-300 flex items-center gap-1"><Calendar size={12}/> Last Service</span>
                                            <span className="text-sm text-slate-400">{selectedVehicle.lastServiceDate}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                                    <div className="text-xs text-slate-400 uppercase font-semibold mb-2 flex items-center gap-2">
                                        <MessageSquare size={14} /> Driver Communication
                                    </div>
                                    <p className="text-xs text-slate-400 mb-3">Send automated alerts based on vehicle status.</p>
                                    
                                    {!lastSentMessage ? (
                                        <button 
                                            onClick={() => handleSendSMS(selectedVehicle)}
                                            disabled={sendingSMS}
                                            className="w-full bg-slate-600 hover:bg-slate-500 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {sendingSMS ? (
                                                <><div className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"></div> Sending Alert...</>
                                            ) : (
                                                <><Send size={14} /> Send {selectedVehicle.status === 'Service' ? 'Maintenance' : 'Status'} Alert</>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                                            <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-1">
                                                <CheckCircle size={12} /> SMS Sent
                                            </div>
                                            <p className="text-xs text-slate-300 italic">"{lastSentMessage}"</p>
                                        </div>
                                    )}
                                </div>
                           </div>

                           <div className="bg-gradient-to-br from-brand-900/20 to-slate-800 rounded-lg p-4 border border-brand-500/20 relative overflow-hidden">
                               <div className="text-xs text-brand-300 uppercase font-semibold mb-2 flex items-center gap-2">
                                   <Zap size={14} /> AI Route Optimizer
                               </div>
                               {!routeInsight ? (
                                   <div className="h-40 flex flex-col items-center justify-center text-center">
                                       <p className="text-xs text-slate-400 mb-3">Predict traffic & optimize path.</p>
                                       <button 
                                            onClick={() => handleOptimizeRoute(selectedVehicle)}
                                            disabled={optimizing}
                                            className="bg-brand-600 hover:bg-brand-500 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                                       >
                                            {optimizing ? (
                                                <><div className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"></div> Analyzing...</>
                                            ) : (
                                                <><Navigation size={14} /> Find Optimal Route</>
                                            )}
                                       </button>
                                   </div>
                               ) : (
                                   <div className="animate-in fade-in">
                                       <p className="text-sm text-white leading-relaxed">{routeInsight}</p>
                                       <button 
                                          onClick={() => setRouteInsight('')}
                                          className="text-[10px] text-brand-400 hover:text-brand-300 mt-2 underline"
                                       >
                                           Clear Analysis
                                       </button>
                                   </div>
                               )}
                           </div>
                      </div>
                  </div>
              ) : (
                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center flex flex-col items-center justify-center h-[200px] text-slate-400">
                      <Car size={48} className="mb-4 opacity-20" />
                      <p>Select a vehicle on the map or list to view live details and optimize routes.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};