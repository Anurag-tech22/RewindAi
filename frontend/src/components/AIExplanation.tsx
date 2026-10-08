import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'SCIENCE' | 'PLANNER' | 'CITIZEN';

export function AIExplanation({ state }: { state: any }) {
  const [mode, setMode] = useState<Mode>('SCIENCE');

  if (!state || !state.signals) return null;

  // Find highest signal
  const topSignal = Object.entries(state.signals).reduce((a, b) => 
    ((a[1] as number) > (b[1] as number) ? a : b)
  );
  
  const formatFeature = (f: string) => {
    const map: Record<string, string> = {
      'rainfall_accumulation': 'Heavy Rainfall',
      'soil_saturation': 'Saturated Ground',
      'drainage_overload': 'Blocked Drains',
      'land_cover_absorption': 'Lack of Greenery',
      'visibility': 'Poor Visibility'
    };
    return map[f] || f.replace('_', ' ');
  };

  const topName = formatFeature(topSignal[0]);

  const getExplanationText = () => {
    switch (mode) {
      case 'SCIENCE':
        return (
          <>
            <div>
              <div className="text-xs uppercase tracking-widest text-secondary mb-1">Finding</div>
              <div className="text-primary leading-relaxed">
                {topName} exhibited strong model contribution signals during this trajectory, compounding the baseline environmental risk.
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-secondary mb-1">Evidence</div>
              <div className="text-primary/80 font-mono text-xs p-3 bg-background border border-border">
                {topName} loading increased sharply while other factors reached maximum retention capacity. Confidence metric: {topSignal[1]}%.
              </div>
            </div>
          </>
        );
      case 'PLANNER':
        return (
          <>
            <div>
              <div className="text-xs uppercase tracking-widest text-secondary mb-1">Finding</div>
              <div className="text-primary leading-relaxed">
                The city infrastructure failed to handle the {topName.toLowerCase()}, which was the primary preventable factor.
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-secondary mb-1">Actionable Priority</div>
              <div className="text-primary/80 font-mono text-xs p-3 bg-background border border-border">
                Prioritize expanding infrastructure related to {topName.toLowerCase()} and implementing earlier emergency alerts.
              </div>
            </div>
          </>
        );
      case 'CITIZEN':
        return (
          <>
            <div>
              <div className="text-xs uppercase tracking-widest text-secondary mb-1">Finding</div>
              <div className="text-primary leading-relaxed">
                The primary reason the situation worsened at this time was due to {topName.toLowerCase()}.
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-secondary mb-1">What it means for you</div>
              <div className="text-primary/80 font-mono text-xs p-3 bg-background border border-border">
                In similar future events, expect rapid disruption. Move to safer areas earlier when warned about {topName.toLowerCase()}.
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xs font-semibold tracking-widest uppercase text-secondary flex items-center gap-2">
          <span className="w-2 h-2 bg-signal opacity-50 rounded-sm"></span>
          AI Investigator
        </div>
        
        {/* Mode Selector */}
        <div className="flex bg-surface/50 border border-border rounded p-1">
          {(['SCIENCE', 'PLANNER', 'CITIZEN'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-[10px] font-mono tracking-widest px-2 py-1 rounded transition-colors ${
                mode === m ? 'bg-primary text-background' : 'text-secondary hover:text-primary'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-surface/30 p-4 border border-border/50 text-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.time_label + mode}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {getExplanationText()}

            <div>
              <div className="text-xs uppercase tracking-widest text-secondary mb-1">Model Contribution Signals</div>
              <div className="space-y-2 mt-2">
                {Object.entries(state.signals).map(([feature, contribution]) => (
                  <div key={feature} className="flex justify-between items-center text-xs font-mono">
                    <span className="text-secondary uppercase truncate w-32">{formatFeature(feature)}</span>
                    <div className="flex items-center gap-2 flex-1 ml-4">
                      <div className="flex-1 h-1 bg-border overflow-hidden">
                        <div className="h-full bg-signal" style={{ width: `${contribution}%` }} />
                      </div>
                      <span className="text-primary w-8 text-right">{contribution}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-[10px] uppercase tracking-widest text-warning mb-1">Caveat</div>
              <div className="text-xs text-secondary leading-relaxed">
                This is a model contribution signal, not proof of real-world causality.
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
