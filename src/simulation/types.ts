export interface WeatherInfo {
  temperature: number; // in Celsius
  humidity: number; // percentage
  condition: 'Sunny' | 'Rainy' | 'Cloudy' | 'Stormy';
  delayRisk: 'Low' | 'Medium' | 'High';
}

export interface GateMetrics {
  id: string;
  name: string;
  occupancy: number; // count
  capacity: number; // max capacity
  waitTime: number; // in minutes
  status: 'Open' | 'Congested' | 'Closed';
}

export interface FacilityMetrics {
  id: string;
  name: string;
  type: 'restroom' | 'food' | 'merchandise';
  congestion: number; // percentage 0-100
  waitTime: number; // in minutes
}

export interface SecurityIncident {
  id: string;
  type: 'Crowd Rush' | 'Medical Emergency' | 'Lost Item' | 'Ticket Scanner Failure' | 'Unattended Bag' | 'Intruder';
  location: string; // e.g. "Gate 3", "Section 104"
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  status: 'Reported' | 'Dispatched' | 'Resolved';
  assignedVolunteerId?: string;
  timestamp: string;
}

export interface Volunteer {
  id: string;
  name: string;
  role: 'Crowd Marshall' | 'Medical Responder' | 'Info Desk' | 'Security Support';
  status: 'Idle' | 'Busy' | 'Off-Shift';
  location: string;
  assignedTaskId?: string;
  phone: string;
}

export interface ParkingArea {
  id: string;
  name: string;
  occupancy: number; // percentage
  status: 'Available' | 'Full' | 'Filling';
}

export interface StadiumTelemetry {
  id: string;
  name: string;
  city: string;
  capacity: number;
  occupancy: number; // current count
  operationalHealth: number; // 0-100 score
  gates: GateMetrics[];
  facilities: FacilityMetrics[];
  parking: ParkingArea[];
}

export interface TournamentSimulationState {
  tickCount: number;
  stadiums: StadiumTelemetry[];
  incidents: SecurityIncident[];
  volunteers: Volunteer[];
  weather: WeatherInfo;
  activeStadiumId: string;
}
