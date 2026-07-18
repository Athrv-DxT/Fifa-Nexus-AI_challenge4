import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useSimulationStore } from '../../simulation/store';
import { Button } from '../../shared/components/Button';

interface TwinProps {
  onSectorSelect: (sector: string) => void;
  selectedSector: string | null;
}

export const StadiumDigitalTwin = React.memo<TwinProps>(({
  onSectorSelect,
  selectedSector
}) => {
  const { state } = useSimulationStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showHeatmap, setShowHeatmap] = useState(true);

  const activeStadium = state.stadiums.find(s => s.id === state.activeStadiumId) || state.stadiums[0];

  // Map of sector IDs to SVG path definitions for a symmetric octagon/oval stadium layout
  // Center is (200, 200)
  const sectors = [
    { id: 'Zone A', name: 'Zone A (North)', path: 'M 100,60 L 300,60 L 280,120 L 120,120 Z' },
    { id: 'Zone B', name: 'Zone B (Northeast)', path: 'M 300,60 L 370,130 L 310,170 L 280,120 Z' },
    { id: 'Zone C', name: 'Zone C (Southeast)', path: 'M 370,270 L 300,340 L 280,280 L 310,230 Z' },
    { id: 'Zone D', name: 'Zone D (South)', path: 'M 300,340 L 100,340 L 120,280 L 280,280 Z' },
    { id: 'Zone E', name: 'Zone E (Southwest)', path: 'M 100,340 L 30,270 L 90,230 L 120,280 Z' },
    { id: 'Zone F', name: 'Zone F (Northwest)', path: 'M 30,130 L 100,60 L 120,120 L 90,170 Z' }
  ];

  // Helper to determine density color
  // Deterministic density mapping based on sector index or wait times
  const getSectorDensityColor = (sectorId: string) => {
    if (!showHeatmap) return 'fill-slate-800/80';

    // Derive a pseudo density from stadium occupancy + sector hash
    const hash = sectorId.charCodeAt(5) || 0;
    const factor = ((activeStadium.occupancy % 997) + hash * 30) % 100;
    if (factor > 80) return 'fill-red-600/70 hover:fill-red-500/80'; // Congested
    if (factor > 50) return 'fill-yellow-500/70 hover:fill-yellow-400/80'; // Moderate
    return 'fill-emerald-500/60 hover:fill-emerald-400/75'; // Normal
  };

  const handleZoom = (type: 'in' | 'out' | 'reset') => {
    if (type === 'in') setZoom(z => Math.min(2.5, z + 0.25));
    if (type === 'out') setZoom(z => Math.max(0.75, z - 0.25));
    if (type === 'reset') {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  return (
    <div className="relative border border-brand-dark-700 bg-brand-dark-950 rounded-lg overflow-hidden flex flex-col h-[400px]">
      {/* Controls Bar */}
      <div className="absolute top-3 right-3 z-10 flex gap-1 bg-brand-dark-900/90 p-1 border border-brand-dark-700 rounded-md shadow-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleZoom('in')}
          aria-label="Zoom In Digital Twin"
          className="p-1.5"
        >
          <ZoomIn size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleZoom('out')}
          aria-label="Zoom Out Digital Twin"
          className="p-1.5"
        >
          <ZoomOut size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleZoom('reset')}
          aria-label="Reset Map Zoom"
          className="p-1.5"
        >
          <RotateCcw size={16} />
        </Button>
        <div className="h-6 w-px bg-brand-dark-700 self-center mx-1" />
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-2 py-1 text-xs font-semibold rounded ${
            showHeatmap ? 'bg-brand-blue-500 text-white' : 'bg-brand-dark-700 text-slate-300'
          }`}
        >
          Heatmap
        </button>
      </div>

      {/* Title overlay */}
      <div className="absolute top-3 left-3 z-10 bg-brand-dark-900/90 px-3 py-1.5 border border-brand-dark-700 rounded-md">
        <span className="text-xs font-semibold text-slate-300">Digital Twin: {activeStadium.name}</span>
        <span className="text-[10px] block text-brand-gold-500">Seed: FIFA2026 (Simulated Data)</span>
      </div>

      {/* SVG Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 cursor-grab active:cursor-grabbing overflow-hidden">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full max-h-[350px] transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
          }}
        >
          {/* Pitch Area */}
          <rect x="135" y="160" width="130" height="80" rx="6" className="fill-emerald-800 stroke-emerald-600 stroke-2" />
          <line x1="200" y1="160" x2="200" y2="240" className="stroke-emerald-600 stroke-2" />
          <circle cx="200" cy="200" r="25" className="fill-none stroke-emerald-600 stroke-2" />
          
          {/* Spectator Zones */}
          {sectors.map((sec) => {
            const isSelected = selectedSector === sec.id;
            return (
              <path
                key={sec.id}
                d={sec.path}
                tabIndex={0}
                role="button"
                aria-label={`${sec.name}. Status: Click to view details.`}
                aria-pressed={isSelected}
                onClick={() => onSectorSelect(sec.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSectorSelect(sec.id);
                  }
                }}
                className={`transition-all duration-200 cursor-pointer stroke-brand-dark-700 stroke-2 outline-none focus:stroke-brand-blue-500 ${getSectorDensityColor(
                  sec.id
                )} ${isSelected ? 'stroke-brand-blue-500 fill-blue-900/50 filter brightness-125' : ''}`}
              />
            );
          })}

          {/* Core Labels */}
          <text x="200" y="205" textAnchor="middle" className="text-[12px] font-bold fill-emerald-500/50 pointer-events-none select-none">
            FIFA 2026 PITCH
          </text>
          
          {/* Sector Overlay Labels */}
          <text x="200" y="100" textAnchor="middle" className="text-[10px] font-semibold fill-slate-300 pointer-events-none select-none">Zone A</text>
          <text x="310" y="105" textAnchor="middle" className="text-[10px] font-semibold fill-slate-300 pointer-events-none select-none">Zone B</text>
          <text x="310" y="295" textAnchor="middle" className="text-[10px] font-semibold fill-slate-300 pointer-events-none select-none">Zone C</text>
          <text x="200" y="315" textAnchor="middle" className="text-[10px] font-semibold fill-slate-300 pointer-events-none select-none">Zone D</text>
          <text x="90" y="295" textAnchor="middle" className="text-[10px] font-semibold fill-slate-300 pointer-events-none select-none">Zone E</text>
          <text x="90" y="105" textAnchor="middle" className="text-[10px] font-semibold fill-slate-300 pointer-events-none select-none">Zone F</text>

          {/* Security Incidents Flashing Icons */}
          {state.incidents
            .filter(inc => inc.status !== 'Resolved' && inc.location.toLowerCase().includes(activeStadium.id.split('-')[1]))
            .map((inc, i) => {
              // Map incident zones to rough SVG coordinate areas
              let cx = 200;
              let cy = 200;
              if (inc.location.includes('Zone A')) { cx = 200; cy = 90; }
              else if (inc.location.includes('Zone B')) { cx = 295; cy = 115; }
              else if (inc.location.includes('Zone C')) { cx = 295; cy = 275; }
              else if (inc.location.includes('Zone D')) { cx = 200; cy = 300; }
              else if (inc.location.includes('Zone E')) { cx = 105; cy = 275; }
              else if (inc.location.includes('Zone F')) { cx = 105; cy = 115; }
              else {
                // Pre-offset a bit if unknown
                cx = 150 + (i * 20);
                cy = 150 + (i * 10);
              }

              return (
                <g key={inc.id}>
                  {/* Flashing Pulse Ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    className="fill-red-500/30 stroke-red-500 animate-ping opacity-75"
                  />
                  {/* Warning Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="6"
                    className="fill-red-600 stroke-white stroke-1"
                  >
                    <title>{`Incident Alert: ${inc.type}`}</title>
                  </circle>
                </g>
              );
            })}

          {/* Volunteer Location Indicators */}
          {state.volunteers
            .filter(v => v.status === 'Busy')
            .map(v => {
              let cx = 200;
              let cy = 200;
              if (v.location.includes('Zone A')) { cx = 230; cy = 95; }
              else if (v.location.includes('Zone B')) { cx = 280; cy = 135; }
              else if (v.location.includes('Zone C')) { cx = 280; cy = 255; }
              else if (v.location.includes('Zone D')) { cx = 230; cy = 295; }
              else if (v.location.includes('Zone E')) { cx = 120; cy = 255; }
              else if (v.location.includes('Zone F')) { cx = 120; cy = 135; }

              return (
                <circle
                  key={v.id}
                  cx={cx - 10}
                  cy={cy - 10}
                  r="4"
                  className="fill-blue-500 stroke-white stroke-0.5"
                >
                  <title>{`Active Volunteer: ${v.name}`}</title>
                </circle>
              );
            })}
        </svg>
      </div>

      {/* Map Legend */}
      <div className="bg-brand-dark-900 border-t border-brand-dark-700 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500/60 border border-emerald-500 rounded-sm inline-block" />
            <span>Low Congestion</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-yellow-500/60 border border-yellow-500 rounded-sm inline-block" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-600/60 border border-red-500 rounded-sm inline-block" />
            <span>High Congestion</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-600 rounded-full inline-block animate-pulse" />
            <span>Incident Alert</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
            <span>Active Staff</span>
          </div>
        </div>
      </div>
    </div>
  );
});
