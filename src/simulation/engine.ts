import { LCG } from './lcg';
import type {
  TournamentSimulationState,
  StadiumTelemetry,
  GateMetrics,
  FacilityMetrics,
  ParkingArea,
  Volunteer,
  SecurityIncident,
  WeatherInfo
} from './types';

const STADIUM_TEMPLATES = [
  { id: 'us-metlife', name: 'MetLife Stadium', city: 'East Rutherford, NJ', capacity: 82500 },
  { id: 'us-sofi', name: 'SoFi Stadium', city: 'Inglewood, CA', capacity: 70240 },
  { id: 'us-mercedes', name: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', capacity: 71000 }
];

const VOLUNTEER_NAMES = [
  'Carlos Silva', 'Fatima Al-Harbi', 'Priya Sharma', 'John Doe',
  'Elena Rostova', 'Jean-Pierre', 'Sofia Rodriguez', 'Yuki Tanaka',
  'Liam Neeson', 'Amara Okafor'
];

const VOLUNTEER_ROLES = [
  'Crowd Marshall', 'Medical Responder', 'Info Desk', 'Security Support'
] as const;

const INCIDENT_TYPES = [
  { type: 'Crowd Rush' as const, severity: 'High' as const, desc: 'Heavy bottlenecking causing high congestion.' },
  { type: 'Medical Emergency' as const, severity: 'Critical' as const, desc: 'Spectator experiencing heat exhaustion.' },
  { type: 'Lost Item' as const, severity: 'Low' as const, desc: 'Lost passport reported near concession stands.' },
  { type: 'Ticket Scanner Failure' as const, severity: 'Medium' as const, desc: 'Scanner at Gate 3 offline due to power surge.' },
  { type: 'Unattended Bag' as const, severity: 'High' as const, desc: 'Suspicious backpack left at Section 112.' }
];

/**
 * Initializes the tournament state using a deterministic seed.
 */
export function initializeSimulation(seed: string): TournamentSimulationState {
  const l = new LCG(seed);

  // Initialize Weather
  const weather: WeatherInfo = {
    temperature: Math.round(l.nextRange(22, 34)),
    humidity: Math.round(l.nextRange(40, 85)),
    condition: l.choice(['Sunny', 'Cloudy', 'Rainy']),
    delayRisk: 'Low'
  };
  if (weather.condition === 'Rainy') {
    weather.delayRisk = l.choice(['Medium', 'High']);
  }

  // Initialize Volunteers
  const volunteers: Volunteer[] = VOLUNTEER_NAMES.map((name, i) => {
    const role = VOLUNTEER_ROLES[i % VOLUNTEER_ROLES.length];
    return {
      id: `vol-${i + 1}`,
      name,
      role,
      status: 'Idle',
      location: `Zone ${String.fromCharCode(65 + (i % 6))}`,
      phone: `+1-555-010${i}`
    };
  });

  // Initialize Stadiums
  const stadiums: StadiumTelemetry[] = STADIUM_TEMPLATES.map((st) => {
    // Generate Gates
    const gates: GateMetrics[] = Array.from({ length: 4 }).map((_, gi) => {
      const waitTime = Math.round(l.nextRange(2, 25));
      return {
        id: `${st.id}-gate-${gi + 1}`,
        name: `Gate ${gi + 1}`,
        occupancy: 0,
        capacity: Math.round(st.capacity / 4),
        waitTime,
        status: waitTime > 20 ? 'Congested' : 'Open'
      };
    });

    // Generate Facilities
    const facilities: FacilityMetrics[] = [
      { id: `${st.id}-facility-1`, name: 'Restroom Block A', type: 'restroom', congestion: 10, waitTime: 1 },
      { id: `${st.id}-facility-2`, name: 'Restroom Block B', type: 'restroom', congestion: 45, waitTime: 5 },
      { id: `${st.id}-facility-3`, name: 'Pampa Grill Food Court', type: 'food', congestion: 70, waitTime: 12 },
      { id: `${st.id}-facility-4`, name: 'Copa Fast Food', type: 'food', congestion: 30, waitTime: 4 },
      { id: `${st.id}-facility-5`, name: 'Official FIFA Store', type: 'merchandise', congestion: 60, waitTime: 8 }
    ];

    // Generate Parking
    const parking: ParkingArea[] = Array.from({ length: 4 }).map((_, pi) => {
      const occ = Math.round(l.nextRange(30, 95));
      return {
        id: `${st.id}-parking-${String.fromCharCode(65 + pi)}`,
        name: `Lot ${String.fromCharCode(65 + pi)}`,
        occupancy: occ,
        status: occ >= 90 ? 'Full' : occ >= 75 ? 'Filling' : 'Available'
      };
    });

    // Fill Initial Occupancy
    const baseOccupancy = Math.round(st.capacity * l.nextRange(0.65, 0.85));

    // Distribute occupancy across gates
    gates.forEach(g => {
      g.occupancy = Math.round(baseOccupancy / 4 + l.nextRange(-1000, 1000));
    });

    return {
      id: st.id,
      name: st.name,
      city: st.city,
      capacity: st.capacity,
      occupancy: baseOccupancy,
      operationalHealth: 100, // Calculated during tick updates
      gates,
      facilities,
      parking
    };
  });

  // Calculate Operational Health Score for each stadium initially
  stadiums.forEach(s => {
    s.operationalHealth = calculateHealth(s, []);
  });

  // Initial Security Incidents
  const incidents: SecurityIncident[] = [
    {
      id: 'inc-1',
      type: 'Ticket Scanner Failure',
      location: 'Gate 2',
      severity: 'Medium',
      description: 'Barcode scanner offline. Volunteers manually validating ticket numbers.',
      status: 'Reported',
      timestamp: new Date().toISOString()
    }
  ];

  return {
    tickCount: 0,
    stadiums,
    incidents,
    volunteers,
    weather,
    activeStadiumId: 'us-metlife'
  };
}

/**
 * Calculates operational health of a stadium based on its gates wait time,
 * facility congestions, and active unresolved incidents.
 */
function calculateHealth(stadium: StadiumTelemetry, incidents: SecurityIncident[]): number {
  let penalty = 0;

  // Wait time penalties
  stadium.gates.forEach(g => {
    if (g.waitTime > 20) penalty += 8;
    else if (g.waitTime > 10) penalty += 3;
  });

  // Concession/Restroom congestion penalties
  stadium.facilities.forEach(f => {
    if (f.congestion > 85) penalty += 6;
    else if (f.congestion > 65) penalty += 2;
  });

  // Incidents penalties for this stadium specifically
  const stadiumIncidents = incidents.filter(
    inc => inc.status !== 'Resolved' && inc.location.toLowerCase().includes(stadium.id.split('-')[1])
  );
  stadiumIncidents.forEach(inc => {
    if (inc.severity === 'Critical') penalty += 25;
    else if (inc.severity === 'High') penalty += 15;
    else penalty += 5;
  });

  const health = 100 - penalty;
  return Math.max(10, Math.min(100, health));
}

/**
 * Advances the simulation by 1 tick deterministically.
 */
export function stepSimulation(state: TournamentSimulationState, baseSeed: string): TournamentSimulationState {
  const nextTick = state.tickCount + 1;
  // Combine base seed and tick number to get a unique but completely deterministic seed for this tick
  const l = new LCG(`${baseSeed}_tick_${nextTick}`);

  // 1. Weather fluctuations
  const tempDelta = l.nextRange(-0.5, 0.5);
  const currentTemp = Math.max(15, Math.min(40, state.weather.temperature + tempDelta));
  const newWeather: WeatherInfo = {
    ...state.weather,
    temperature: parseFloat(currentTemp.toFixed(1)),
    humidity: Math.max(30, Math.min(95, Math.round(state.weather.humidity + l.nextRange(-2, 2))))
  };

  // 2. Volunteers movement & state changes
  const newVolunteers = state.volunteers.map(vol => {
    // If volunteer is busy, they have a 25% chance of finishing task and returning to Idle
    if (vol.status === 'Busy') {
      const finishes = l.next() < 0.25;
      if (finishes) {
        return { ...vol, status: 'Idle' as const, assignedTaskId: undefined };
      }
    }
    // If volunteer is idle, they have a 10% chance of moving to another stadium sector
    if (vol.status === 'Idle' && l.next() < 0.1) {
      const nextLocation = `Zone ${String.fromCharCode(65 + l.nextInt(0, 5))}`;
      return { ...vol, location: nextLocation };
    }
    return vol;
  });

  // 3. Incidents evolution
  let newIncidents = state.incidents.map(inc => {
    // Automatically dispatch a volunteer if reported and we have idle volunteers
    if (inc.status === 'Reported') {
      const idleVol = newVolunteers.find(v => v.status === 'Idle');
      if (idleVol) {
        idleVol.status = 'Busy';
        idleVol.assignedTaskId = inc.id;
        return { ...inc, status: 'Dispatched' as const, assignedVolunteerId: idleVol.id };
      }
    }
    // If dispatched, there is a 30% chance of resolution per tick
    if (inc.status === 'Dispatched') {
      const resolves = l.next() < 0.3;
      if (resolves) {
        // Find assigned volunteer and release them
        const vol = newVolunteers.find(v => v.id === inc.assignedVolunteerId);
        if (vol) {
          vol.status = 'Idle';
          vol.assignedTaskId = undefined;
        }
        return { ...inc, status: 'Resolved' as const };
      }
    }
    return inc;
  });

  // Deterministically generate a new incident every 4-5 ticks (cap at 10 active incidents)
  const activeCount = newIncidents.filter(i => i.status !== 'Resolved').length;
  if (nextTick % 4 === 0 && activeCount < 10) {
    const template = l.choice(INCIDENT_TYPES);
    const randomStadium = l.choice(STADIUM_TEMPLATES);
    const zone = `Zone ${String.fromCharCode(65 + l.nextInt(0, 5))}`;
    const newInc: SecurityIncident = {
      id: `inc-${nextTick}-${l.nextInt(100, 999)}`,
      type: template.type,
      location: `${randomStadium.name} - ${zone}`,
      severity: template.severity,
      description: template.desc,
      status: 'Reported',
      timestamp: new Date().toISOString()
    };
    newIncidents = [newInc, ...newIncidents];
  }

  // 4. Stadiums Telemetry updates
  const newStadiums = state.stadiums.map(st => {
    // Occupancy fluctuates by +/- 1.5%
    const changePct = l.nextRange(-0.015, 0.018);
    const newOccupancy = Math.max(
      Math.round(st.capacity * 0.4),
      Math.min(st.capacity, Math.round(st.occupancy * (1 + changePct)))
    );

    // Update gates
    const newGates = st.gates.map(gate => {
      const shift = l.nextInt(-3, 4);
      const waitTime = Math.max(1, Math.min(45, gate.waitTime + shift));
      return {
        ...gate,
        occupancy: Math.round(newOccupancy / 4 + l.nextRange(-800, 800)),
        waitTime,
        status: waitTime > 25 ? ('Congested' as const) : waitTime < 5 ? ('Closed' as const) : ('Open' as const)
      };
    });

    // Update facilities
    const newFacilities = st.facilities.map(fac => {
      const delta = l.nextInt(-8, 9);
      const newCongestion = Math.max(5, Math.min(100, fac.congestion + delta));
      // Calculate wait time based on congestion
      let waitTime = Math.round(newCongestion * 0.15);
      if (fac.type === 'restroom') {
        waitTime = Math.round(newCongestion * 0.08);
      }
      return {
        ...fac,
        congestion: newCongestion,
        waitTime: Math.max(1, waitTime)
      };
    });

    // Update parking
    const newParking = st.parking.map(p => {
      const delta = l.nextInt(-3, 4);
      const newOcc = Math.max(10, Math.min(100, p.occupancy + delta));
      return {
        ...p,
        occupancy: newOcc,
        status: newOcc >= 92 ? ('Full' as const) : newOcc >= 78 ? ('Filling' as const) : ('Available' as const)
      };
    });

    const updatedStadium = {
      ...st,
      occupancy: newOccupancy,
      gates: newGates,
      facilities: newFacilities,
      parking: newParking,
      operationalHealth: 100 // placeholder recalculation below
    };

    updatedStadium.operationalHealth = calculateHealth(updatedStadium, newIncidents);
    return updatedStadium;
  });

  return {
    tickCount: nextTick,
    stadiums: newStadiums,
    incidents: newIncidents,
    volunteers: newVolunteers,
    weather: newWeather,
    activeStadiumId: state.activeStadiumId
  };
}
