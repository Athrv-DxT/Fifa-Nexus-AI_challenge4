# FIFA Nexus AI - Testing Strategy & Quality Assurance

## Testing Philosophy

FIFA Nexus AI implements a multi-tier testing strategy ensuring determinism, safety, schema integrity, and accessibility.

```
                  +-----------------------+
                  |  E2E / User Journeys  |  (App Router, Roles, Navigation)
                  +-----------------------+
                  |  Integration / AI     |  (Zod Schemas, Fallback Engine)
                  +-----------------------+
                  |  Unit / Security      |  (LCG, Rate Limits, Sanitizers)
                  +-----------------------+
```

---

## 1. Test Execution Commands

```bash
# Run unit & integration tests
npm run test

# Run tests with Vitest v8 coverage report
npm run test:coverage
```

---

## 2. Test Suite Organization (`src/simulation/simulation.test.ts`)

The test suite validates key architectural pillars:

### A. Deterministic Math Engine (`LCG`)
- Verifies that seed `FIFA2026` produces identical pseudo-random outputs across executions.
- Confirms state steps maintain mathematical predictability.

### B. State Engine Transitions (`engine.ts`)
- Tests stadium operational health calculations.
- Verifies crowd capacity caps, queue wait time adjustments, and incident resolution dispatches.

### C. GenAI Schema Contracts (`schemas.ts`)
- Validates conforming LLM outputs against Zod schemas (`FanConciergeSchema`, `OperationsCopilotSchema`, etc.).
- Rejects invalid schema payloads and verifies fallback behavior.

### D. Security Utilities (`security.ts`)
- Tests input sanitization (`sanitizeInput`) against `<script>` XSS vectors.
- Verifies output HTML stripping (`sanitizeOutput`).
- Tests prompt injection detection against system instruction override queries.
- Verifies Role-Based Access Control (`checkPermissions`) matrix restrictions.

---

## 3. CI Pipeline Integration

Test coverage is enforced automatically via GitHub Actions in `.github/workflows/ci.yml`. Any pull request failing typecheck, linting, or test execution will fail the build pipeline.
