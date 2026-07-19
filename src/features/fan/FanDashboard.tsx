import React, { useState } from 'react';
import { Compass, ShieldAlert, Sparkles } from 'lucide-react';
import { useSimulationStore } from '../../simulation/store';
import { usePreferencesStore } from '../../shared/hooks/usePreferences';
import { translations } from '../../config/i18n';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input, Select } from '../../shared/components/FormControls';
import { Badge } from '../../shared/components/Badge';
import { invokeAIAgent } from '../../ai/client';
import { secureLogger } from '../../shared/utils/security';

export const FanDashboard: React.FC = () => {
  const { state, addManualIncident } = useSimulationStore();
  const { language, highContrast, largeFont, toggleHighContrast, toggleLargeFont } = usePreferencesStore();
  const t = translations[language];

  const activeStadium = state.stadiums.find(s => s.id === state.activeStadiumId) || state.stadiums[0];

  // Concierge Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; confidence?: number; isFallback?: boolean; reasoning?: string }>>([
    { sender: 'ai', text: t.fan.conciergePlaceholder }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Navigation State
  const [navFrom, setNavFrom] = useState('Zone A');
  const [navTo, setNavTo] = useState('Gate 3');
  const [navRouteType, setNavRouteType] = useState('fastest');
  const [navResult, setNavResult] = useState<any | null>(null);
  const [navLoading, setNavLoading] = useState(false);

  // Lost & Found State
  const [lostItemName, setLostItemName] = useState('');
  const [lostItemLoc, setLostItemLoc] = useState('');
  const [lostReportSuccess, setLostReportSuccess] = useState(false);

  // Quick emergency advice
  const [emergencyAdvice, setEmergencyAdvice] = useState<any | null>(null);
  const [emLoading, setEmLoading] = useState(false);

  // Handle chat submission
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await invokeAIAgent('Fan Concierge', userText, language);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: res.response,
          confidence: res.confidenceScore,
          isFallback: res.isFallback,
          reasoning: res.reasoningSummary
        }
      ]);
    } catch (err) {
      secureLogger.error('ai', `Fan concierge assistant error: ${err instanceof Error ? err.message : String(err)}`);
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Error connecting to concierge assistant." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle navigation calculation
  const handleNavCalculate = async () => {
    setNavLoading(true);
    try {
      const query = `Plan a ${navRouteType} route from ${navFrom} to ${navTo} in the stadium. Include accessibility notes.`;
      const res = await invokeAIAgent('Navigation Assistant', query, language);
      setNavResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setNavLoading(false);
    }
  };

  // Handle lost report
  const handleLostReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostItemName || !lostItemLoc) return;

    // Simulate incident reporting into store for volunteers to review
    addManualIncident(
      'Lost Item',
      `${activeStadium.name} - ${lostItemLoc}`,
      'Low',
      `Fan reported lost item: ${lostItemName}. Please coordinate collection if located.`
    );

    setLostReportSuccess(true);
    setLostItemName('');
    setLostItemLoc('');
    setTimeout(() => setLostReportSuccess(false), 4000);
  };

  // Get Emergency Response Advisor advice
  const triggerEmergencyAdvice = async () => {
    setEmLoading(true);
    try {
      const res = await invokeAIAgent('Emergency Response Advisor', "What is the emergency safety protocol for fires or evacuation?", language);
      setEmergencyAdvice(res);
    } catch (err) {
      console.error(err);
    } finally {
      setEmLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Header if Stadium is in critical shape */}
      {activeStadium.operationalHealth < 60 && (
        <div className="bg-red-950 border border-red-800 text-red-200 px-4 py-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-red-500 animate-pulse" />
            <span className="text-sm font-semibold">
              {t.common.alert}: {activeStadium.name} is experiencing high crowd congestion! Redirecting flows...
            </span>
          </div>
          <Badge variant="danger">Health: {activeStadium.operationalHealth}%</Badge>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: AI Concierge & Chat */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title={t.fan.conciergeTitle}
            subtitle="GenAI Support Assistant (Simulated Data Indicator)"
            headerAction={
              <div className="flex items-center gap-1 text-[10px] text-brand-gold-500 font-mono">
                <Sparkles size={12} className="animate-pulse" />
                <span>MULTIPLE specialized agents active</span>
              </div>
            }
          >
            {/* Chat Box */}
            <div className="flex flex-col h-[350px]">
              <div className="flex-1 overflow-y-auto border border-brand-dark-700 bg-brand-dark-950 rounded p-4 space-y-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col max-w-[80%] ${
                      msg.sender === 'user' ? 'self-end ml-auto' : 'self-start'
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded text-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-brand-dark-800 text-slate-100 border border-brand-dark-700 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === 'ai' && msg.confidence !== undefined && (
                      <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-slate-400">
                        <span>{t.common.confidence}: {(msg.confidence * 100).toFixed(0)}%</span>
                        {msg.isFallback && <span className="text-yellow-500">{t.common.fallback}</span>}
                        {msg.reasoning && (
                          <span className="block italic text-slate-500">Reasoning: {msg.reasoning}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {chatLoading && (
                  <div className="text-xs text-slate-400 animate-pulse flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                    <span>{t.common.loading}</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="mt-3 flex gap-2">
                <Input
                  id="fan-chat-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t.fan.conciergePlaceholder}
                  aria-label="Concierge Message Input"
                  className="flex-1"
                />
                <Button type="submit" disabled={chatLoading} variant="primary" className="self-end">
                  {t.common.submit}
                </Button>
              </form>
            </div>
          </Card>

          {/* AI Navigation Panel */}
          <Card
            title={t.fan.navTitle}
            subtitle="Computes routes using dynamic congestion values"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                id="nav-from-select"
                label={t.fan.navFrom}
                value={navFrom}
                onChange={(e) => setNavFrom(e.target.value)}
                options={[
                  { value: 'Zone A', label: 'Zone A (North Gate)' },
                  { value: 'Zone C', label: 'Zone C (East Corridor)' },
                  { value: 'Zone E', label: 'Zone E (South West Lobby)' }
                ]}
              />
              <Select
                id="nav-to-select"
                label={t.fan.navTo}
                value={navTo}
                onChange={(e) => setNavTo(e.target.value)}
                options={[
                  { value: 'Gate 2', label: 'Gate 2 Entrance' },
                  { value: 'Food Court', label: 'Pampa Grill Food Court' },
                  { value: 'Section 104', label: 'Seat Sector 104' }
                ]}
              />
              <Select
                id="nav-type-select"
                label="Route Parameter"
                value={navRouteType}
                onChange={(e) => setNavRouteType(e.target.value)}
                options={[
                  { value: 'fastest', label: t.fan.navOptionFastest },
                  { value: 'less-crowded', label: t.fan.navOptionLessCrowded },
                  { value: 'accessible', label: t.fan.navOptionAccessible }
                ]}
              />
            </div>
            <Button
              onClick={handleNavCalculate}
              disabled={navLoading}
              className="mt-4 w-full flex items-center justify-center gap-1"
            >
              <Compass size={16} />
              {navLoading ? 'Computing Route...' : t.fan.navButton}
            </Button>

            {/* Nav results */}
            {navResult && (
              <div className="mt-4 border border-brand-dark-700 bg-brand-dark-950 p-4 rounded space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-300">Route Directions (Simulated Path)</span>
                  <Badge variant="info">{navResult.estimatedWaitMinutes} min wait</Badge>
                </div>
                <p className="text-sm text-slate-200">{navResult.routeDescription}</p>
                <ul className="text-xs text-slate-400 list-decimal pl-5 space-y-1">
                  {navResult.routeSteps?.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
                <div className="text-[11px] text-slate-400 italic">
                  <strong>Accessibility Notes:</strong> {navResult.accessibilityNotes}
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 border-t border-brand-dark-700 pt-2 font-mono">
                  <span>Confidence: {(navResult.confidenceScore * 100).toFixed(0)}%</span>
                  {navResult.isFallback && <span>Fallback Enabled</span>}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Queue Telemetry & Preferences */}
        <div className="space-y-6">
          
          {/* Accessibility Settings */}
          <Card title={t.fan.accTitle}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Contrast Settings</span>
                <Button size="sm" variant={highContrast ? 'warning' : 'secondary'} onClick={toggleHighContrast}>
                  {t.fan.contrastBtn}
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Text Zoom (120%)</span>
                <Button size="sm" variant={largeFont ? 'warning' : 'secondary'} onClick={toggleLargeFont}>
                  {t.fan.fontSizeBtn}
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Safety Instructions</span>
                <Button size="sm" variant="danger" onClick={triggerEmergencyAdvice} disabled={emLoading}>
                  Get Safety Egress Advice
                </Button>
              </div>
            </div>

            {emergencyAdvice && (
              <div className="mt-3 border border-red-900 bg-red-950/40 p-3 rounded text-xs space-y-2">
                <h4 className="font-bold text-red-400">{emergencyAdvice.alertHeadline}</h4>
                <ul className="list-disc pl-4 text-slate-300 space-y-1">
                  {emergencyAdvice.evacuationDirections.map((dir: string, i: number) => (
                    <li key={i}>{dir}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Queue Wait Predictions */}
          <Card title={t.fan.queuePredTitle} subtitle="Current gate and concession lines">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs text-slate-400 mb-2 font-semibold">Stadium Entry Gates</h4>
                <div className="space-y-2">
                  {activeStadium.gates.map((g) => (
                    <div key={g.id} className="flex justify-between items-center text-xs">
                      <span>{g.name}</span>
                      <div className="flex gap-2 items-center">
                        <span className="text-slate-400">{g.occupancy} fans</span>
                        <Badge variant={g.waitTime > 20 ? 'danger' : g.waitTime > 10 ? 'warning' : 'success'}>
                          {g.waitTime}m wait
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-brand-dark-700 pt-3">
                <h4 className="text-xs text-slate-400 mb-2 font-semibold">Concessions & Restrooms</h4>
                <div className="space-y-2">
                  {activeStadium.facilities.map((f) => (
                    <div key={f.id} className="flex justify-between items-center text-xs">
                      <span>{f.name}</span>
                      <div className="flex gap-2 items-center">
                        <span className="text-slate-400">Lines: {f.congestion}%</span>
                        <Badge variant={f.congestion > 75 ? 'danger' : f.congestion > 45 ? 'warning' : 'success'}>
                          {f.waitTime}m wait
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Lost & Found */}
          <Card title={t.fan.lostFoundTitle} subtitle="Simulates volunteer report creation">
            {lostReportSuccess ? (
              <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-3 rounded text-xs">
                Log Submitted! Operations volunteers have been notified to monitor the database.
              </div>
            ) : (
              <form onSubmit={handleLostReportSubmit} className="space-y-3">
                <Input
                  id="lost-item-input"
                  label="Description of Item"
                  placeholder="e.g. Leather Wallet, iPhone 14"
                  value={lostItemName}
                  onChange={(e) => setLostItemName(e.target.value)}
                  required
                />
                <Select
                  id="lost-loc-select"
                  label="Last Seen Area"
                  value={lostItemLoc}
                  onChange={(e) => setLostItemLoc(e.target.value)}
                  options={[
                    { value: '', label: 'Select Area' },
                    { value: 'Food Court', label: 'Pampa Grill Concourse' },
                    { value: 'Section 104', label: 'Seat Sector 104 Row M' },
                    { value: 'Gate 2 restroom', label: 'Restroom Block B' }
                  ]}
                  required
                />
                <Button type="submit" className="w-full">
                  {t.fan.lostReportBtn}
                </Button>
              </form>
            )}
          </Card>

          {/* Timeline */}
          <Card title={t.fan.timelineTitle} subtitle="Personalized schedule">
            <div className="space-y-3 relative pl-4 border-l border-brand-dark-700 text-xs">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full border border-brand-dark-900" />
                <span className="text-[10px] text-slate-400 block">17:00</span>
                <span className="font-semibold text-slate-200">Gates Open for General Admission</span>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-slate-500 rounded-full border border-brand-dark-900" />
                <span className="text-[10px] text-slate-400 block">18:00</span>
                <span className="font-semibold text-slate-200">Team warmups and pre-match show</span>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-slate-500 rounded-full border border-brand-dark-900" />
                <span className="text-[10px] text-slate-400 block">19:00</span>
                <span className="font-semibold text-slate-200">Match Kick-off (Group Stage)</span>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};
