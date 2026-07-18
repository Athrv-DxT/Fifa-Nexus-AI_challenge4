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
│   ├── hooks/          # usePreferences (language, font size, contrast, RTL)
│   └── utils/          # security.ts (sanitizers, rate limiters, RBAC)
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

## Security Architecture & Threat Model

The platform is designed using a comprehensive threat model matching OWASP Top 10 recommendations and modern web security policies.

### 1. Threat Model & Vulnerability Analysis
- User Input Manipulation: Handled by escaping strings via sanitizeInput() to block XSS and HTML injection vectors.
- Privilege Escalation: Mitigated by implementing a dual-layer Role-Based Access Control (RBAC) system (frontend toolbar switcher + route guard checks inside App.tsx and feature components).
- GenAI Resource Abuse (Flood Attacks): Addressed via a client-side sliding window rate limiter allowing a maximum of 10 requests per minute per client session.
- System Prompt Exploits (Jailbreaking): Inspected via a multi-pattern regex prompt injection validator, preventing instruction overrides and secrets leaks.

### 2. Prompt Injection Protection
- Scans incoming prompt strings against patterns including:
  - Instruction override overrides (e.g. "ignore previous instructions", "bypass safety")
  - System leak attempts (e.g. "reveal hidden prompts", "leak secrets")
  - Execution attempts (e.g. "execute arbitrary commands")
- If triggered, the request is immediately blocked, a warning response is returned, and a high-priority security exception is written to the audit logs.

### 3. Role-Based Access Control (RBAC) & Route Guards
- Supported Roles: Fan, Volunteer, Operations, Executive.
- Matrix mappings:
  - Fan: Can access Fan Dashboard (fan).
  - Volunteer: Can access Fan Dashboard (fan) and Volunteer Console (volunteer).
  - Operations: Can access Fan Dashboard (fan), Volunteer Console (volunteer), Operations Command (operations), and Diagnostics (diagnostics).
  - Executive: Can access Fan Dashboard (fan), Executive Control (executive), and Diagnostics (diagnostics).
- If a user changes their role or attempts to navigate manually to an unauthorized section, the Route Guard blocks render, logs the attempt, and prompts a redirect to their safe dashboard.

### 4. Input & Output Validation
- Zod schemas strictly validate every JSON return from the GenAI endpoints.
- Any mismatch or schema parse failure triggers an immediate degradation fallback to safe, offline rule-based mock responses.
- Recursive sanitizeObject() runs on all returned text objects before rendering, neutralizing HTML/Script injections.

### 5. Secure Configuration
- Validates the environment variables (e.g. VITE_GEMINI_API_KEY) on startup.
- Throws an operations error block if default templates or invalid placeholders are loaded.

### 6. Audit Logging
- Immutably buffers the last 300 logs inside the Diagnostics panel.
- Records AI invocations, role transitions, authorization blocks, security violations, and evacuation triggers alongside ISO timestamps.

### 7. Security Headers
- Configured in the local dev server and production bundles:
  - Content Security Policy (CSP): Prevents unsanctioned external calls (restricts connections to self and generativelanguage.googleapis.com).
  - X-Frame-Options: set to DENY to prevent clickjacking.
  - X-Content-Type-Options: set to nosniff.
  - Referrer-Policy: set to no-referrer.
  - Permissions-Policy: Disables microphone, camera, and geolocation.
  - HSTS: strict transport security enabled.

### 8. Rate Limiting
- A sliding window rate limiter protects endpoints from flood requests, limiting throughput to 10 queries per minute.

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
4. Security Utilities: Sanitizers clean XSS attempts, prompt injection scans catch overrides, and RBAC matrix rejects unauthorized page accesses.

---

## Deployment Guide

### Local Host Deployment
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

### Vercel Production Deployment
The project is pre-configured for Vercel deployment with vercel.json.
- Runs SPA redirects so all deep paths route correctly to index.html.
- Applies strict Content Security Policy (CSP), HSTS, and XSS headers.
- Caches all static build assets permanently under /assets/*.
To deploy:
- Install the Vercel CLI: `npm install -g vercel`
- Run `vercel` in the repository root and follow the prompts.

### Netlify Production Deployment
The project is configured for Netlify using netlify.toml.
- Builds statically with `npm run build` and publishes the `dist` folder.
- Configures SPA fallbacks using redirects.
- Injects CSP, caching, and frame headers.
To deploy:
- Connect the repository to Netlify, or deploy via CLI using `netlify deploy`.

---

## Observability and Graceful Degradation

- Error Boundary Interface: The root application is wrapped in a React Error Boundary (src/shared/components/ErrorBoundary.tsx). In the event of a runtime rendering crash, the exception is intercepted, logged to the central store, and the user is presented with a safe recovery panel instead of a white screen or stack trace leakage.
- Network Connectivity watchdog: App.tsx listens to online/offline state changes in the browser. It displays a real-time status badge and writes connection status changes to the audit log trail.
- API Key Validation: In client.ts, the client validates VITE_GEMINI_API_KEY before executing live prompts. If it fails, the application degrades gracefully to offline rule-based fallback responses.
