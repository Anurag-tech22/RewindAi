import React from 'react';

export function EnvironmentalMetrics({ state }: { state: any }) {
  const metrics = [
    { label: 'Rainfall', value: state.rainfall, unit: 'mm' },
    { label: 'Soil Saturation', value: state.soil_saturation, unit: '%' },
    { label: 'Drainage Load', value: state.drainage_load, unit: '%' },
    { label: 'Vegetation', value: state.vegetation, unit: '%' },
    { label: 'Visibility', value: state.visibility, unit: 'm' },
  ];

  return (
    <div>
      <div className="text-xs font-semibold tracking-widest uppercase text-secondary mb-6">Environmental Telemetry</div>
      <div className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label} className="group">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-secondary">{m.label}</span>
              <span className="font-mono text-primary">{m.value.toFixed(1)}{m.unit}</span>
            </div>
            <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-border transition-all duration-500 ease-out group-hover:bg-signal"
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
