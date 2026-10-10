import { useState } from 'react';
import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function RewindLab({ baseState }: { baseState: any }) {
  const [drainage, setDrainage] = useState(50);
  const [vegetation, setVegetation] = useState(50);
  const [warningTime, setWarningTime] = useState(50);
  
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState<{physical_impact: number, human_exposure: number, exposure_reduction: number} | null>(null);
  
  // Generate mock projection data based on results
  const generateProjectionData = (impact: number, exposure: number) => {
    const data: { time: string, actual?: number, projected?: number, exposure?: number }[] = [];
    for (let i = -12; i <= 24; i += 4) {
      if (i <= 0) {
        // Historical path
        const base = baseState.impact * (Math.pow((i + 16) / 16, 2));
        data.push({ time: i === 0 ? 'T-0' : `T${i}h`, actual: Math.min(100, Math.max(0, base)), projected: undefined, exposure: undefined });
      } else {
        // Projected path
        const attenuation = Math.exp(-i / 12.0);
        data.push({ 
          time: `T+${i}h`, 
          actual: undefined, 
          projected: Math.min(100, Math.max(0, impact * attenuation)),
          exposure: Math.min(100, Math.max(0, exposure * attenuation))
        });
      }
    }
    // Bridge the gap at T=0
    const t0 = data.find(d => d.time === 'T-0');
    if (t0) {
        t0.projected = t0.actual;
        t0.exposure = t0.actual;
    }
    return data;
  };

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drainage_capacity: drainage, vegetation: vegetation, warning_time: warningTime })
      });
      const data = await res.json();
      // Artificial delay for UX
      setTimeout(() => {
        setResults(data);
        setSimulating(false);
      }, 1200);
    } catch (e) {
      console.error(e);
      setSimulating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight mb-2">The Rewind Lab</h2>
          <p className="text-sm font-medium text-secondary">Adjust parameters to simulate an alternative historical timeline.</p>
        </div>
        <div className="text-xs font-bold px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Engine: Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {[
            { label: 'Drainage Capacity', val: drainage, set: setDrainage, desc: 'Infrastructure to handle water runoff' },
            { label: 'Vegetation Coverage', val: vegetation, set: setVegetation, desc: 'Natural water absorption capability' },
            { label: 'Early Warning Time', val: warningTime, set: setWarningTime, desc: 'Advance notice for evacuation (0-48h)' },
          ].map(slider => (
            <div key={slider.label}>
              <div className="flex justify-between items-end mb-3">
                <div>
                  <div className="text-sm font-bold text-primary">{slider.label}</div>
                  <div className="text-xs text-secondary mt-0.5">{slider.desc}</div>
                </div>
                <div className="text-sm font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg">
                  {slider.val}%
                </div>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={slider.val} 
                onChange={(e) => slider.set(Number(e.target.value))}
                className="w-full"
              />
            </div>
          ))}

          <button 
            onClick={handleSimulate}
            disabled={simulating}
            className={`w-full py-4 mt-4 text-sm font-bold tracking-widest uppercase transition-all rounded-xl shadow-lg
              ${simulating ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1 hover:shadow-blue-500/30'}
            `}
          >
            {simulating ? 'Running simulation...' : 'Run Simulation'}
          </button>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-white p-10 flex flex-col justify-center shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10 -translate-y-1/2 translate-x-1/2"></div>
          {!results ? (
            <div className="text-center text-secondary">
              <div className="text-5xl mb-6 opacity-20">◷</div>
              <div className="text-sm font-medium">Awaiting simulation parameters.</div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-8">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Original Event</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-primary">Physical Impact</div>
                </div>
                <div className="text-3xl font-black text-slate-300 line-through">
                  {baseState.impact.toFixed(0)}%
                </div>
                <div className="text-blue-400 text-xl font-bold px-4">→</div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Simulated Event</div>
                  <div className="text-4xl font-black text-blue-600 tracking-tighter">
                    {results.physical_impact.toFixed(0)}<span className="text-xl text-blue-400">%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Original Event</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-amber-500">Human Exposure</div>
                </div>
                <div className="text-4xl font-black text-slate-300 line-through">
                  {baseState.impact.toFixed(0)}%
                </div>
                <div className="text-blue-400 text-2xl font-bold px-4">→</div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">Modeled Counterfactual</div>
                  <div className="text-7xl font-black text-indigo-600 tracking-tighter">
                    {results.human_exposure.toFixed(0)}<span className="text-3xl text-indigo-400">%</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-500 mt-3 bg-emerald-50 inline-block px-3 py-1 rounded-lg">
                    ↓ Risk reduced by {results.exposure_reduction.toFixed(0)} pts
                  </div>
                </div>
              </div>

              {/* Advanced Forecasting Visualization */}
              <div className="mt-8 pt-8 border-t border-border/60">
                <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-6 flex justify-between">
                  <span>Impact Trajectory Projection</span>
                  <span className="text-blue-500">24-Hour Forecast</span>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateProjectionData(results.physical_impact, results.human_exposure)} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExposure" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="actual" stroke="#94a3b8" strokeDasharray="5 5" fill="none" strokeWidth={2} name="Historical" />
                      <Area type="monotone" dataKey="projected" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProjected)" strokeWidth={3} name="Physical Impact" />
                      <Area type="monotone" dataKey="exposure" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorExposure)" strokeWidth={3} name="Human Exposure" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
