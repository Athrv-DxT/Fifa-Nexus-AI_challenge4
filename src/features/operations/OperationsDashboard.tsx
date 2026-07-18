import React, { useState } from 'react';
import { Monitor, Play, Pause, ChevronRight, Activity, Sparkles } from 'lucide-react';
import { useSimulationStore } from '../../simulation/store';
import { usePreferencesStore } from '../../shared/hooks/usePreferences';
import { translations } from '../../config/i18n';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input, Select } from '../../shared/components/FormControls';
import { Badge } from '../../shared/components/Badge';
import { StadiumDigitalTwin } from './StadiumDigitalTwin';
import { invokeAIAgent } from '../../ai/client';

export const OperationsDashboard: React.FC = () => {
  const { state, tick, isPlaying, setIsPlaying, playSpeed, setPlaySpeed, triggerEmergency, resolveIncident, dispatchVolunteer } = useSimulationStore();
  const { language } = usePreferencesStore();
  const t = translations[language];

  const activeStadium = state.stadiums.find(s => s.id === state.activeStadiumId) || state.stadiums[0];

  // Selected Sector details
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // AI Copilot State
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotResult, setCopilotResult] = useState<any | null>(null);

  // Selected incident details for manual dispatcher modal
  const [selectedIncId, setSelectedIncId] = useState<string | null>(null);

  // CCTV selected index
  const [cctvCam, setCctvCam] = useState('Cam 1 (Gate 2 Main Entrance)');

  // Run AI Crowd Prediction Assistant
  const [predictResult, setPredictResult] = useState<any | null>(null);
  const [predLoading, setPredLoading] = useState(false);

  const getPrediction = async () => {
    setPredLoading(true);
    try {
      const res = await invokeAIAgent('Crowd Prediction Assistant', `Analyze crowd flow and occupancy for ${activeStadium.name}. Predict bottlenecks.`, language);
      setPredictResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setPredLoading(false);
    }
  };

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;

    setCopilotLoading(true);
    try {
      const res = await invokeAIAgent('Operations Copilot', copilotInput, language);
      setCopilotResult(res);
      setCopilotInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setCopilotLoading(false);
    }
  };

  const executeCopilotRecommendation = (rec: any) => {
    // Find the volunteer matching dispatch need or trigger emergency if required
    if (rec.reason.toLowerCase().includes('evacuate')) {
      triggerEmergency(activeStadium.id);
    } else {
      // Find an idle volunteer and dispatch them to the recommended zone
      const idleVol = state.volunteers.find(v => v.status === 'Idle');
      const activeInc = state.incidents.find(i => i.status === 'Reported');
      if (idleVol && activeInc) {
        dispatchVolunteer(activeInc.id, idleVol.id);
      }
    }
    setCopilotResult(null);
  };



  const activeIncidents = state.incidents.filter(inc => inc.status !== 'Resolved');
  const avgWaitTime = Math.round(activeStadium.gates.reduce((acc, g) => acc + g.waitTime, 0) / activeStadium.gates.length);

  return (
    <div className="space-y-6">
      
      {/* Simulation Speed & Master Clock Control Banner */}
      <div className="bg-brand-dark-900 border border-brand-dark-700 p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="text-brand-blue-500 animate-pulse" />
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Live Simulation Control Console</h2>
            <p className="text-xs text-slate-400">
              Ticker Index: <strong>{state.tickCount}</strong> | Active Seed: <strong>{state.activeStadiumId} (Seed: FIFA2026)</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-brand-dark-950 p-1 border border-brand-dark-700 rounded-md">
            <Button
              variant={isPlaying ? 'primary' : 'ghost'}
              onClick={() => setIsPlaying(true)}
              size="sm"
              aria-label="Start simulation timer"
              className="px-3"
            >
              <Play size={14} className="mr-1" /> Play
            </Button>
            <Button
              variant={!isPlaying ? 'secondary' : 'ghost'}
              onClick={() => setIsPlaying(false)}
              size="sm"
              aria-label="Pause simulation timer"
              className="px-3"
            >
              <Pause size={14} className="mr-1" /> Pause
            </Button>
          </div>
          <Button onClick={tick} size="sm" variant="secondary">Step Tick</Button>
          
          <select
            aria-label="Clock Speed"
            value={playSpeed}
            onChange={(e) => setPlaySpeed(Number(e.target.value))}
            className="bg-brand-dark-950 border border-brand-dark-700 text-xs rounded px-2.5 py-1 text-slate-100 focus:outline-none"
          >
            <option value="3">Fast (3s/tick)</option>
            <option value="5">Normal (5s/tick)</option>
            <option value="10">Slow (10s/tick)</option>
          </select>

          <Button onClick={() => triggerEmergency(activeStadium.id)} size="sm" variant="danger">
            {t.common.emergency}
          </Button>
        </div>
      </div>

      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="px-4 py-3 bg-brand-dark-900 border-l-4 border-l-brand-blue-500">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Venue</span>
          <div className="text-sm font-bold text-slate-100 mt-1 truncate">{activeStadium.name}</div>
        </Card>
        <Card className="px-4 py-3 bg-brand-dark-900 border-l-4 border-l-emerald-500">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">{t.common.health}</span>
          <div className="text-lg font-bold text-slate-100 mt-1">{activeStadium.operationalHealth}%</div>
        </Card>
        <Card className="px-4 py-3 bg-brand-dark-900 border-l-4 border-l-yellow-500">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Check-in Wait</span>
          <div className="text-lg font-bold text-slate-100 mt-1">{avgWaitTime} minutes</div>
        </Card>
        <Card className="px-4 py-3 bg-brand-dark-900 border-l-4 border-l-blue-400">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Volunteers</span>
          <div className="text-lg font-bold text-slate-100 mt-1">
            {state.volunteers.filter(v => v.status === 'Busy').length} / {state.volunteers.length}
          </div>
        </Card>
        <Card className="px-4 py-3 bg-brand-dark-900 border-l-4 border-l-red-500">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Incidents</span>
          <div className="text-lg font-bold text-slate-100 mt-1">{activeIncidents.length} logs</div>
        </Card>
      </div>

      {/* Main Grid: Digital Twin (Left) vs Copilot & CCTV (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Digital Twin & Details */}
        <div className="lg:col-span-2 space-y-6">
          <StadiumDigitalTwin
            onSectorSelect={setSelectedSector}
            selectedSector={selectedSector}
          />

          {/* Sector Details Panel (only visible when a sector is selected) */}
          {selectedSector ? (
            <Card
              title={`Telemetry Details: ${selectedSector}`}
              subtitle="Real-time localized metrics from Digital Twin"
              headerAction={
                <Button size="sm" variant="ghost" onClick={() => setSelectedSector(null)}>Close Panel</Button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-300 border-b border-brand-dark-700 pb-1 mb-2">Sectors Restrooms & Concessions</h4>
                  {activeStadium.facilities.length === 0 ? (
                    <span className="text-slate-500">No facilities matching sector.</span>
                  ) : (
                    <div className="space-y-2">
                      {activeStadium.facilities.map(f => (
                        <div key={f.id} className="flex justify-between items-center">
                          <span>{f.name}</span>
                          <div className="flex gap-1.5 items-center">
                            <span>Lines: {f.congestion}%</span>
                            <Badge variant={f.congestion > 75 ? 'danger' : 'warning'}>{f.waitTime}m</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-slate-300 border-b border-brand-dark-700 pb-1 mb-2">Gate Queue Telemetry</h4>
                  <div className="space-y-2">
                    {activeStadium.gates.map(g => (
                      <div key={g.id} className="flex justify-between items-center">
                        <span>{g.name}</span>
                        <div className="flex gap-1.5 items-center">
                          <span>{g.occupancy} checking-in</span>
                          <Badge variant={g.waitTime > 20 ? 'danger' : 'success'}>{g.waitTime}m wait</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="bg-brand-dark-900 border border-brand-dark-700/60 rounded-lg p-5 text-center text-xs text-slate-400">
              Select a seating zone on the Stadium Digital Twin above to view live localized telemetry details.
            </div>
          )}

          {/* Gate Utilizations table */}
          <Card title={t.ops.gateUtilization} subtitle="Comparison of entry queue bottlenecks">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-brand-dark-950 text-slate-400 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="px-4 py-2 border-b border-brand-dark-700">Gate Name</th>
                    <th className="px-4 py-2 border-b border-brand-dark-700">Active Load</th>
                    <th className="px-4 py-2 border-b border-brand-dark-700">Average Wait</th>
                    <th className="px-4 py-2 border-b border-brand-dark-700">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-dark-700">
                  {activeStadium.gates.map((g) => (
                    <tr key={g.id} className="hover:bg-brand-dark-800/40">
                      <td className="px-4 py-2.5 font-medium text-slate-200">{g.name}</td>
                      <td className="px-4 py-2.5">{g.occupancy} fans</td>
                      <td className="px-4 py-2.5">{g.waitTime} minutes</td>
                      <td className="px-4 py-2.5">
                        <Badge variant={g.status === 'Congested' ? 'danger' : g.status === 'Closed' ? 'neutral' : 'success'}>
                          {g.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Side: Copilot, CCTV, Incidents */}
        <div className="space-y-6">
          
          {/* AI Operations Copilot */}
          <Card
            title={t.ops.copilotTitle}
            subtitle="Issue real-time logistical redirect directives"
            headerAction={
              <div className="flex items-center gap-1 text-[10px] text-brand-gold-500 font-mono">
                <Sparkles size={11} className="animate-pulse" />
                <span>Ops Copilot Agent</span>
              </div>
            }
          >
            <form onSubmit={handleCopilotSubmit} className="space-y-3">
              <Input
                id="ops-copilot-input"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                placeholder={t.ops.copilotPlaceholder}
                className="text-xs"
                required
              />
              <Button type="submit" disabled={copilotLoading} className="w-full text-xs">
                {copilotLoading ? 'Analyzing Operations...' : 'Query Copilot'}
              </Button>
            </form>

            {copilotResult && (
              <div className="mt-3 border border-brand-dark-700 bg-brand-dark-950 p-3 rounded text-xs space-y-2.5">
                <div className="flex justify-between items-center text-[10px] border-b border-brand-dark-700 pb-1">
                  <span className="font-semibold text-brand-gold-500">AI Recommendation Plan</span>
                  <span>Confidence: {(copilotResult.confidenceScore * 100).toFixed(0)}%</span>
                </div>
                <div className="space-y-1">
                  {copilotResult.actionableSuggestions?.map((sug: string, idx: number) => (
                    <p key={idx} className="text-slate-200">• {sug}</p>
                  ))}
                </div>
                {copilotResult.recommendedResourceShifts?.map((shift: any, idx: number) => (
                  <div key={idx} className="bg-brand-dark-900 p-2 border border-brand-dark-700 rounded mt-2">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Resource Shift Suggestion</span>
                    <p className="text-slate-300 mt-1">
                      Move <strong>{shift.volunteerCount} volunteers</strong> from <strong>{shift.fromLocation}</strong> to <strong>{shift.toLocation}</strong>.
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-1">Reason: {shift.reason}</span>
                    <Button
                      onClick={() => executeCopilotRecommendation(shift)}
                      size="sm"
                      className="mt-2 w-full text-[10px]"
                    >
                      Execute Recommendation Override
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Simulated Security CCTV feeds */}
          <Card title={t.ops.securityCctv} subtitle="Live virtual feeds from stadium gates">
            <div className="space-y-3">
              <div className="relative aspect-video bg-black border border-brand-dark-700 rounded overflow-hidden flex items-center justify-center">
                {/* Visual scanline overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent pointer-events-none animate-pulse" />
                <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-green-400">
                  {cctvCam} - LIVE FEED
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400">
                  {new Date().toLocaleTimeString()}
                </div>
                <Monitor className="text-slate-700 w-12 h-12" />
              </div>
              <Select
                id="cctv-cam-select"
                options={[
                  { value: 'Cam 1 (Gate 2 Main Entrance)', label: 'Gate 2 Entrance check-in' },
                  { value: 'Cam 2 (Section 104 Seating)', label: 'Sector 104 Seating Bowl' },
                  { value: 'Cam 3 (Food Court)', label: 'Pampa Grill Food Court area' },
                  { value: 'Cam 4 (Parking Lot A)', label: 'Lot A Shuttle Stand' }
                ]}
                value={cctvCam}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCctvCam(e.target.value)}
                className="text-xs"
              />
            </div>
          </Card>

          {/* Predictive Crowd Analytics */}
          <Card title="AI Predictive Bottlenecks" subtitle="Proactive queue congestions alerts">
            <Button onClick={getPrediction} disabled={predLoading} size="sm" className="w-full text-xs">
              {predLoading ? 'Running Prediction Engine...' : 'Run Prediction Model'}
            </Button>
            {predictResult && (
              <div className="mt-3 border border-brand-dark-700 bg-brand-dark-950 p-3 rounded text-xs space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span>Concurrency Score: {predictResult.concurrencyRiskScore}/100</span>
                  <span>Confidence: {(predictResult.confidenceScore * 100).toFixed(0)}%</span>
                </div>
                <div className="space-y-1.5">
                  {predictResult.predictedBottlenecks?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span>{item.location}</span>
                      <Badge variant={item.probability > 0.8 ? 'danger' : 'warning'}>
                        {Math.round(item.probability * 100)}% risk in {item.etaMinutes}m
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="text-slate-300 italic text-[11px] mt-2">
                  <strong>Mitigation:</strong> {predictResult.mitigationStrategy}
                </p>
              </div>
            )}
          </Card>

        </div>
      </div>

      {/* Incident Timeline Feed & Dispatch console */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Incident Timeline */}
        <Card title={t.ops.incidentFeed} subtitle="Security logs dispatch board">
          <div className="space-y-3 h-[250px] overflow-y-auto pr-1">
            {state.incidents.length === 0 ? (
              <div className="text-slate-400 text-xs text-center py-8">No incidents logged.</div>
            ) : (
              state.incidents.map((inc) => (
                <div
                  key={inc.id}
                  className={`p-3 rounded border text-xs flex justify-between items-start ${
                    inc.status === 'Resolved'
                      ? 'border-brand-dark-700 bg-brand-dark-900/40 opacity-70'
                      : inc.severity === 'Critical'
                      ? 'border-red-900 bg-red-950/20'
                      : 'border-brand-dark-700 bg-brand-dark-900'
                  }`}
                >
                  <div className="space-y-1 max-w-[70%]">
                    <div className="flex gap-1.5 items-center flex-wrap">
                      <span className="font-semibold text-slate-200">{inc.type}</span>
                      <Badge variant={inc.severity === 'Critical' ? 'danger' : inc.severity === 'High' ? 'warning' : 'info'}>
                        {inc.severity}
                      </Badge>
                      <Badge variant={inc.status === 'Resolved' ? 'success' : inc.status === 'Dispatched' ? 'info' : 'warning'}>
                        {inc.status}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-[11px]">{inc.description}</p>
                    <span className="text-[10px] text-slate-500 block">Location: {inc.location}</span>
                  </div>

                  <div className="flex flex-col gap-1.5 items-end">
                    {inc.status === 'Reported' && (
                      <Button
                        onClick={() => setSelectedIncId(inc.id)}
                        size="sm"
                        className="text-[10px] px-2 py-1"
                      >
                        Dispatch Staff
                      </Button>
                    )}
                    {inc.status === 'Dispatched' && (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] text-slate-400">Assigned: {inc.assignedVolunteerId}</span>
                        <Button
                          onClick={() => resolveIncident(inc.id)}
                          size="sm"
                          variant="secondary"
                          className="text-[10px] px-2 py-1"
                        >
                          Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Resource Allocation Roster */}
        <Card title="Operations Staff Roster" subtitle="Volunteer logs location tracking">
          <div className="space-y-2 h-[250px] overflow-y-auto pr-1">
            {state.volunteers.map((vol) => (
              <div key={vol.id} className="bg-brand-dark-900 border border-brand-dark-700 p-2.5 rounded text-xs flex justify-between items-center">
                <div>
                  <h5 className="font-semibold text-slate-200">{vol.name}</h5>
                  <span className="text-slate-400 text-[10px]">{vol.role} • {vol.location}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] text-slate-400">{vol.phone}</span>
                  <Badge variant={vol.status === 'Idle' ? 'success' : 'warning'}>
                    {vol.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Manual Dispatcher Dialog Overlay */}
      {selectedIncId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-brand-dark-900 border border-brand-dark-700 max-w-sm w-full rounded-md p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">Select Volunteer for Dispatch</h3>
            <p className="text-xs text-slate-400">
              Incident ID: {selectedIncId}. Select from active idle staff:
            </p>
            <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
              {state.volunteers
                .filter(v => v.status === 'Idle')
                .map((vol) => (
                  <button
                    key={vol.id}
                    onClick={() => {
                      dispatchVolunteer(selectedIncId, vol.id);
                      setSelectedIncId(null);
                    }}
                    className="w-full text-left p-2.5 bg-brand-dark-950 hover:bg-brand-dark-800 border border-brand-dark-700 text-xs text-slate-200 rounded flex justify-between items-center"
                  >
                    <span>{vol.name} ({vol.role})</span>
                    <ChevronRight size={14} className="text-slate-500" />
                  </button>
                ))}
              {state.volunteers.filter(v => v.status === 'Idle').length === 0 && (
                <span className="text-xs text-red-400 block text-center py-4">No idle volunteers available.</span>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={() => setSelectedIncId(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
