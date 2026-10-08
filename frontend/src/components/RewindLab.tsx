import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function RewindLab({ baseState }: { baseState: any }) {
  const [drainage, setDrainage] = useState(0);
  const [vegetation, setVegetation] = useState(0);
  const [warningTime, setWarningTime] = useState(0);
  
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSimulate = async () => {
    setSimulating(true);
    setResults(null);
    
    try {
      const res = await fetch('http://localhost:8000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drainage_capacity: drainage,
          vegetation: vegetation,
          warning_time: warningTime
        })
      });
      const data = await res.json();
      
      // Artificial delay for dramatic effect
      setTimeout(() => {
        setResults(data);
        setSimulating(false);
      }, 1500);
      
    } catch (e) {
      console.error(e);
      setSimulating(false);
    }
  };

  return (
    <div className="bg-surface border border-border p-6 flex flex-col md:flex-row gap-8">
      {/* Controls */}
      <div className="flex-1 space-y-6">
        <div className="text-xs font-semibold tracking-widest uppercase text-signal mb-2">Rewind Lab</div>
        
        <div className="space-y-6 max-w-sm">
          <div>
            <div className="flex justify-between text-sm mb-2 font-mono">
              <span className="text-secondary">Improve Drains by</span>
              <span className="text-primary">+{drainage}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={drainage} 
              onChange={(e) => setDrainage(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2 font-mono">
              <span className="text-secondary">Add Greenery by</span>
              <span className="text-primary">+{vegetation}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={vegetation} 
              onChange={(e) => setVegetation(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2 font-mono">
              <span className="text-secondary">Earlier Warning Time</span>
              <span className="text-primary">+{warningTime}h</span>
            </div>
            <input 
              type="range" min="0" max="48" step="2" value={warningTime} 
              onChange={(e) => setWarningTime(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <button 
            onClick={handleSimulate}
            disabled={simulating}
            className={`w-full py-3 text-sm font-semibold tracking-widest uppercase transition-colors rounded-lg shadow-sm
              ${simulating ? 'bg-border text-secondary cursor-not-allowed' : 'bg-primary text-background hover:bg-primary/90'}
            `}
          >
            {simulating ? 'Simulating...' : 'Run simulation'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 border-l border-border pl-8 flex flex-col justify-center min-h-[200px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {simulating ? (
            <motion.div 
              key="simulating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full relative z-10"
            >
              <div className="text-xs uppercase tracking-widest text-signal mb-4">Simulating Alternate History...</div>
              <div className="h-1 w-full bg-border overflow-hidden">
                <motion.div 
                  className="h-full bg-signal"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "linear" }}
                />
              </div>
            </motion.div>
          ) : results ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full relative z-10 space-y-8"
            >
              {/* Physical Impact comparison */}
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-secondary mb-1">Original Event</div>
                  <div className="text-xs uppercase tracking-widest text-primary">Physical Impact</div>
                </div>
                <div className="text-2xl font-mono text-secondary/50 line-through">
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

              {/* Human Exposure comparison (HERO) */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-secondary mb-1">Original Event</div>
                  <div className="text-xs uppercase tracking-widest text-warning">Human Exposure</div>
                </div>
                <div className="text-4xl font-mono text-secondary/50 line-through">
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
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-secondary/50 font-mono text-sm uppercase tracking-widest text-center"
            >
              Adjust parameters to test counterfactuals
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
