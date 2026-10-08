import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Fingerprint, SearchCode, AlertCircle } from 'lucide-react';
import { AIExplanation } from './AIExplanation';

export function EvidenceBoard({ state }: { state: any }) {
  const signals = state.signals || {
    "rainfall_accumulation": 41.0,
    "soil_saturation": 27.0,
    "drainage_overload": 19.0,
    "land_cover_absorption": 8.0,
    "visibility": 5.0
  };

  const formattedSignals = [
    { label: 'Rainfall accumulation', value: signals.rainfall_accumulation, color: 'bg-blue-500' },
    { label: 'Soil saturation', value: signals.soil_saturation, color: 'bg-amber-500' },
    { label: 'Drainage overload', value: signals.drainage_overload, color: 'bg-indigo-500' },
    { label: 'Land-cover absorption', value: signals.land_cover_absorption, color: 'bg-emerald-500' },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <div className="p-8 bg-[#0A0D12] border border-white/5 rounded-3xl relative overflow-hidden">
        {/* Topographic/Grid background hint */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] pointer-events-none" />

        <div className="flex items-start justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <SearchCode className="w-6 h-6 text-emerald-500" />
              EVIDENCE BOARD
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">Investigating Environmental Drivers</p>
          </div>
        </div>

        <div className="space-y-8 relative z-10">
          {formattedSignals.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400 font-bold tracking-wide uppercase">{item.label}</span>
                <span className="text-white font-black">{item.value.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  key={state.time_label + item.label} // force re-animate on time change
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${item.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex gap-3 items-start relative z-10">
          <AlertCircle className="w-4 h-4 text-yellow-500/70 shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-400 leading-relaxed uppercase tracking-wider font-medium">
            <span className="text-yellow-500/90 font-bold">Responsible AI Notice:</span> Contribution signals are model outputs, not proof of causation. These percentages reflect feature weights driving the modeled physical impact at this timestamp.
          </p>
        </div>
      </div>

      <AIExplanation simulationResults={null} mode="INVESTIGATION" />
    </div>
  );
}
