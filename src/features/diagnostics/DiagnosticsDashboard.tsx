import React, { useState } from 'react';
import { Trash2, Cpu, HardDrive, AlertCircle } from 'lucide-react';
import { useSimulationStore } from '../../simulation/store';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/FormControls';
import { Badge } from '../../shared/components/Badge';

export const DiagnosticsDashboard: React.FC = () => {
  const { logs, clearLogs, addLog } = useSimulationStore();
  const [apiKeyInput, setApiKeyInput] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [keySaved, setKeySaved] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    // Dynamically store the API key in import.meta.env or a global variable so the AI client picks it up
    (import.meta.env as any).VITE_GEMINI_API_KEY = apiKeyInput.trim();
    setKeySaved(true);
    addLog('user', 'info', apiKeyInput.trim() ? 'User configured live Gemini API key.' : 'User cleared Gemini API key.');
    setTimeout(() => setKeySaved(false), 3000);
  };

  const getLogTypeColor = (type: string) => {
    if (type === 'error') return 'danger';
    if (type === 'warning') return 'warning';
    if (type === 'audit') return 'info';
    return 'neutral';
  };

  const filteredLogs = logs.filter(log => {
    if (filterType === 'all') return true;
    return log.module === filterType;
  });

  return (
    <div className="space-y-6">
      
      {/* Dynamic API Configuration and Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* API Key Panel */}
        <Card
          title="Generative AI Credentials Control"
          subtitle="Input Gemini API key to activate Live AI agents"
        >
          <form onSubmit={handleSaveKey} className="space-y-3">
            <Input
              id="api-key-input"
              type="password"
              label="Google Gemini API Key"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="text-xs font-mono"
            />
            <Button type="submit" size="sm" className="w-full text-xs">
              Save and Register Key
            </Button>
          </form>
          {keySaved && (
            <div className="mt-2.5 text-xs text-emerald-400 font-semibold text-center">
              API key successfully updated! Live AI mode enabled.
            </div>
          )}
        </Card>

        {/* Operational Health of AI Hub */}
        <Card title="AI Agent Framework Health" subtitle="Operational metrics of specialized LLM layers">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span>Active Agents count</span>
              <strong className="text-slate-100">8 specialized nodes</strong>
            </div>
            <div className="flex justify-between items-center">
              <span>Primary Engine model</span>
              <strong className="text-slate-200">gemini-2.5-flash</strong>
            </div>
            <div className="flex justify-between items-center">
              <span>Connection Status</span>
              <Badge variant={import.meta.env.VITE_GEMINI_API_KEY ? 'success' : 'warning'}>
                {import.meta.env.VITE_GEMINI_API_KEY ? 'LIVE (Gemini API)' : 'DEGRADED (Offline Rule-Based)'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Prompt Validation</span>
              <strong className="text-slate-200">Zod schemas active</strong>
            </div>
          </div>
        </Card>

        {/* Host Node System telemetry metrics */}
        <Card title="Virtual Host System Telemetry" subtitle="Simulated infrastructure KPIs">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border border-brand-dark-700 bg-brand-dark-950 p-2.5 rounded">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Memory Buffer</span>
              <div className="flex items-center justify-between mt-1">
                <HardDrive size={13} className="text-slate-400" />
                <span className="font-bold text-slate-200">428 MB / 1024 MB</span>
              </div>
            </div>
            <div className="border border-brand-dark-700 bg-brand-dark-950 p-2.5 rounded">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">CPU Load</span>
              <div className="flex items-center justify-between mt-1">
                <Cpu size={13} className="text-slate-400" />
                <span className="font-bold text-slate-200">12.4%</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 mt-3 flex items-center gap-1">
            <AlertCircle size={10} />
            <span>Virtual host metrics simulated for operations audit compliance.</span>
          </div>
        </Card>
      </div>

      {/* Central Logging Console */}
      <Card
        title="Central Observability Log Collector"
        subtitle="Browse audit trail of AI agent inputs, simulation telemetry ticks, security blocks, and user decisions"
        headerAction={
          <div className="flex gap-2">
            <select
              aria-label="Filter Logs"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-brand-dark-950 border border-brand-dark-700 text-xs rounded px-2.5 py-1 text-slate-200 focus:outline-none"
            >
              <option value="all">All Logs Modules</option>
              <option value="simulation">Simulation Engine</option>
              <option value="ai">AI Agent Service</option>
              <option value="security">Security System</option>
              <option value="user">User Operations</option>
            </select>
            <Button variant="secondary" size="sm" onClick={clearLogs} className="p-1 px-2.5 flex items-center gap-1">
              <Trash2 size={13} /> Clear Logs
            </Button>
          </div>
        }
      >
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto border border-brand-dark-700 bg-black rounded p-3 font-mono text-xs space-y-2 select-text selection:bg-slate-700">
            {filteredLogs.length === 0 ? (
              <span className="text-slate-500 text-center block py-8">Buffer empty. Awaiting system operations...</span>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="flex gap-3 items-start hover:bg-slate-900/40 py-0.5 px-1 rounded">
                  <span className="text-slate-500 shrink-0 select-none">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <Badge variant={getLogTypeColor(log.type)} className="shrink-0 select-none uppercase text-[8px] px-1 py-0.2">
                    {log.module}
                  </Badge>
                  <span className="text-slate-300 break-all">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

    </div>
  );
};
