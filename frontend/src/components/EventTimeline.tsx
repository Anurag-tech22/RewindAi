import React from 'react';
import { motion } from 'framer-motion';

export function EventTimeline({ data, activeIndex, onIndexChange }: { data: any[], activeIndex: number, onIndexChange: (idx: number) => void }) {
  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
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
              className="flex flex-col items-center cursor-pointer group relative"
              onClick={() => onIndexChange(idx)}
            >
              <div className={`w-4 h-4 rounded-full mb-4 transition-all duration-300 z-10 shadow-sm
                ${isActive ? 'bg-blue-500 scale-125 ring-4 ring-blue-500/20 shadow-blue-500/50' : 
                  isPast ? 'bg-indigo-500' : 'bg-slate-200 group-hover:bg-blue-300'}`}
              />
              
              <div className="text-center">
                <div className={`text-xs font-bold transition-colors ${isActive ? 'text-blue-600' : isPast ? 'text-slate-700' : 'text-slate-400'}`}>
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
