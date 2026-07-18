import React, { useState } from 'react';
import { Send, FileWarning, Languages } from 'lucide-react';
import { useSimulationStore } from '../../simulation/store';
import { usePreferencesStore } from '../../shared/hooks/usePreferences';
import { translations } from '../../config/i18n';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input, Select } from '../../shared/components/FormControls';
import { Badge } from '../../shared/components/Badge';
import { invokeAIAgent } from '../../ai/client';

export const VolunteerDashboard: React.FC = () => {
  const { state, addManualIncident, resolveIncident } = useSimulationStore();
  const { language } = usePreferencesStore();
  const t = translations[language];

  // We bind the dashboard to the first simulated volunteer Carlos Silva (vol-1)
  const activeVolId = 'vol-1';
  const currentVolunteer = state.volunteers.find(v => v.id === activeVolId) || state.volunteers[0];
  const activeStadium = state.stadiums.find(s => s.id === state.activeStadiumId) || state.stadiums[0];

  // Tasks assigned to Carlos
  const assignedTasks = state.incidents.filter(
    inc => inc.assignedVolunteerId === activeVolId && inc.status !== 'Resolved'
  );

  // AI Shift Assistant State
  const [shiftQuery, setShiftQuery] = useState('');
  const [shiftResponse, setShiftResponse] = useState<any | null>(null);
  const [shiftLoading, setShiftLoading] = useState(false);

  // Translation Assistant State
  const [translateText, setTranslateText] = useState('');
  const [translateResult, setTranslateResult] = useState('');
  const [transLoading, setTransLoading] = useState(false);

  // Report Incident Form State
  const [repType, setRepType] = useState<'Crowd Rush' | 'Medical Emergency' | 'Lost Item' | 'Ticket Scanner Failure' | 'Unattended Bag'>('Medical Emergency');
  const [repLoc, setRepLoc] = useState('Zone B');
  const [repDesc, setRepDesc] = useState('');
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<any | null>(null);

  // Team Communications Chat
  const [radioInput, setRadioInput] = useState('');
  const [radioLogs, setRadioLogs] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Operations Command', text: 'All units check-in. Scanner failures resolved at Gate 3.', time: '19:40' },
    { sender: 'Fatima (Medical)', text: 'On-scene at Section 112. Minor heat exhaustion, administering water.', time: '19:43' }
  ]);

  // Resource Request State
  const [requestedResource, setRequestedResource] = useState('Water Cases');
  const [resourceSuccess, setResourceSuccess] = useState(false);

  // Handle Shift Query
  const handleShiftQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftQuery.trim()) return;

    setShiftLoading(true);
    try {
      const query = `As a ${currentVolunteer.role} at ${activeStadium.name}, ${shiftQuery}`;
      const res = await invokeAIAgent('Volunteer Assistant', query, language);
      setShiftResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setShiftLoading(false);
    }
  };

  // Handle Instant Translation
  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!translateText.trim()) return;

    setTransLoading(true);
    try {
      const query = `Translate this fan question into English, Spanish, and Arabic: "${translateText}"`;
      const res = await invokeAIAgent('Fan Concierge', query, language);
      setTranslateResult(res.response);
    } catch (err) {
      console.error(err);
    } finally {
      setTransLoading(false);
    }
  };

  // Handle Reporting Incident with AI Triage
  const handleReportIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repDesc.trim()) return;

    setTriageLoading(true);
    try {
      // Call AI Incident Triage Agent to classify incident
      const triageQuery = `Analyze volunteer incident report: Type: ${repType}, Location: ${repLoc}, Details: ${repDesc}`;
      const triage = await invokeAIAgent('Incident Triage Agent', triageQuery, language);
      
      setTriageResult(triage);

      // Add to global store with AI-determined severity
      addManualIncident(repType, `${activeStadium.name} - ${repLoc}`, triage.severity, repDesc);

      setRepDesc('');
      setTimeout(() => setTriageResult(null), 8000);
    } catch (err) {
      console.error(err);
    } finally {
      setTriageLoading(false);
    }
  };

  // Handle complete task
  const handleCompleteTask = (id: string) => {
    resolveIncident(id);
  };

  // Handle Radio Send
  const handleRadioSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!radioInput.trim()) return;

    const newLog = {
      sender: `${currentVolunteer.name} (${currentVolunteer.role})`,
      text: radioInput,
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
    setRadioLogs(prev => [...prev, newLog]);
    setRadioInput('');
  };

  // Handle Resource Request
  const handleResourceRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResourceSuccess(true);
    setTimeout(() => setResourceSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Columns (Profile, Task Assignments, Incident Reporter) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Profile Card */}
        <Card
          title={`Volunteer Duty Console: ${currentVolunteer.name}`}
          subtitle={`Designated Role: ${currentVolunteer.role} | Active Duty Stadium: ${activeStadium.name}`}
          headerAction={
            <Badge variant={currentVolunteer.status === 'Idle' ? 'success' : 'warning'}>
              Status: {currentVolunteer.status}
            </Badge>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Duty Station</span>
              <strong className="text-slate-200">{currentVolunteer.location}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Shift Timing</span>
              <strong className="text-slate-200">18:00 - 02:00</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Contact Phone</span>
              <strong className="text-slate-200">{currentVolunteer.phone}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Assigned Incident</span>
              <strong className={assignedTasks.length > 0 ? 'text-red-400' : 'text-emerald-400'}>
                {assignedTasks.length > 0 ? `${assignedTasks[0].type} (${assignedTasks[0].location})` : 'No Active Tasks'}
              </strong>
            </div>
          </div>
        </Card>

        {/* Task Assignments Board */}
        <Card title={t.volunteer.activeTasks} subtitle="AI prioritized security and medical dispatches">
          {assignedTasks.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-brand-dark-700 rounded-md">
              You currently have no tasks assigned. Keep radio active.
            </div>
          ) : (
            <div className="space-y-4">
              {assignedTasks.map((task) => (
                <div key={task.id} className="border border-brand-dark-700 bg-brand-dark-950 p-4 rounded-md space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex gap-2 items-center">
                        <h4 className="font-semibold text-sm text-slate-200">{task.type}</h4>
                        <Badge variant={task.severity === 'Critical' ? 'danger' : task.severity === 'High' ? 'warning' : 'info'}>
                          {task.severity} Severity
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400 mt-1 block">Reported at {task.location}</span>
                    </div>
                    <Button onClick={() => handleCompleteTask(task.id)} size="sm" variant="primary">
                      Mark Task Complete
                    </Button>
                  </div>
                  <p className="text-xs text-slate-300">{task.description}</p>
                  
                  {/* Dynamic Route Optimization */}
                  <div className="bg-brand-dark-900 p-2.5 rounded text-[11px] text-slate-400 border border-brand-dark-700/60">
                    <strong className="text-brand-blue-500 block mb-0.5">Optimized Staff Route:</strong>
                    Take Zone A escalators, follow main level service corridor, enter Gate side entrance.
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Incident Reporting with Triage */}
        <Card title={t.volunteer.reportIncident} subtitle="Generative AI Triages and suggests actions instantly">
          <form onSubmit={handleReportIncident} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                id="vol-rep-type"
                label={t.volunteer.incType}
                value={repType}
                onChange={(e: any) => setRepType(e.target.value)}
                options={[
                  { value: 'Medical Emergency', label: 'Medical Emergency (Spectator Injury/Illness)' },
                  { value: 'Crowd Rush', label: 'Crowd Control (Gate bottleneck/stampede risk)' },
                  { value: 'Ticket Scanner Failure', label: 'System Outage (Scanner/Turnstile failure)' },
                  { value: 'Unattended Bag', label: 'Security Warning (Suspicious package)' }
                ]}
              />
              <Select
                id="vol-rep-loc"
                label={t.volunteer.incLoc}
                value={repLoc}
                onChange={(e) => setRepLoc(e.target.value)}
                options={[
                  { value: 'Zone A', label: 'Zone A (North Concourse)' },
                  { value: 'Zone B', label: 'Zone B (East Plaza)' },
                  { value: 'Zone C', label: 'Zone C (South Concourse)' },
                  { value: 'Zone D', label: 'Zone D (Restroom concourse)' },
                  { value: 'Zone E', label: 'Zone E (Official FIFA Shop)' }
                ]}
              />
            </div>
            <Input
              id="vol-rep-desc"
              label={t.volunteer.incDesc}
              value={repDesc}
              onChange={(e) => setRepDesc(e.target.value)}
              placeholder="e.g. Elderly fan collapsed in line, seems conscious but lightheaded..."
              required
            />
            <Button type="submit" disabled={triageLoading} className="w-full flex items-center justify-center gap-1">
              <FileWarning size={16} />
              {triageLoading ? 'Invoking Incident Triage AI...' : 'Triage and Report Incident'}
            </Button>
          </form>

          {triageResult && (
            <div className="mt-4 border border-brand-dark-700 bg-brand-dark-950 p-4 rounded-md space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">AI Triage Classification</span>
                <Badge variant={triageResult.severity === 'Critical' ? 'danger' : 'warning'}>
                  {triageResult.severity} Severity
                </Badge>
              </div>
              <p className="text-sm font-medium text-brand-gold-500">{triageResult.suggestedAction}</p>
              <div className="text-xs text-slate-400">
                <strong>Dispatched Support:</strong> {triageResult.dispatchedRole}
              </div>
              <div className="text-[10px] text-slate-500 italic mt-1.5 font-mono">
                Reasoning: {triageResult.reasoningSummary} (Confidence: {(triageResult.confidenceScore * 100).toFixed(0)}%)
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Right Column (AI Shift Assist, Resource Request, Radio, Translation) */}
      <div className="space-y-6">
        
        {/* AI Shift Schedule Assistant */}
        <Card title={t.volunteer.shiftTitle} subtitle="Ask Shift Assistant about safety codes/duties">
          <form onSubmit={handleShiftQuerySubmit} className="space-y-3">
            <Input
              id="vol-shift-query"
              value={shiftQuery}
              onChange={(e) => setShiftQuery(e.target.value)}
              placeholder="e.g. What is the protocol for ticketing failure?"
              required
            />
            <Button type="submit" disabled={shiftLoading} className="w-full">
              {shiftLoading ? 'Consulting Assistant...' : 'Ask Shift Assistant'}
            </Button>
          </form>
          {shiftResponse && (
            <div className="mt-3 border border-brand-dark-700 bg-brand-dark-950 p-3 rounded text-xs space-y-2">
              <p className="text-slate-200">{shiftResponse.instructions}</p>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Priority: {shiftResponse.priority}</span>
                <span>Equipment: {shiftResponse.equipmentNeeded?.join(', ')}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Translation Assistant */}
        <Card title={t.volunteer.translateTitle} subtitle="Resolve fan language barriers instantly">
          <form onSubmit={handleTranslate} className="space-y-3">
            <Input
              id="vol-translate-input"
              value={translateText}
              onChange={(e) => setTranslateText(e.target.value)}
              placeholder={t.volunteer.translatePlaceholder}
              required
            />
            <Button type="submit" disabled={transLoading} className="w-full flex items-center justify-center gap-1.5">
              <Languages size={15} />
              {transLoading ? 'Translating...' : 'Translate Query'}
            </Button>
          </form>
          {translateResult && (
            <div className="mt-3 border border-brand-dark-700 bg-brand-dark-950 p-3 rounded text-xs">
              <strong className="text-brand-blue-500 block mb-1">Translations:</strong>
              <p className="text-slate-200 whitespace-pre-line">{translateResult}</p>
            </div>
          )}
        </Card>

        {/* Emergency Team Dispatch Radio */}
        <Card title={t.volunteer.commTitle} subtitle="Operations dispatch log">
          <div className="flex flex-col h-[220px]">
            <div className="flex-1 overflow-y-auto border border-brand-dark-700 bg-brand-dark-950 p-3 rounded space-y-2.5">
              {radioLogs.map((log, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-brand-gold-500">{log.sender}</span>
                    <span>{log.time}</span>
                  </div>
                  <p className="text-slate-200 mt-0.5">{log.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleRadioSend} className="mt-2 flex gap-1.5">
              <Input
                id="vol-radio-input"
                value={radioInput}
                onChange={(e) => setRadioInput(e.target.value)}
                placeholder="Broadcast to radio channel..."
                className="flex-1"
                aria-label="Broadcast input"
              />
              <Button type="submit" size="sm" className="self-end p-2.5">
                <Send size={14} />
              </Button>
            </form>
          </div>
        </Card>

        {/* Resource Requests */}
        <Card title={t.volunteer.resourcesTitle} subtitle="Request logistical supplies">
          {resourceSuccess ? (
            <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-3 rounded text-xs">
              Request Sent! Logistics is dispatching the item to your location.
            </div>
          ) : (
            <form onSubmit={handleResourceRequestSubmit} className="space-y-3">
              <Select
                id="vol-resource-select"
                label="Resource Type"
                value={requestedResource}
                onChange={(e) => setRequestedResource(e.target.value)}
                options={[
                  { value: 'Water Cases', label: 'Bottled Water Cases (for Crowd lines)' },
                  { value: 'Medical Bag', label: 'Medical Responder First-Aid Kit' },
                  { value: 'Radio Battery', label: 'Spare Radio Batteries' },
                  { value: 'High Vis Vest', label: 'High Visibility Marshall Vests' }
                ]}
              />
              <Button type="submit" className="w-full">
                Submit Resource Request
              </Button>
            </form>
          )}
        </Card>

      </div>
    </div>
  );
};
