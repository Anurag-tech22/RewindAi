import React, { useEffect, useState } from 'react';
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
      
      <div className="space-y-6">
        {rankings.map((r, i) => (
          <div key={r.name} className="flex justify-between items-center text-sm font-mono">
            <div className="w-1/3 flex items-center gap-4">
              <span className="text-secondary opacity-50">0{i + 1}</span>
              <span className="text-primary uppercase truncate">{r.name}</span>
            </div>
            
            <div className="w-2/3 flex items-center gap-4">
              <div className="flex-1 h-2 bg-surface overflow-hidden rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${r.pts}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full bg-primary" 
                />
              </div>
              <span className="text-signal min-w-[120px] text-right">{r.pts} pts <span className="text-secondary">reduction</span></span>
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
