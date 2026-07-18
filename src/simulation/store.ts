import { create } from 'zustand';
import type { TournamentSimulationState, SecurityIncident } from './types';
import { initializeSimulation, stepSimulation } from './engine';

export interface AuditLog {
  id: string;
  timestamp: string;
  module: 'simulation' | 'ai' | 'security' | 'user';
  type: 'info' | 'warning' | 'error' | 'audit';
  message: string;
}

interface SimulationStoreState {
  state: TournamentSimulationState;
  seed: string;
  isPlaying: boolean;
  playSpeed: number; // in seconds per tick
  logs: AuditLog[];
  // Actions
  initialize: () => void;
  tick: () => void;
  reset: () => void;
  setSeed: (seed: string) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaySpeed: (speed: number) => void;
  setActiveStadium: (id: string) => void;
  addManualIncident: (type: SecurityIncident['type'], location: string, severity: SecurityIncident['severity'], description: string) => void;
  resolveIncident: (id: string) => void;
  dispatchVolunteer: (incidentId: string, volunteerId: string) => void;
  triggerEmergency: (stadiumId: string) => void;
  addLog: (module: AuditLog['module'], type: AuditLog['type'], message: string) => void;
  clearLogs: () => void;
}

export const useSimulationStore = create<SimulationStoreState>((set, get) => ({
  state: initializeSimulation('FIFA2026'),
  seed: 'FIFA2026',
  isPlaying: false,
  playSpeed: 5,
  logs: [
    {
      id: 'log-init',
      timestamp: new Date().toISOString(),
      module: 'simulation',
      type: 'info',
      message: 'System Initialized with seed: FIFA2026'
    }
  ],

  initialize: () => {
    const { seed } = get();
    const state = initializeSimulation(seed);
    set({ state });
    get().addLog('simulation', 'info', `Simulation state re-initialized with seed: ${seed}`);
  },

  tick: () => {
    const { state, seed } = get();
    const nextState = stepSimulation(state, seed);
    set({ state: nextState });

    // Log periodic milestones or incident alerts
    if (nextState.tickCount % 5 === 0) {
      get().addLog('simulation', 'info', `Simulation tick: ${nextState.tickCount}. Telemetry updated.`);
    }

    // If new incidents appeared compared to previous state, log them
    if (nextState.incidents.length > state.incidents.length) {
      const newInc = nextState.incidents[0];
      get().addLog(
        'security',
        newInc.severity === 'Critical' ? 'error' : 'warning',
        `[Incident Alert] New ${newInc.severity} severity incident reported: ${newInc.type} at ${newInc.location}`
      );
    }
  },

  reset: () => {
    const defaultSeed = 'FIFA2026';
    const state = initializeSimulation(defaultSeed);
    set({
      state,
      seed: defaultSeed,
      isPlaying: false,
      logs: [
        {
          id: `log-reset-${Date.now()}`,
          timestamp: new Date().toISOString(),
          module: 'simulation',
          type: 'info',
          message: 'Simulation and seed reset to defaults (FIFA2026).'
        }
      ]
    });
  },

  setSeed: (newSeed: string) => {
    const cleanedSeed = newSeed.trim() || 'FIFA2026';
    set({ seed: cleanedSeed });
    get().initialize();
  },

  setIsPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
    get().addLog('simulation', 'info', `Simulation clock ${playing ? 'Started' : 'Paused'}`);
  },

  setPlaySpeed: (speed: number) => {
    set({ playSpeed: speed });
    get().addLog('simulation', 'info', `Simulation speed set to 1 tick per ${speed}s`);
  },

  setActiveStadium: (id: string) => {
    set(store => ({
      state: {
        ...store.state,
        activeStadiumId: id
      }
    }));
    get().addLog('user', 'info', `Active stadium context switched to: ${id}`);
  },

  addManualIncident: (type, location, severity, description) => {
    const id = `inc-manual-${Date.now()}`;
    const newInc: SecurityIncident = {
      id,
      type,
      location,
      severity,
      description,
      status: 'Reported',
      timestamp: new Date().toISOString()
    };

    set(store => {
      // Find idle volunteer and auto-dispatch
      let updatedVolunteers = [...store.state.volunteers];
      let finalStatus: SecurityIncident['status'] = 'Reported';
      let assignedVolId: string | undefined;

      const idleVolIndex = updatedVolunteers.findIndex(v => v.status === 'Idle');
      if (idleVolIndex !== -1) {
        updatedVolunteers[idleVolIndex] = {
          ...updatedVolunteers[idleVolIndex],
          status: 'Busy',
          assignedTaskId: id
        };
        finalStatus = 'Dispatched';
        assignedVolId = updatedVolunteers[idleVolIndex].id;
      }

      const updatedIncident = {
        ...newInc,
        status: finalStatus,
        assignedVolunteerId: assignedVolId
      };

      return {
        state: {
          ...store.state,
          incidents: [updatedIncident, ...store.state.incidents],
          volunteers: updatedVolunteers
        }
      };
    });

    get().addLog('security', 'warning', `[Manual Incident] User reported: ${type} at ${location} (Severity: ${severity})`);
  },

  resolveIncident: (id: string) => {
    set(store => {
      const updatedVolunteers = [...store.state.volunteers];
      const updatedIncidents = store.state.incidents.map(inc => {
        if (inc.id === id) {
          if (inc.assignedVolunteerId) {
            const volIdx = updatedVolunteers.findIndex(v => v.id === inc.assignedVolunteerId);
            if (volIdx !== -1) {
              updatedVolunteers[volIdx] = {
                ...updatedVolunteers[volIdx],
                status: 'Idle',
                assignedTaskId: undefined
              };
            }
          }
          return { ...inc, status: 'Resolved' as const };
        }
        return inc;
      });

      return {
        state: {
          ...store.state,
          incidents: updatedIncidents,
          volunteers: updatedVolunteers
        }
      };
    });
    get().addLog('security', 'audit', `Incident ${id} marked as Resolved.`);
  },

  dispatchVolunteer: (incidentId: string, volunteerId: string) => {
    set(store => {
      const updatedVolunteers = store.state.volunteers.map(v => {
        if (v.id === volunteerId) {
          return { ...v, status: 'Busy' as const, assignedTaskId: incidentId };
        }
        // If volunteer was assigned to another incident, release them (edge case)
        return v;
      });

      const updatedIncidents = store.state.incidents.map(inc => {
        if (inc.id === incidentId) {
          return { ...inc, status: 'Dispatched' as const, assignedVolunteerId: volunteerId };
        }
        return inc;
      });

      return {
        state: {
          ...store.state,
          incidents: updatedIncidents,
          volunteers: updatedVolunteers
        }
      };
    });
    get().addLog('security', 'audit', `Volunteer ${volunteerId} dispatched manually to Incident ${incidentId}`);
  },

  triggerEmergency: (stadiumId: string) => {
    set(store => {
      // 1. Mark all gates of this stadium as Open and wait time = 0 (Evacuating)
      const updatedStadiums = store.state.stadiums.map(st => {
        if (st.id === stadiumId) {
          const evGates = st.gates.map(g => ({
            ...g,
            waitTime: 0,
            status: 'Open' as const,
            name: `${g.name} (EVACUATION MODE)`
          }));
          return {
            ...st,
            gates: evGates,
            operationalHealth: 10
          };
        }
        return st;
      });

      // 2. Create emergency security incident
      const targetStadium = store.state.stadiums.find(s => s.id === stadiumId);
      const emergencyIncident: SecurityIncident = {
        id: `emergency-${Date.now()}`,
        type: 'Crowd Rush',
        location: `${targetStadium?.name || 'Stadium'} - ALL SECTORS`,
        severity: 'Critical',
        description: 'RED ALERT: EVACUATION ORDER TRIGGERED. Emergency exit paths open.',
        status: 'Reported',
        timestamp: new Date().toISOString()
      };

      return {
        state: {
          ...store.state,
          stadiums: updatedStadiums,
          incidents: [emergencyIncident, ...store.state.incidents]
        }
      };
    });

    get().addLog('security', 'error', `!!! EMERGENCY EVACUATION TRIGGERED FOR STADIUM: ${stadiumId} !!!`);
  },

  addLog: (module, type, message) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      module,
      type,
      message
    };
    set(store => ({
      logs: [newLog, ...store.logs].slice(0, 300) // limit buffer to last 300 logs
    }));
  },

  clearLogs: () => {
    set({ logs: [] });
  }
}));
