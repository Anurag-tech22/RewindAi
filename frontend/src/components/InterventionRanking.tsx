import React from 'react';
import { motion } from 'framer-motion';

export function InterventionRanking() {
  const rankings = [
    { name: 'Earlier Warning + Better Drainage', pts: 48, max: 100 },
    { name: 'Better Drainage', pts: 31, max: 100 },
    { name: 'Earlier Warning', pts: 24, max: 100 },
    { name: 'More Vegetation', pts: 15, max: 100 },
  ];

  return (
    <div>
      <div className="text-xs font-semibold tracking-widest uppercase text-secondary mb-8">Intervention Ranking</div>
      
      <div className="space-y-8">
        {rankings.map((r, i) => (
          <div key={r.name} className="flex justify-between items-center text-sm font-medium">
            <div className="w-1/3 flex items-center gap-4">
              <span className="text-blue-500 font-bold bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">0{i + 1}</span>
              <span className="text-primary font-bold">{r.name}</span>
            </div>
            
            <div className="w-2/3 flex items-center gap-6">
              <div className="flex-1 h-3 bg-slate-100 overflow-hidden rounded-full shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${r.pts}%` }}
                  transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                />
              </div>
              <span className="text-indigo-600 font-black min-w-[120px] text-right text-lg">{r.pts} <span className="text-secondary text-xs uppercase tracking-widest font-bold">pts</span></span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-secondary mb-1">Recommended intervention</div>
          <div className="text-sm text-primary uppercase">Earlier warning + improved drainage</div>
        </div>
        <div className="text-xs text-secondary max-w-xs text-right">
          Produces the largest modeled reduction in human exposure.
        </div>
      </div>
    </div>
  );
}
