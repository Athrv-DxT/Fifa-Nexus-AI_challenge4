import React, { useEffect } from 'react';
import { ShieldCheck, Calendar, Users, Activity, Sliders, ShieldAlert, Languages, Accessibility, Eye } from 'lucide-react';
import { useSimulationStore } from './simulation/store';
import { usePreferencesStore } from './shared/hooks/usePreferences';
import { translations } from './config/i18n';
import type { SupportedLanguage } from './config/i18n';
import { Button } from './shared/components/Button';
import { checkPermissions, secureLogger } from './shared/utils/security';
import type { UserRole } from './shared/utils/security';

// Lazy load dashboard components for build optimization and code splitting
const FanDashboard = React.lazy(() =>
  import('./features/fan/FanDashboard').then((m) => ({ default: m.FanDashboard }))
);
const VolunteerDashboard = React.lazy(() =>
  import('./features/volunteer/VolunteerDashboard').then((m) => ({ default: m.VolunteerDashboard }))
);
const OperationsDashboard = React.lazy(() =>
  import('./features/operations/OperationsDashboard').then((m) => ({ default: m.OperationsDashboard }))
);
const ExecutiveDashboard = React.lazy(() =>
  import('./features/executive/ExecutiveDashboard').then((m) => ({ default: m.ExecutiveDashboard }))
);
const DiagnosticsDashboard = React.lazy(() =>
  import('./features/diagnostics/DiagnosticsDashboard').then((m) => ({ default: m.DiagnosticsDashboard }))
);

function App() {
  const { state, tick, isPlaying, playSpeed, setActiveStadium } = useSimulationStore();
  const { language, setLanguage, highContrast, toggleHighContrast, toggleLargeFont, userRole, setUserRole } = usePreferencesStore();
  const t = translations[language];

  // Active View Tab State
  const [activeTab, setActiveTab] = React.useState<'fan' | 'volunteer' | 'operations' | 'executive' | 'diagnostics'>('operations');
  
  // Local network online/offline status
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  // Simulation Clock Auto-Ticking Effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        tick();
      }, playSpeed * 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playSpeed, tick]);

  // Network connection status listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      secureLogger.info('simulation', 'Network connection restored. Device is online.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      secureLogger.warning('simulation', 'Network connection lost. Device is offline.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguage);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    secureLogger.info('user', `Role changed from ${userRole} to ${newRole}`);
    
    const defaultTabMap: Record<UserRole, 'fan' | 'volunteer' | 'operations' | 'executive'> = {
      Fan: 'fan',
      Volunteer: 'volunteer',
      Operations: 'operations',
      Executive: 'executive'
    };
    
    if (!checkPermissions(newRole, activeTab)) {
      const fallbackTab = defaultTabMap[newRole];
      setActiveTab(fallbackTab);
      secureLogger.warning('security', `Redirected from protected view '${activeTab}' to '${fallbackTab}' due to role change`);
    }
  };

  const handleTabSwitch = (tab: 'fan' | 'volunteer' | 'operations' | 'executive' | 'diagnostics') => {
    if (checkPermissions(userRole, tab)) {
      setActiveTab(tab);
      secureLogger.info('user', `Navigated to tab: ${tab}`);
    } else {
      secureLogger.security(`Unauthorized navigation attempt to tab: ${tab} by role: ${userRole}`);
      alert(`Access Denied: Your role (${userRole}) is not authorized to access this view.`);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark-950 text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Skip Navigation Link for Screen Readers (WCAG AA Compliance) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-blue-500 text-white px-4 py-2 rounded shadow z-50 font-bold"
      >
        {t.nav.skipLink}
      </a>

      {/* Corporate Dashboard Header */}
      <header className="border-b border-brand-dark-700 bg-brand-dark-900 px-5 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="text-brand-blue-500 w-7 h-7" />
          <div>
            <h1 className="text-base font-black tracking-wider text-slate-100 flex items-center gap-1.5">
              FIFA NEXUS AI
              <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 font-mono px-1.5 py-0.5 rounded uppercase">
                Enterprise Operations Command
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>World Cup 2026 Telemetry Node</span>
              <span>•</span>
              <span className="text-brand-gold-500 font-mono">Seed: FIFA2026 (Simulated Data)</span>
            </p>
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          
          {/* Connection Status Badge */}
          <div className="flex items-center gap-1.5 pr-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400">
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          {/* Active Stadium Switcher */}
          <div className="flex items-center gap-1.5 border-l border-brand-dark-700 pl-3">
            <label htmlFor="global-venue-select" className="text-slate-400 font-semibold text-[10px] uppercase">
              Venue
            </label>
            <select
              id="global-venue-select"
              value={state.activeStadiumId}
              onChange={(e) => setActiveStadium(e.target.value)}
              className="bg-brand-dark-950 border border-brand-dark-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue-500"
            >
              {state.stadiums.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1.5 border-l border-brand-dark-700 pl-3">
            <Languages size={14} className="text-slate-400" />
            <select
              id="global-lang-select"
              aria-label="Language Selector"
              value={language}
              onChange={handleLanguageChange}
              className="bg-brand-dark-950 border border-brand-dark-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue-500"
            >
              <option value="en">English (EN)</option>
              <option value="es">Español (ES)</option>
              <option value="fr">Français (FR)</option>
              <option value="pt">Português (PT)</option>
              <option value="ar">العربية (AR - RTL)</option>
              <option value="hi">हिन्दी (HI)</option>
            </select>
          </div>

          {/* Role Selector Dropdown */}
          <div className="flex items-center gap-1.5 border-l border-brand-dark-700 pl-3">
            <label htmlFor="global-role-select" className="text-slate-400 font-semibold text-[10px] uppercase">
              Role
            </label>
            <select
              id="global-role-select"
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="bg-brand-dark-950 border border-brand-dark-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue-500 font-mono text-[11px]"
            >
              <option value="Fan">Fan</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Operations">Operations</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          {/* Accessibility Quick Panel */}
          <div className="flex items-center gap-1 border-l border-brand-dark-700 pl-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleHighContrast}
              title="Toggle High Contrast Mode"
              className={`p-1.5 ${highContrast ? 'text-brand-gold-500 bg-brand-dark-800' : 'text-slate-400'}`}
            >
              <Eye size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLargeFont}
              title="Toggle Large Font Size"
              className="p-1.5 text-slate-400"
            >
              <Accessibility size={14} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Console Panel */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar accessible Navigation menu */}
        <nav
          role="navigation"
          aria-label="Operations Personas Switcher"
          className="w-full md:w-[240px] border-r border-brand-dark-700 bg-brand-dark-900/60 p-3 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0"
        >
          {checkPermissions(userRole, 'fan') && (
            <button
              onClick={() => handleTabSwitch('fan')}
              aria-current={activeTab === 'fan' ? 'page' : undefined}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded text-left text-xs font-semibold w-full transition-all focus:outline-none focus:ring-1 focus:ring-brand-blue-500 ${
                activeTab === 'fan'
                  ? 'bg-brand-dark-800 text-brand-blue-500 border-l-2 border-l-brand-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-brand-dark-800/40'
              }`}
            >
              <Calendar size={14} />
              <span>{t.nav.fan}</span>
            </button>
          )}
          
          {checkPermissions(userRole, 'volunteer') && (
            <button
              onClick={() => handleTabSwitch('volunteer')}
              aria-current={activeTab === 'volunteer' ? 'page' : undefined}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded text-left text-xs font-semibold w-full transition-all focus:outline-none focus:ring-1 focus:ring-brand-blue-500 ${
                activeTab === 'volunteer'
                  ? 'bg-brand-dark-800 text-brand-blue-500 border-l-2 border-l-brand-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-brand-dark-800/40'
              }`}
            >
              <Users size={14} />
              <span>{t.nav.volunteer}</span>
            </button>
          )}

          {checkPermissions(userRole, 'operations') && (
            <button
              onClick={() => handleTabSwitch('operations')}
              aria-current={activeTab === 'operations' ? 'page' : undefined}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded text-left text-xs font-semibold w-full transition-all focus:outline-none focus:ring-1 focus:ring-brand-blue-500 ${
                activeTab === 'operations'
                  ? 'bg-brand-dark-800 text-brand-blue-500 border-l-2 border-l-brand-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-brand-dark-800/40'
              }`}
            >
              <Activity size={14} />
              <span>{t.nav.operations}</span>
            </button>
          )}

          {checkPermissions(userRole, 'executive') && (
            <button
              onClick={() => handleTabSwitch('executive')}
              aria-current={activeTab === 'executive' ? 'page' : undefined}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded text-left text-xs font-semibold w-full transition-all focus:outline-none focus:ring-1 focus:ring-brand-blue-500 ${
                activeTab === 'executive'
                  ? 'bg-brand-dark-800 text-brand-blue-500 border-l-2 border-l-brand-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-brand-dark-800/40'
              }`}
            >
              <ShieldAlert size={14} />
              <span>{t.nav.executive}</span>
            </button>
          )}

          <div className="hidden md:block my-2 border-t border-brand-dark-700" />

          {checkPermissions(userRole, 'diagnostics') && (
            <button
              onClick={() => handleTabSwitch('diagnostics')}
              aria-current={activeTab === 'diagnostics' ? 'page' : undefined}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded text-left text-xs font-semibold w-full transition-all focus:outline-none focus:ring-1 focus:ring-brand-blue-500 md:mt-auto ${
                activeTab === 'diagnostics'
                  ? 'bg-brand-dark-800 text-brand-blue-500 border-l-2 border-l-brand-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-brand-dark-800/40'
              }`}
            >
              <Sliders size={14} />
              <span>{t.nav.diagnostics}</span>
            </button>
          )}
        </nav>

        {/* Console View Area */}
        <main id="main-content" className="flex-1 p-6 overflow-y-auto" tabIndex={-1}>
          {!checkPermissions(userRole, activeTab) ? (
            <div className="bg-red-950/20 border border-red-500/30 rounded p-6 max-w-xl mx-auto my-12 text-center space-y-4">
              <ShieldAlert className="text-red-500 w-12 h-12 mx-auto animate-bounce" />
              <h2 className="text-lg font-bold text-red-400">Access Denied</h2>
              <p className="text-slate-300 text-sm">
                Your active role ({userRole}) is not authorized to view the requested control deck ({activeTab}).
                This access attempt has been logged for security audit.
              </p>
              <Button variant="danger" size="sm" onClick={() => handleRoleChange('Fan')}>
                Reset to Safe Default Dashboard
              </Button>
            </div>
          ) : (
            <React.Suspense fallback={
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <div className="w-8 h-8 border-4 border-brand-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  Loading Control Deck...
                </span>
              </div>
            }>
              {activeTab === 'fan' && <FanDashboard />}
              {activeTab === 'volunteer' && <VolunteerDashboard />}
              {activeTab === 'operations' && <OperationsDashboard />}
              {activeTab === 'executive' && <ExecutiveDashboard />}
              {activeTab === 'diagnostics' && <DiagnosticsDashboard />}
            </React.Suspense>
          )}
        </main>
      </div>

      {/* Global Safety Egress alert bar if emergency evacuation active */}
      {state.incidents.some(i => i.id.startsWith('emergency-') && i.status !== 'Resolved') && (
        <div className="bg-red-600 text-white text-center py-2 text-xs font-black tracking-widest animate-pulse border-t border-red-500 flex justify-center items-center gap-2">
          <span>🚨 EVACUATION PROTOCOL ACTIVE. GATES DISENGAGED FOR EGRESS. 🚨</span>
        </div>
      )}
    </div>
  );
}

export default App;
