import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventTimeline } from './components/EventTimeline';
import { AIExplanation } from './components/AIExplanation';
import { RewindLab } from './components/RewindLab';
import { EnvironmentalMetrics } from './components/EnvironmentalMetrics';
import { InterventionRanking } from './components/InterventionRanking';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');
  
  const tabs = [ 'Overview', 'Events', 'Rewind Lab', 'Climate Memory', 'Interventions'];

  useEffect(() => {
    fetch('/api/event/timeline')
      .then(res => res.json())
      .then(data => {
        setTimelineData(data);
        setActiveIndex(data.length - 1);
      })
      .catch(err => console.error(err));
  }, []);

  if (!timelineData.length) return <div className="min-h-screen flex items-center justify-center font-mono text-secondary text-sm">Loading telemetry...</div>;

  const currentState = timelineData[activeIndex];
  const finalState = timelineData[timelineData.length - 1];

  return (
    <div className="min-h-screen bg-background text-primary font-sans flex flex-col">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 text-center py-24"
          >
            <div className="text-xs font-semibold tracking-widest uppercase text-primary mb-8 px-2 py-1 rounded bg-surface inline-block">
              REWIND
            </div>
            
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 max-w-3xl leading-snug">
              Environmental intelligence for understanding what happened — and what could have changed it.
            </h1>
            
            <button 
              onClick={() => setHasStarted(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all rounded-xl text-sm font-bold tracking-wide shadow-xl shadow-blue-500/20 mt-4 mb-24 hover:scale-105 active:scale-95"
            >
              Explore events
            </button>

            <div className="w-full text-left">
              <h2 className="text-sm font-bold tracking-wide text-secondary mb-6 uppercase">Recent Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { type: 'FLOOD', location: 'Pune', impact: '87%', icon: '🌊', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { type: 'HEATWAVE', location: 'Delhi', impact: '74%', icon: '☀️', color: 'text-amber-500', bg: 'bg-amber-50' },
                  { type: 'WILDFIRE', location: 'California', impact: '91%', icon: '🔥', color: 'text-red-500', bg: 'bg-red-50' },
                ].map((event, i) => (
                  <div key={i} className="border border-border/60 rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-start text-left relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${event.bg} rounded-bl-full -z-10 transition-transform group-hover:scale-125`} />
                    <div className="text-xs font-bold uppercase text-secondary mb-4 flex items-center gap-2">
                      <span className="text-lg">{event.icon}</span> {event.type}
                    </div>
                    <div className="text-xl font-bold mb-2 text-primary">{event.location}</div>
                    <div className={`mt-auto text-sm font-bold px-3 py-1.5 rounded-lg ${event.bg} ${event.color}`}>{event.impact} impact</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="h-16 border-b border-border/50 bg-white/70 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-20 sticky top-0 shadow-sm">
              <div className="flex items-center gap-8">
                <div className="font-bold tracking-widest uppercase text-sm flex items-center gap-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm"></div>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">REWIND</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-secondary">
                  <a href="#" className="text-primary">Events</a>
                  <a href="#" className="hover:text-primary transition-colors">Explore</a>
                  <a href="#" className="hover:text-primary transition-colors">Memory</a>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-xs font-medium text-secondary bg-slate-50 border border-border/80 px-4 py-2 rounded-lg cursor-pointer hover:border-blue-400 transition-colors shadow-inner">
                  <span>Search...</span>
                  <span className="opacity-50 font-mono">⌘K</span>
                </div>
                <div className="w-9 h-9 rounded-full border border-border/80 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-xs text-blue-600 font-bold shadow-sm cursor-pointer hover:shadow transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
              <aside className="w-[240px] border-r border-border/50 bg-white/50 backdrop-blur-sm hidden lg:flex flex-col py-6 shrink-0 z-10">
                <div className="px-5 mb-8">
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">Active Event</div>
                  <div className="text-sm font-bold bg-white border border-border/80 rounded-xl px-4 py-3 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors">
                    <span className="text-primary">Pune · 2026</span>
                    <span className="text-blue-500 text-xs">▼</span>
                  </div>
                  <div className="text-xs font-semibold text-blue-600 mt-3 hover:text-blue-700 cursor-pointer px-1 flex items-center gap-1">
                    <span>+</span> New Investigation
                  </div>
                </div>
                
                <div className="px-3 space-y-1">
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-widest px-3 mb-3 mt-4">Modules</div>
                  {tabs.map((item) => (
                    <div 
                      key={item} 
                      onClick={() => setActiveTab(item)}
                      className={`px-4 py-2.5 mx-2 text-sm rounded-xl cursor-pointer transition-all font-medium ${
                        item === activeTab ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50' : 'text-secondary hover:text-primary hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto px-3">
                  <div className="px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-surface rounded-md cursor-pointer transition-colors">Settings</div>
                </div>
              </aside>

              <motion.main 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 overflow-y-auto scroll-smooth p-8"
              >
                <div className="max-w-[1200px] mx-auto space-y-8 pb-24">
                  {activeTab === 'Overview' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-8">Environmental Timeline</h3>
                        <EventTimeline 
                          data={timelineData} 
                          activeIndex={activeIndex} 
                          onIndexChange={setActiveIndex} 
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7 bg-white/80 backdrop-blur-lg rounded-2xl border border-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
                          <EnvironmentalMetrics state={currentState} />
                          <div className="mt-8 pt-6 border-t border-border/60 flex justify-between items-end">
                            <div className="text-xs font-bold text-secondary uppercase tracking-widest">Flood Severity Risk</div>
                            <div className="text-5xl font-black text-red-500 tracking-tighter flex items-baseline gap-1">
                              {currentState.impact.toFixed(1)}<span className="text-2xl text-red-300">%</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-5 bg-gradient-to-br from-white to-blue-50/50 rounded-2xl border border-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                          <AIExplanation state={currentState} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'Rewind Lab' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <RewindLab baseState={finalState} />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'Interventions' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="bg-background rounded-xl border border-border p-6 shadow-sm">
                        <InterventionRanking />
                      </div>
                    </motion.div>
                  )}

                  {(activeTab === 'Events' || activeTab === 'Climate Memory') && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-background rounded-xl border border-border p-16 shadow-sm flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-6">
                        <span className="text-secondary">◷</span>
                      </div>
                      <h2 className="text-xl font-semibold text-primary mb-2">{activeTab}</h2>
                      <p className="text-secondary text-sm max-w-sm">This module is currently indexing historical environmental data and global climate models. Please check back soon.</p>
                    </motion.div>
                  )}
                </div>
              </motion.main>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
