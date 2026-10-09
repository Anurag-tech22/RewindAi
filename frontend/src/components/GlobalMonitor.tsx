import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const threats = [
  { id: 1, lat: 25, lng: 75, name: 'Pune Flood Zone', severity: 87, type: 'Flood' },
  { id: 2, lat: 60, lng: 30, name: 'European Heat Dome', severity: 92, type: 'Heat' },
  { id: 3, lat: 35, lng: -115, name: 'California Wildfire', severity: 78, type: 'Fire' },
  { id: 4, lat: 15, lng: -85, name: 'Caribbean Hurricane', severity: 95, type: 'Storm' },
  { id: 5, lat: -25, lng: 135, name: 'Outback Drought', severity: 65, type: 'Drought' }
];

export function GlobalMonitor() {
  const [activeThreat, setActiveThreat] = useState(threats[0]);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex gap-6 p-6">
      {/* Map visualization area */}
      <div className="flex-1 bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl flex items-center justify-center">
        {/* Abstract Grid Map */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        {/* Radar Sweep */}
        <div className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-500/20 z-0 pointer-events-none"
             style={{ top: `${scanLine}%`, transform: 'translateY(-100%)' }}>
          <div className="absolute bottom-0 w-full h-[1px] bg-blue-400/50 shadow-[0_0_8px_#3b82f6]"></div>
        </div>

        {/* Global Nodes */}
        <div className="relative w-full h-full max-w-4xl max-h-[600px] z-10">
          {threats.map((threat) => {
            // Map lat/lng roughly to percentage for abstract display
            const top = `${50 - (threat.lat / 90) * 50}%`;
            const left = `${50 + (threat.lng / 180) * 50}%`;
            const isActive = activeThreat.id === threat.id;

            return (
              <div 
                key={threat.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ top, left }}
                onClick={() => setActiveThreat(threat)}
              >
                <div className="relative flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full z-10 ${isActive ? 'bg-red-500' : 'bg-blue-400'}`}></div>
                  <div className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${isActive ? 'bg-red-500' : 'bg-blue-400'}`}></div>
                  {isActive && <div className="absolute w-12 h-12 rounded-full border border-red-500/50 animate-pulse"></div>}
                  
                  {/* Tooltip */}
                  <div className={`absolute left-6 top-0 bg-slate-800/90 backdrop-blur border border-slate-700 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-all origin-left ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}>
                    <div className="font-bold text-blue-300">{threat.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Severity: {threat.severity}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Coordinates overlay */}
        <div className="absolute bottom-6 left-6 font-mono text-[10px] text-blue-500/70 space-y-1">
          <div>SYS.TRACKING_ACTIVE</div>
          <div>LAT/LNG MAPPING [NOMINAL]</div>
          <div>UPDATED: LIVE</div>
        </div>
      </div>

      {/* Threat Details sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-md border border-white rounded-3xl shadow-sm p-6 flex flex-col">
        <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-6">Threat Analysis Profile</div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeThreat.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 font-black text-xl shadow-inner">
                !
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-800 leading-tight">{activeThreat.name}</h3>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{activeThreat.type} Anomaly</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-500">Threat Severity</span>
                  <span className="text-red-500">{activeThreat.severity}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${activeThreat.severity}%` }} 
                    className="h-full bg-gradient-to-r from-amber-500 to-red-500" 
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Population Exposed</div>
                <div className="text-2xl font-black text-slate-700">1.2M</div>
                <div className="text-xs font-medium text-amber-600 mt-1">↑ High density urban zone</div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Action Recommendation</div>
                <div className="text-sm font-semibold text-blue-800">
                  Deploy Rewind Lab simulation to identify critical infrastructural weaknesses before T-0 impact.
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button className="w-full py-3 mt-6 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
          Load Simulation Profile
        </button>
      </div>
    </div>
  );
}
