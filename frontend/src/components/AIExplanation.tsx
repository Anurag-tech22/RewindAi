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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-mono text-signal flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
          AI Investigator
        </h3>
        
        <div className="flex bg-surface p-1 rounded border border-border">
          {['SCIENCE', 'PLANNER', 'CITIZEN'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                mode === m ? 'bg-background text-primary shadow-sm border border-border' : 'text-secondary hover:text-primary'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-surface rounded-lg p-5 border border-border text-sm leading-relaxed text-primary">
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
