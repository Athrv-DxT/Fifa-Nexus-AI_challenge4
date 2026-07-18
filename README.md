# FIFA Nexus AI - Enterprise Tournament Operations Intelligence Platform

FIFA Nexus AI is a production-grade, GenAI-powered web application designed for operations command centers, volunteers, security personnel, executives, and fans during the FIFA World Cup 2026. The platform optimizes crowd management, smart indoor arena navigation, real-time decision support, and multilingual assistance.

---

## Enterprise Architecture Overview

The application follows Domain-Driven Design (DDD) principles and a feature-based folder organization:

1. Presentation Layer (src/features/):
   - Focuses strictly on rendering UI panels and catching user interactions. Does not contain any hardcoded business logic.
   - Modules: fan/, volunteer/, operations/, executive/, diagnostics/.
2. Application Layer (src/shared/components/, src/shared/hooks/):
   - Contains reusable components (Button, Card, Badge, Modal, FormControls, Tabs) and custom hooks managing themes, language settings, and user options.
3. Domain Layer (src/simulation/):
   - Governs the core business rules of the tournament.
   - Uses a seeded pseudo-random number generator (LCG) to compute crowd movement, queues, incidents, and volunteer dispatches in a stateless, deterministic way.
4. AI Layer (src/ai/):
   - Executes specialized prompts for 8 distinct AI Agents: Fan Concierge, Navigation, Incident Triage, Operations Copilot, Executive Brief, Volunteer Assistant, Emergency Advisor, and Crowd Prediction.
   - Enforces structured JSON responses, validates them using Zod schemas, checks input queries for prompt injection attacks, and defaults to offline rule-based fallbacks if network connectivity fails.
5. Infrastructure Layer (src/config/, src/simulation/store.ts):
   - Provides translation resources, routing configs, and coordinates global stores (Zustand) that keep views synchronized.

---

## Folder Structure

```
src/
├── config/             # i18n dictionary resources and static settings
├── shared/             # Reusable global design components and hooks
│   ├── components/     # Button, Card, Badge, Modal, FormControls, Tabs
│   └── hooks/          # usePreferences (language, font size, contrast, RTL)
├── simulation/         # Core deterministic telemetry engine
│   ├── lcg.ts          # Linear Congruential Generator helper
│   ├── engine.ts       # State transitions and metric updates
│   ├── types.ts        # TypeScript schemas for telemetry and incidents
│   └── store.ts        # Zustand global store coordinating ticking clock
├── ai/                 # Generative AI Agent Hub
│   ├── client.ts       # Gemini API client, injection scans, mock fallbacks
│   └── schemas.ts      # Zod validation schemas for LLM structured JSON outputs
├── features/           # UI Dashboards (Presentation)
│   ├── fan/            # Fan concierge, smart navigation forms, timelines
│   ├── volunteer/      # Shift schedule assistant, task dispatches, translation
│   ├── operations/     # Digital Twin SVG, CCTV screens, incident feeds, Copilot
│   ├── executive/      # Side-by-side matrices, SVG health charts, executive brief
│   └── diagnostics/    # Log viewer, load meters, Gemini key configuration
├── App.tsx             # Main dashboard router and simulation timer
├── index.css           # Global scrollbars, Tailwind v4 directives, high contrast styles
└── main.tsx            # React bootstrap entrypoint
```

---

## Security Documentation

- OWASP Top 10 Mitigations: Sanitizes all user text inputs in the AI client to prevent Cross-Site Scripting (XSS) and SQL injection vectors.
- Prompt Injection and Jailbreak Protection: Scans queries for override keywords (e.g. "ignore previous instructions"). If caught, it immediately blocks execution, triggers a high-priority security audit log, and returns a safe notice.
- Output Encoding and Validation: Validates all JSON returned by the Gemini API against strict Zod schemas. If the JSON is malformed or properties mismatch, the system ignores the payload and uses the local rule-based fallback response.
- Audit Logging: Keeps an immutable log buffer of last 300 logs (AI inputs, simulation events, security blocks) in the Diagnostics Dashboard.

---

## Accessibility (WCAG 2.2 AA Compliance)

- Keyboard Navigation: Interactive SVG Digital Twin paths, tabs, buttons, and form inputs are focusable and navigable using standard arrow and tab keys.
- RTL Compatibility: Changing language to Arabic (ar) instantly flips the DOM direction attribute to dir="rtl" and updates the layout.
- High Contrast Theme: Toggle button shifts body color rules, card borders, and buttons to high-contrast colors (yellow/white on pure black canvas).
- Large Font Size: Increases base font settings to 120% for improved readability.
- Skip Navigation Links: Screen readers can skip headers directly to #main-content.

---

## Performance Optimizations

- Tailwind CSS v4 and PostCSS: Custom color variables are declared directly in CSS and compiled statically, omitting any runtime style overhead.
- SVG Vector graphics: Stadium Digital Twin is drawn purely using standard SVG paths, providing resolution independence and 0-latency hover indicators.
- React Rendering: Coupled with Zustand slice state subscriptions to avoid unnecessary re-renders.

---

## Testing Strategy

Automated tests are located in src/simulation/simulation.test.ts and can be run using:

```bash
# Run unit and integration tests
npm run test

# Run tests with coverage breakdown
npm run test:coverage
```

The tests cover:
1. Mathematical Determinism: LCG generates identical outputs for seed FIFA2026.
2. State transitions: Simulation clock increments capacity, wait times, and incident assignments deterministically.
3. Structured validation: Zod schema conforms to active properties and rejects malformed fields.

---

## Deployment Guide

To deploy the application locally:

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start Vite hot-reload development server
npm run dev

# Bundle application for production release
npm run build

# Preview the local production bundle
npm run preview
```

---

## Future Enhancements and Known Limitations

1. Live CCTV Stream Feeds: The security monitors display realistic canvas loaders, which can be connected to WebRTC video feeds in production.
2. Offline Mode Storage: Store telemetry logs in IndexedDB to support continuous local operations during stadium network blackout conditions.
