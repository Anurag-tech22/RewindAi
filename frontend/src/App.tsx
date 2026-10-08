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
  
  const tabs = ['Overview', 'Events', 'Rewind Lab', 'Climate Memory', 'Interventions'];

  useEffect(() => {
    fetch('http://localhost:8000/api/event/timeline')
      .then(res => res.json())
      .then(data => {
        setTimelineData(data);
        setActiveIndex(data.length - 1);
      })
      .catch(err => console.error(err));
  }, []);

  if (!timelineData.length) return <div className="min-h-screen bg-background flex items-center justify-center font-mono text-secondary text-sm">Loading telemetry...</div>;

  const currentState = timelineData[activeIndex];
  const finalState = timelineData[timelineData.length - 1];

  return (
    <div className="min-h-screen bg-background text-primary font-sans overflow-x-hidden selection:bg-surface selection:text-primary flex flex-col">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 text-center w-full py-24"
          >
            <div className="text-xs font-semibold tracking-widest uppercase text-primary mb-8 px-2 py-1 rounded bg-surface inline-block">
              REWIND
            </div>
            
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-primary mb-6 max-w-3xl leading-snug">
              Environmental intelligence for understanding what happened — and what could have changed it.
            </h1>
            
            <button 
              onClick={() => setHasStarted(true)}
              className="px-6 py-3 bg-primary text-background hover:bg-primary/90 transition-colors rounded-lg text-sm font-medium tracking-wide shadow-sm mt-4 mb-24"
            >
              Explore events
            </button>

            <div className="w-full text-left">
              <h2 className="text-sm font-semibold tracking-wide text-secondary mb-6 uppercase">Recent Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { type: 'FLOOD', location: 'Pune', impact: '87%' },
                  { type: 'HEATWAVE', location: 'Delhi', impact: '74%' },
                  { type: 'WILDFIRE', location: 'California', impact: '91%' },
                ].map((event, i) => (
                  <div key={i} className="border border-border rounded-xl p-6 bg-background shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-start text-left">
                    <div className="text-xs font-mono uppercase text-secondary mb-4">{event.type}</div>
                    <div className="text-xl font-semibold text-primary mb-2">{event.location}</div>
                    <div className="mt-auto text-sm text-secondary font-mono bg-surface px-2 py-1 rounded">{event.impact} impact</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
            {/* Top Navigation */}
            <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background shrink-0 z-10">
              <div className="flex items-center gap-6">
                <div className="font-semibold tracking-widest uppercase text-primary text-sm flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                  REWIND
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm text-secondary">
                  <a href="#" className="text-primary font-medium">Events</a>
                  <a href="#" className="hover:text-primary transition-colors">Explore</a>
                  <a href="#" className="hover:text-primary transition-colors">Memory</a>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-xs font-mono text-secondary bg-surface border border-border px-3 py-1.5 rounded-md cursor-pointer hover:border-secondary transition-colors">
                  <span>Search...</span>
                  <span className="opacity-50">⌘K</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-border bg-surface flex items-center justify-center text-xs text-secondary">◯</div>
              </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <aside className="w-[220px] border-r border-border bg-surface/30 hidden lg:flex flex-col py-6 shrink-0">
                <div className="px-4 mb-6">
                  <div className="text-xs font-mono text-secondary uppercase tracking-widest mb-2">Events</div>
                  <div className="text-sm font-medium bg-background border border-border rounded-md px-3 py-2 shadow-sm flex items-center justify-between cursor-pointer">
                    <span>Pune · 2026</span>
                    <span className="text-secondary opacity-50 text-xs">▼</span>
                  </div>
                  <div className="text-xs text-secondary mt-3 hover:text-primary cursor-pointer px-1">+ New Investigation</div>
                </div>
                
                <div className="px-3 space-y-1">
                  <div className="text-xs font-mono text-secondary uppercase tracking-widest px-3 mb-2 mt-4">Analysis</div>
                  {tabs.map((item) => (
                    <div 
                      key={item} 
                      onClick={() => setActiveTab(item)}
                      className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                        item === activeTab ? 'bg-primary/5 text-primary font-medium' : 'text-secondary hover:text-primary hover:bg-surface'
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

              {/* Main Content Area */}
              <motion.main 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 overflow-y-auto p-8"
              >
                <div className="max-w-[1200px] mx-auto space-y-8 pb-24">
                  {activeTab === 'Overview' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      {/* Zone 1: Timeline Navigation */}
                      <div className="bg-background rounded-xl border border-border p-6 shadow-sm">
                        <h3 className="text-xs font-mono text-secondary uppercase tracking-widest mb-6">Environmental Timeline</h3>
                        <EventTimeline 
                          data={timelineData} 
                          activeIndex={activeIndex} 
                          onIndexChange={setActiveIndex} 
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Zone 2: Environmental Monitoring */}
                        <div className="lg:col-span-7 bg-background rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between">
                          <EnvironmentalMetrics state={currentState} />
                          <div className="mt-8 pt-6 border-t border-border flex justify-between items-end">
                            <div className="text-xs font-mono text-secondary uppercase tracking-widest">Flood Severity Risk</div>
                            <div className="text-4xl font-mono text-primary flex items-baseline gap-1">
                              {currentState.impact.toFixed(1)}<span className="text-xl text-secondary">%</span>
                            </div>
                          </div>
                        </div>

                        {/* Zone 3: AI Investigator */}
                        <div className="lg:col-span-5 bg-background rounded-xl border border-border p-6 shadow-sm">
                          <AIExplanation state={currentState} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'Rewind Lab' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="bg-background rounded-xl border border-border p-8 shadow-sm">
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
