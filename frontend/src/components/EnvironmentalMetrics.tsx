import React from 'react';
import { motion } from 'framer-motion';

export function EnvironmentalMetrics({ state }: { state: any }) {
  const getDangerLevel = (impact: number) => {
    if (impact < 30) return { color: 'text-success', label: 'NORMAL' };
    if (impact < 60) return { color: 'text-warning', label: 'ELEVATED' };
    return { color: 'text-danger', label: 'CRITICAL' };
  };
  
  const status = getDangerLevel(state.impact);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xs font-mono text-secondary uppercase tracking-widest">Live Telemetry</h3>
        <div className={`text-[10px] font-mono px-2 py-1 bg-surface border border-border rounded ${status.color}`}>
          STATUS: {status.label}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'River Level', val: `${(state.impact * 0.12).toFixed(1)}m`, normal: '< 4.0m', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Rainfall Rate', val: `${(state.impact * 0.8).toFixed(0)}mm/h`, normal: '< 20mm/h', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Soil Saturation', val: `${Math.min(100, state.impact * 1.5).toFixed(0)}%`, normal: '< 60%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Drainage Flow', val: `${Math.max(0, 100 - state.impact).toFixed(0)}%`, normal: '> 80%', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(metric => (
          <div key={metric.label} className="p-5 border border-border/60 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 ${metric.bg} rounded-bl-full -z-10`} />
            <div className="text-[10px] font-bold text-secondary uppercase mb-3 tracking-widest">{metric.label}</div>
            <div className={`text-3xl font-black ${metric.color} tracking-tight mb-2`}>{metric.val}</div>
            <div className="text-xs font-semibold text-secondary">Normal: {metric.normal}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
