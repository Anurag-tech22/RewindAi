import React, { useState } from 'react';

export function AIExplanation({ state }: { state: any }) {
  const [mode, setMode] = useState<'SCIENCE' | 'PLANNER' | 'CITIZEN'>('SCIENCE');
  
  const explanations = {
    SCIENCE: `Analysis of event sequence reveals a ${state.impact > 50 ? 'nonlinear catastrophic failure' : 'linear degradation'} in localized catchment hydrology. The primary driver is soil saturation exceeding the 95th percentile threshold, precipitating a 3x increase in surface runoff velocity.`,
    PLANNER: `Infrastructure capacity has been exceeded in Sector 4. The current impact rating of ${state.impact.toFixed(1)}% indicates that emergency drainage systems are failing to match the inflow rate. Immediate deployment of mobile pumping units is advised.`,
    CITIZEN: `The water is rising fast because the ground is completely soaked and the drains can't keep up with the heavy rain. It's getting dangerous, so please follow local evacuation orders if you are in a low-lying area.`
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          AI Investigator
        </h3>
        
        <div className="flex bg-white p-1 rounded-lg border border-border/60 shadow-sm">
          {['SCIENCE', 'PLANNER', 'CITIZEN'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${
                mode === m ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100' : 'text-secondary hover:text-primary hover:bg-slate-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white shadow-inner text-sm leading-relaxed text-primary font-medium">
        {explanations[mode]}
      </div>
      
      <div className="mt-4 border-t border-border pt-4">
        <div className="text-[10px] font-mono text-secondary uppercase mb-2">Key Drivers (Modeled)</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-primary">Excessive Rainfall</span>
            <span className="text-danger font-mono">92% match</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-primary">Poor Drainage</span>
            <span className="text-warning font-mono">78% match</span>
          </div>
        </div>
      </div>
    </div>
  );
}
