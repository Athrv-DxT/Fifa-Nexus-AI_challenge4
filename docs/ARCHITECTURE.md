# FIFA Nexus AI - Enterprise Architecture Guide

## System Architecture

FIFA Nexus AI is designed following enterprise software design principles, strictly separating concerns across five distinct architecture layers to ensure high availability, determinism, security, and maintainability.

```
+-----------------------------------------------------------------------+
|                         Presentation Layer                            |
|  (Fan, Volunteer, Operations, Executive, & Diagnostics Personas)     |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------+-----------------------------------+
|                        Application Services                           |
|  (Preferences, i18n, Route Guards, React Error Boundary, Hooks)       |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------+-----------------------------------+
|                           Domain Layer                                |
|   (LCG Engine, State Transitions, Metric Computations, Incidents)     |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------+-----------------------------------+
|                            AI Layer                                   |
|   (Gemini API Client, Prompt Scanners, Zod Schemas, Rule Fallbacks)   |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------+-----------------------------------+
|                       Infrastructure Layer                            |
| (Zustand Global Store, Security Headers, Vite Build, Deployment Config)|
+-----------------------------------------------------------------------+
```

---

## Domain-Driven Design (DDD) Layering

### 1. Presentation Layer (`src/features/`)
Contains modular control decks organized by operational persona:
- `fan/`: Match schedules, fan concierge chat, arena navigation timeline.
- `volunteer/`: Task dispatch management, shift assistant, language translator.
- `operations/`: Digital Twin SVG arena map, CCTV feed monitors, telemetry timeline, Copilot.
- `executive/`: Strategic KPI dashboard, health metrics, executive brief generation.
- `diagnostics/`: System log audit viewer, memory meters, API key configuration.

### 2. Application Layer (`src/shared/`)
- Components (`src/shared/components/`): Reusable, accessible design primitives (`Button`, `Card`, `Badge`, `Modal`, `FormControls`, `ErrorBoundary`).
- Hooks (`src/shared/hooks/`): Preferences state management (`usePreferences`) governing high-contrast mode, font sizes, active language, and role contexts.
- Security Utilities (`src/shared/utils/`): Input escaping, output sanitization, RBAC permission matrices, rate limiters, and structured logging.

### 3. Domain Layer (`src/simulation/`)
- Deterministic Random Engine (`src/simulation/lcg.ts`): Uses a Linear Congruential Generator initialized with seed `FIFA2026` to guarantee bit-identical telemetry outputs across sessions.
- State Transition Engine (`src/simulation/engine.ts`): Updates crowd density, gate wait times, stadium sector health, and security incident statuses on every clock tick.
- Data Models (`src/simulation/types.ts`): Strict TypeScript interfaces for Stadiums, Gates, Facilities, Incidents, and Volunteers.

### 4. AI Engine Layer (`src/ai/`)
- Client Interface (`src/ai/client.ts`): Manages live calls to Google Gemini (`gemini-2.5-flash`), enforces input validation, scans for prompt injections, and degrades gracefully to offline rule-based fallbacks.
- Output Validation (`src/ai/schemas.ts`): Zod schemas ensuring structured JSON responses conform strictly to expected data contracts.

### 5. Infrastructure Layer (`src/config/`, `src/simulation/store.ts`)
- Global State (`store.ts`): Zustand store managing the simulation clock, telemetry logs, active stadium selections, and incident dispatches.
- Internationalization (`src/config/i18n.ts`): Translation dictionaries supporting 6 languages (EN, ES, FR, PT, AR with RTL support, HI).

---

## State Management & Telemetry Flow

1. The simulation clock ticks automatically every 5 seconds (configurable speed).
2. `tick()` triggers `stepSimulation(state, seed)`, computing next-step metrics deterministically.
3. React components re-render efficiently using `React.memo` and Zustand selective selectors.
4. User actions (incident resolution, gate dispatches, role switches) write audit entries to `logs` array.
