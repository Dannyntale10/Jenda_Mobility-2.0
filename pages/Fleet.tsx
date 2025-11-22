import React from 'react';
import { MOCK_FLEET } from '../constants';
import { Car, AlertCircle, CheckCircle, Wrench, Fuel } from 'lucide-react';

export const Fleet: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white">Fleet Operations</h2>
           <p className="text-slate-400">Real-time vehicle tracking and maintenance logs.</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2 rounded-lg font-medium transition-colors">
            Maintenance Report
            </button>
            <button className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Add Vehicle
            </button>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-semibold">
               <tr>
                  <th className="p-4 border-b border-slate-700">Vehicle</th>
                  <th className="p-4 border-b border-slate-700">Plate</th>
                  <th className="p-4 border-b border-slate-700">Status</th>
                  <th className="p-4 border-b border-slate-700">Driver</th>
                  <th className="p-4 border-b border-slate-700">Mileage</th>
                  <th className="p-4 border-b border-slate-700">Fuel</th>
                  <th className="p-4 border-b border-slate-700 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
               {MOCK_FLEET.map((vehicle) => (
                 <tr key={vehicle.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4">
                       <div className="flex items-center gap-3">
                          <div className="bg-slate-700 p-2 rounded-lg text-slate-300">
                             <Car size={20} />
                          </div>
                          <span className="font-medium text-white">{vehicle.model}</span>
                       </div>
                    </td>
                    <td className="p-4 text-slate-300 font-mono text-sm">{vehicle.plate}</td>
                    <td className="p-4">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                         ${vehicle.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                           vehicle.status === 'Service' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                           'bg-slate-500/10 text-slate-400 border-slate-500/20'}
                       `}>
                         {vehicle.status === 'Active' && <CheckCircle size={12} className="mr-1" />}
                         {vehicle.status === 'Service' && <Wrench size={12} className="mr-1" />}
                         {vehicle.status === 'Idle' && <AlertCircle size={12} className="mr-1" />}
                         {vehicle.status}
                       </span>
                    </td>
                    <td className="p-4 text-slate-300">{vehicle.driver}</td>
                    <td className="p-4 text-slate-300">{vehicle.mileage.toLocaleString()} km</td>
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                            <Fuel size={14} className={vehicle.fuelLevel < 20 ? 'text-red-400' : 'text-green-400'} />
                            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${vehicle.fuelLevel < 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                                    style={{ width: `${vehicle.fuelLevel}%` }}
                                />
                            </div>
                        </div>
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-brand-400 hover:text-brand-300 text-sm font-medium">Manage</button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <h3 className="font-semibold text-white mb-4">Maintenance Schedule (AI Predicted)</h3>
             <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                   <AlertCircle className="text-amber-500 shrink-0 mt-1" />
                   <div>
                      <h4 className="text-amber-400 font-medium">Toyota HiAce - Brake Check</h4>
                      <p className="text-sm text-slate-400 mt-1">Predicted due in 400km based on current usage patterns.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-700/50 rounded-lg">
                    <CheckCircle className="text-slate-500 shrink-0 mt-1" />
                    <div>
                        <h4 className="text-slate-300 font-medium">Ford Ranger - Oil Change</h4>
                        <p className="text-sm text-slate-500 mt-1">Completed 2 days ago.</p>
                    </div>
                </div>
             </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="font-semibold text-white mb-4">Fleet Map (Simulation)</h3>
              <div className="bg-slate-900 w-full h-64 rounded-lg flex items-center justify-center border border-slate-700 text-slate-500">
                 [Interactive Map Component Placeholder]
              </div>
          </div>
      </div>
    </div>
  );
};