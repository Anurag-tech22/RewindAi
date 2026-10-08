import React from 'react';
import { motion } from 'framer-motion';

export function EventTimeline({ data, activeIndex, onIndexChange }: { data: any[], activeIndex: number, onIndexChange: (i: number) => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="text-xs font-semibold tracking-widest uppercase text-secondary mb-8">Event Timeline</div>
      <div className="relative flex-1 flex flex-col justify-between py-2">
        <div className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-border z-0" />
        
        {data.map((point, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          
          return (
            <button
              key={point.time_label}
              onClick={() => onIndexChange(index)}
              className={`relative z-10 flex items-center gap-4 text-sm font-mono transition-colors text-left group
                ${isActive ? 'text-primary' : isPast ? 'text-secondary/70' : 'text-secondary hover:text-primary'}
              `}
            >
              <div className={`w-2 h-2 rounded-full transition-colors relative
                ${isActive ? 'bg-signal shadow-[0_0_8px_rgba(0,229,255,0.5)]' : isPast ? 'bg-border' : 'bg-surface border border-border group-hover:border-secondary'}
              `} />
              {point.time_label}
              
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] border border-signal rounded-full opacity-50"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
