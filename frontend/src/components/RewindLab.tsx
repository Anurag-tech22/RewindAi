import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function RewindLab({ baseState }: { baseState: any }) {
  const [drainage, setDrainage] = useState(50);
  const [vegetation, setVegetation] = useState(50);
  const [warningTime, setWarningTime] = useState(50);
  
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState<{physical_impact: number, human_exposure: number, exposure_reduction: number} | null>(null);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const res = await fetch('http://localhost:8000/api/simulate', {
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
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl font-semibold text-primary mb-1">The Rewind Lab</h2>
          <p className="text-sm text-secondary">Adjust parameters to simulate an alternative historical timeline.</p>
        </div>
        <div className="text-xs font-mono px-3 py-1 bg-surface border border-border rounded text-secondary uppercase tracking-widest">
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
              <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-sm font-medium text-primary">{slider.label}</div>
                  <div className="text-[10px] text-secondary">{slider.desc}</div>
                </div>
                <div className="text-xs font-mono bg-surface border border-border px-2 py-1 rounded">
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
            className={`w-full py-3 text-sm font-semibold tracking-widest uppercase transition-colors rounded-lg shadow-sm
              ${simulating ? 'bg-border text-secondary cursor-not-allowed' : 'bg-primary text-background hover:bg-primary/90'}
            `}
          >
            {simulating ? 'Running simulation...' : 'Run Simulation'}
          </button>
        </div>

        <div className="bg-surface rounded-xl border border-border p-8 flex flex-col justify-center">
          {!results ? (
            <div className="text-center text-secondary">
              <div className="text-3xl mb-4">◷</div>
              <div className="text-sm">Awaiting simulation parameters.</div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-secondary mb-1">Original Event</div>
                  <div className="text-xs uppercase tracking-widest text-primary">Physical Impact</div>
                </div>
                <div className="text-2xl font-mono text-secondary line-through opacity-50">
                  {baseState.impact.toFixed(0)}%
                </div>
                <div className="text-secondary text-sm">→</div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-secondary mb-1">Simulated Event</div>
                  <div className="text-3xl font-mono text-primary">
                    {results.physical_impact.toFixed(0)}<span className="text-lg text-secondary">%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-secondary mb-1">Original Event</div>
                  <div className="text-xs uppercase tracking-widest text-warning">Human Exposure</div>
                </div>
                <div className="text-4xl font-mono text-secondary line-through opacity-50">
                  {baseState.impact.toFixed(0)}%
                </div>
                <div className="text-secondary text-xl">→</div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-signal mb-1">Modeled Counterfactual</div>
                  <div className="text-6xl font-mono text-primary">
                    {results.human_exposure.toFixed(0)}<span className="text-3xl text-secondary">%</span>
                  </div>
                  <div className="text-sm text-success mt-2 font-mono">
                    ↓ Risk reduced by {results.exposure_reduction.toFixed(0)} pts
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
