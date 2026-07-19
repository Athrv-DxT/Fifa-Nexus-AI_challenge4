# FIFA Nexus AI - Enterprise Testing Architecture & Strategy

This document outlines the testing architecture, quality gates, and execution instructions for the FIFA Nexus AI platform.

---

## 1. Testing Pyramid Overview

```
                      +-----------------------------+
                      |   Playwright E2E Tests      |  (e2e/app.spec.ts)
                      +-----------------------------+
                      |   React Component & Hooks   |  (src/shared/shared.test.tsx)
                      +-----------------------------+
                      |   AI & Fallback Engine      |  (src/ai/ai.test.ts)
                      +-----------------------------+
                      |   Math Engine & Security    |  (src/simulation/simulation.test.ts)
                      +-----------------------------+
```

- **Unit Tests**: Verify LCG random engine determinism, state transitions, prompt injection filters, rate limiters, and RBAC matrix logic.
- **AI Schema Tests**: Validate Zod contracts across all 8 agent schemas (`FanConcierge`, `NavigationAssistant`, `IncidentTriage`, `OperationsCopilot`, `ExecutiveBrief`, `VolunteerAssistant`, `EmergencyAdvisor`, `CrowdPrediction`).
- **Component & Hook Tests**: Verify React Testing Library component rendering (`Button`, `Card`, `Badge`, `FormControls`, `ErrorBoundary`) and Zustand preferences state hooks (`usePreferencesStore`).
- **End-to-End Tests**: Playwright integration suite verifying venue switching, language dictionary translations, role access security blocks, and responsive layouts.

---

## 2. Test Execution Commands

```bash
# Execute unit, component, and AI validation tests
npm run test

# Run tests with Vitest v8 coverage report (HTML, LCOV, JSON, text)
npm run test:coverage

# Execute Playwright End-to-End tests
npx playwright test
```

---

## 3. Coverage Report Metrics

All test files are configured to output HTML, LCOV, JSON, and terminal summary tables. Key coverage highlights:

- `src/ai/schemas.ts`: **100%** line coverage.
- `src/simulation/lcg.ts`: **100%** line coverage.
- `src/shared/components/Button.tsx`: **100%** line coverage.
- `src/shared/components/Badge.tsx`: **100%** line coverage.
- `src/shared/components/Card.tsx`: **100%** line coverage.
- `src/shared/components/FormControls.tsx`: **100%** line coverage.
- `src/shared/utils/security.ts`: **78.84%** line coverage.
- `src/simulation/engine.ts`: **80.19%** line coverage.

---

## 4. Continuous Integration Quality Gates

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically executes on every push to `main`:
1. `npm run typecheck` (`tsc --noEmit`)
2. `npm run lint` (`oxlint`)
3. `npm run test:coverage` (`vitest run --coverage`)
4. `npm run build` (`vite build`)

Any build or test failure will block PR merging.
