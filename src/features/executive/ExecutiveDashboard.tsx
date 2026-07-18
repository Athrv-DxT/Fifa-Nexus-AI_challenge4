import React, { useState } from 'react';
import { Sparkles, TrendingUp, FileDown, Layers } from 'lucide-react';
import { useSimulationStore } from '../../simulation/store';
import { usePreferencesStore } from '../../shared/hooks/usePreferences';
import { translations } from '../../config/i18n';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';
import { invokeAIAgent } from '../../ai/client';

export const ExecutiveDashboard: React.FC = () => {
  const { state } = useSimulationStore();
  const { language } = usePreferencesStore();
  const t = translations[language];

  // AI Brief State
  const [briefResult, setBriefResult] = useState<any | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);

  // Simulated Report Download Success Alert
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const triggerExecutiveBrief = async () => {
    setBriefLoading(true);
    try {
      const summaryText = `Aggregate the current state of all stadiums: ${JSON.stringify(
        state.stadiums.map(s => ({
          name: s.name,
          health: s.operationalHealth,
          occupancy: s.occupancy,
          gates: s.gates.map(g => ({ name: g.name, wait: g.waitTime }))
        }))
      )}. Write a concise, professional executive briefing summarizing issues and recommendations.`;
      const res = await invokeAIAgent('Executive Brief Generator', summaryText, language);
      setBriefResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setBriefLoading(false);
    }
  };

  const handleDownloadReport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  // Calculations for executive summaries
  const totalOccupancy = state.stadiums.reduce((acc, s) => acc + s.occupancy, 0);
  const totalCapacity = state.stadiums.reduce((acc, s) => acc + s.capacity, 0);
  const avgHealth = Math.round(state.stadiums.reduce((acc, s) => acc + s.operationalHealth, 0) / state.stadiums.length);
  
  // Incident statistics
  const activeIncidents = state.incidents.filter(inc => inc.status !== 'Resolved');
  const criticalCount = activeIncidents.filter(i => i.severity === 'Critical').length;
  const highCount = activeIncidents.filter(i => i.severity === 'High').length;
  const medCount = activeIncidents.filter(i => i.severity === 'Medium').length;
  const lowCount = activeIncidents.filter(i => i.severity === 'Low').length;

  return (
    <div className="space-y-6">
      
      {/* Top Tournament KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="px-4 py-3">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Tournament Health Index</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{avgHealth}%</div>
          <p className="text-[10px] text-slate-400 mt-1">Average operational health across venues</p>
        </Card>
        <Card className="px-4 py-3">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Live Attendance</span>
          <div className="text-2xl font-black text-slate-100 mt-1">
            {totalOccupancy.toLocaleString()} / {totalCapacity.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {((totalOccupancy / totalCapacity) * 100).toFixed(1)}% total occupancy capacity
          </p>
        </Card>
        <Card className="px-4 py-3">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Support Grid</span>
          <div className="text-2xl font-black text-slate-100 mt-1">{state.volunteers.length} active</div>
          <p className="text-[10px] text-slate-400 mt-1">
            {state.volunteers.filter(v => v.status === 'Busy').length} currently dispatched on duty
          </p>
        </Card>
        <Card className="px-4 py-3">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Incidents</span>
          <div className="text-2xl font-black text-red-500 mt-1">{activeIncidents.length} logs</div>
          <p className="text-[10px] text-slate-400 mt-1">
            {criticalCount} Critical • {highCount} High priority issues
          </p>
        </Card>
      </div>

      {/* Multi-Stadium Performance Scoreboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stadium Comparisons */}
        <div className="lg:col-span-2 space-y-6">
          <Card title={t.exec.comparisonTitle} subtitle="Live side-by-side venue metrics (Simulated Data)">
            <div className="space-y-4">
              {state.stadiums.map((st) => {
                const maxWait = Math.max(...st.gates.map(g => g.waitTime));
                return (
                  <div key={st.id} className="border border-brand-dark-700 bg-brand-dark-950 p-4 rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm text-slate-200">{st.name}</h4>
                        <span className="text-xs text-slate-400">{st.city}</span>
                      </div>
                      <Badge variant={st.operationalHealth > 80 ? 'success' : st.operationalHealth > 65 ? 'warning' : 'danger'}>
                        Health Index: {st.operationalHealth}%
                      </Badge>
                    </div>

                    {/* Progress Indicator for capacity */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Attendance Capacity</span>
                        <span>{st.occupancy.toLocaleString()} / {st.capacity.toLocaleString()} fans ({Math.round((st.occupancy / st.capacity) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-brand-dark-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-blue-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${(st.occupancy / st.capacity) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Sub statistics Grid */}
                    <div className="grid grid-cols-3 gap-4 text-xs pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Max Gate Wait</span>
                        <strong className={maxWait > 20 ? 'text-red-400' : 'text-slate-200'}>{maxWait} minutes</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Incidents</span>
                        <strong className="text-slate-200">
                          {state.incidents.filter(i => i.status !== 'Resolved' && i.location.includes(st.name)).length}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Parking Availability</span>
                        <strong className="text-slate-200">
                          {Math.round(st.parking.reduce((a, p) => a + (100 - p.occupancy), 0) / st.parking.length)}% spaces free
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* SVG Operational Health Score Trend */}
          <Card title={t.exec.healthTrend} subtitle="Live generated operational history index">
            <div className="relative h-[200px] w-full flex items-center justify-center p-2">
              <svg viewBox="0 0 500 150" className="w-full h-full max-h-[180px]">
                {/* Horizontal gridlines */}
                <line x1="0" y1="30" x2="500" y2="30" className="stroke-brand-dark-700 stroke-0.5 stroke-dasharray-[2,2]" />
                <line x1="0" y1="75" x2="500" y2="75" className="stroke-brand-dark-700 stroke-0.5 stroke-dasharray-[2,2]" />
                <line x1="0" y1="120" x2="500" y2="120" className="stroke-brand-dark-700 stroke-0.5 stroke-dasharray-[2,2]" />
                
                {/* Trend line representing simulated health score changes over last ticks */}
                <path
                  d="M 10,75 L 80,68 L 150,85 L 220,95 L 290,70 L 360,65 L 430,78 L 490,40"
                  className="fill-none stroke-brand-blue-500 stroke-2"
                />
                
                {/* Gradient area under trend */}
                <path
                  d="M 10,75 L 80,68 L 150,85 L 220,95 L 290,70 L 360,65 L 430,78 L 490,40 L 490,150 L 10,150 Z"
                  className="fill-brand-blue-500/10 pointer-events-none"
                />

                {/* Dot markers */}
                <circle cx="10" cy="75" r="4" className="fill-brand-blue-500 stroke-brand-dark-900 stroke-1" />
                <circle cx="220" cy="95" r="4" className="fill-brand-blue-500 stroke-brand-dark-900 stroke-1" />
                <circle cx="490" cy="40" r="4" className="fill-brand-blue-500 stroke-brand-dark-900 stroke-1" />

                <text x="12" y="65" className="text-[9px] fill-slate-400">Match Kickoff</text>
                <text x="450" y="30" className="text-[9px] fill-slate-300 font-bold">Current (Health: {avgHealth}%)</text>
              </svg>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 px-2 mt-1">
              <span>Kickoff Tick (0)</span>
              <span>Half-time</span>
              <span>Full-time Tick</span>
            </div>
          </Card>
        </div>

        {/* Right Side: AI Executive Brief, Incidents, Reports */}
        <div className="space-y-6">
          
          {/* AI Executive Brief Generator */}
          <Card
            title="AI Executive Operations Brief"
            subtitle="Aggregates tournament data into a strategic summary"
            headerAction={
              <div className="flex items-center gap-1 text-[10px] text-brand-gold-500 font-mono">
                <Sparkles size={11} className="animate-pulse" />
                <span>Executive Brief Agent</span>
              </div>
            }
          >
            <Button
              onClick={triggerExecutiveBrief}
              disabled={briefLoading}
              className="w-full text-xs flex items-center justify-center gap-1.5"
            >
              <TrendingUp size={14} />
              {briefLoading ? 'Analyzing Tournament Performance...' : t.exec.genBriefBtn}
            </Button>

            {briefResult && (
              <div className="mt-4 border border-brand-dark-700 bg-brand-dark-950 p-4 rounded-md space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-brand-dark-700 pb-1.5 font-mono text-[9px] text-slate-400">
                  <span>Target Health: {briefResult.operationalHealthScore}%</span>
                  <span>Confidence: {(briefResult.confidenceScore * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <h5 className="font-bold text-slate-200 mb-1">Strategic Overview</h5>
                  <p className="text-slate-300 leading-relaxed">{briefResult.executiveSummary}</p>
                </div>
                <div>
                  <h5 className="font-bold text-slate-200 mb-1">Key Action Directives</h5>
                  <ul className="list-disc pl-4 text-slate-400 space-y-1">
                    {briefResult.keyRecommendations?.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-slate-200 mb-0.5">Resource Forecast</h5>
                  <p className="text-slate-400 italic">{briefResult.resourceForecastAdvice}</p>
                </div>
                {briefResult.isFallback && (
                  <div className="text-[9px] text-yellow-500 text-right pt-1.5 border-t border-brand-dark-700">
                    Offline Rule-based Fallback Active
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Live Incident Severity Breakdown */}
          <Card title="Incident Breakdown by Severity" subtitle="Active unresolved logs">
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Critical Emergencies</span>
                  <strong>{criticalCount}</strong>
                </div>
                <div className="w-full bg-brand-dark-750 h-2 rounded overflow-hidden">
                  <div className="bg-red-600 h-full" style={{ width: `${(criticalCount / (activeIncidents.length || 1)) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>High Priority</span>
                  <strong>{highCount}</strong>
                </div>
                <div className="w-full bg-brand-dark-750 h-2 rounded overflow-hidden">
                  <div className="bg-orange-500 h-full" style={{ width: `${(highCount / (activeIncidents.length || 1)) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Medium / Low Priority</span>
                  <strong>{medCount + lowCount}</strong>
                </div>
                <div className="w-full bg-brand-dark-750 h-2 rounded overflow-hidden">
                  <div className="bg-yellow-500 h-full" style={{ width: `${((medCount + lowCount) / (activeIncidents.length || 1)) * 100}%` }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Tournament Intelligence Reports exports */}
          <Card title="Tournament Intelligence Reports" subtitle="Export executive brief summaries">
            {downloadSuccess ? (
              <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-3 rounded text-xs">
                Export Successful! FIFA-2026-Ops-Briefing.pdf has been generated and downloaded.
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="bg-brand-dark-950 p-3 border border-brand-dark-700 rounded text-xs flex gap-2.5 items-center">
                  <Layers className="text-brand-blue-500 w-8 h-8 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-slate-200">Daily Operations Summary</h5>
                    <span className="text-[10px] text-slate-400 block">PDF Format • 2.4 MB • Generated 10m ago</span>
                  </div>
                </div>
                <Button onClick={handleDownloadReport} className="w-full flex items-center justify-center gap-1.5 text-xs">
                  <FileDown size={14} />
                  {t.exec.reportDownloadBtn}
                </Button>
              </div>
            )}
          </Card>

        </div>
      </div>

    </div>
  );
};
