import React, { useState } from 'react';
import { motion } from 'framer-motion';

const historicalData = [
  { id: 1, name: 'The Great Flood of 1993', severity: 'Catastrophic', impact: 98, cost: '$15 Billion', recovery: '2 Years', tags: ['Riverine', 'Midwest'] },
  { id: 2, name: 'Hurricane Katrina', severity: 'Catastrophic', impact: 100, cost: '$125 Billion', recovery: '10 Years', tags: ['Coastal', 'Storm Surge'] },
  { id: 3, name: 'European Heatwave 2003', severity: 'Severe', impact: 85, cost: '€13 Billion', recovery: '6 Months', tags: ['Heat', 'Drought'] },
  { id: 4, name: 'Queensland Floods 2010', severity: 'High', impact: 78, cost: '$2.38 Billion', recovery: '1.5 Years', tags: ['Flash Flood', 'Cyclone'] },
  { id: 5, name: 'Typhoon Haiyan', severity: 'Catastrophic', impact: 95, cost: '$2.98 Billion', recovery: '5 Years', tags: ['Coastal', 'Wind'] },
  { id: 6, name: 'Texas Winter Storm 2021', severity: 'Severe', impact: 82, cost: '$195 Billion', recovery: '1 Year', tags: ['Freeze', 'Infrastructure'] },
];

export function ClimateMemory() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = historicalData.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800">Climate Memory Database</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Cross-reference current anomalies against historical disaster precedents.</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search events, regions, or types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-72 rounded-lg border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white/80 backdrop-blur"
          />
          <svg className="absolute left-3 top-2.5 text-slate-400" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-2">
        {filteredData.map((event, idx) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm hover:shadow-lg transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-slate-800 leading-tight">{event.name}</h3>
              <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${
                event.severity === 'Catastrophic' ? 'bg-red-100 text-red-600' : 
                event.severity === 'Severe' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {event.severity}
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Physical Impact</span>
                <span className="font-black text-slate-700">{event.impact}/100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${event.impact > 90 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${event.impact}%` }} />
              </div>
              
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-slate-500 font-medium">Economic Damage</span>
                <span className="font-bold text-slate-700">{event.cost}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Recovery Time</span>
                <span className="font-bold text-slate-700">{event.recovery}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {event.tags.map(tag => (
                <span key={tag} className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
        {filteredData.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500 font-medium">
            No historical records match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
