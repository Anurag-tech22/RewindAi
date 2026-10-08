import React from 'react';
import { motion } from 'framer-motion';

export function EventTimeline({ data, activeIndex, onIndexChange }: { data: any[], activeIndex: number, onIndexChange: (idx: number) => void }) {
  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface -translate-y-1/2 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(activeIndex / (data.length - 1)) * 100}%` }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>
      
      <div className="relative flex justify-between">
        {data.map((point, idx) => {
          const isActive = idx === activeIndex;
          const isPast = idx <= activeIndex;
          
          return (
            <div 
              key={idx}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => onIndexChange(idx)}
            >
              <div className={`w-3 h-3 rounded-full mb-4 transition-all duration-300 z-10 
                ${isActive ? 'bg-primary scale-150 ring-4 ring-primary/20' : 
                  isPast ? 'bg-primary' : 'bg-border group-hover:bg-secondary'}`}
              />
              
              <div className="text-center">
                <div className={`text-xs font-mono mb-1 transition-colors ${isActive ? 'text-primary font-bold' : isPast ? 'text-primary' : 'text-secondary'}`}>
                  {point.timestamp}
                </div>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 text-center text-[10px] text-secondary font-mono bg-surface p-2 rounded border border-border shadow-sm z-20"
                  >
                    {point.description}
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
