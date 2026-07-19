# FIFA Nexus AI - GenAI Engine & Agent Hub Architecture

## Architecture Overview

The Generative AI layer (`src/ai/`) provides real-time operational assistance across 8 specialized AI agents powered by Google Gemini (`gemini-2.5-flash`).

```
                               +------------------------+
                               |     User / System      |
                               +-----------+------------+
                                           |
                                           v
                               +------------------------+
                               | Prompt Injection Guard |
                               |   (validatePrompt())   |
                               +-----------+------------+
                                           |
                    +----------------------+----------------------+
                    | Pass                                        | Block
                    v                                             v
        +-----------------------+                       +-------------------+
        | Rate Limiter Check    |                       | Return Security   |
        | (max 10 queries/min)  |                       | Exception Warning |
        +-----------+-----------+                       +-------------------+
                    |
                    v
        +-----------------------+
        |  Gemini API Execution |
        |   (gemini-2.5-flash)  |
        +-----------+-----------+
                    |
         +----------+----------+
         | Success             | Failure / Key Missing
         v                     v
+------------------+  +--------------------------------+
| Zod Schema Parse |  | Deterministic Rule Engine      |
| (schemas.ts)     |  | (Mock Fallback Response)       |
+--------+---------+  +---------------+----------------+
         |                            |
         +------------+---------------+
                      |
                      v
         +--------------------------+
         | Output Sanitizer         |
         | (sanitizeObject())       |
         +------------+-------------+
                      |
                      v
         +--------------------------+
         | Render to Component UI   |
         +--------------------------+
```

---

## The 8 Operational AI Agents

| Agent ID | Target Persona | Primary Responsibility | Zod Schema |
| :--- | :--- | :--- | :--- |
| **Fan Concierge** | Fan | Multilingual arena Q&A, concession queue info | `FanConciergeSchema` |
| **Smart Navigation** | Fan | Optimal gate/sector navigation routes | `SmartNavigationSchema` |
| **Incident Triage** | Operations | Classifies incidents & assigns severity | `IncidentTriageSchema` |
| **Ops Copilot** | Operations | Root cause analysis & tactical recommendations | `OperationsCopilotSchema` |
| **Executive Brief** | Executive | Strategic KPI summaries & executive action items | `ExecutiveBriefSchema` |
| **Volunteer Assistant** | Volunteer | Shift guidance & task dispatch assistance | `VolunteerAssistantSchema` |
| **Emergency Advisor** | Operations / Security | Evacuation path analysis & crowd dispersal guidance | `EmergencyAdvisorSchema` |
| **Crowd Prediction** | Operations | Predictive crowd surge forecasting | `CrowdPredictionSchema` |

---

## Fallback & Offline Resilience Engine

If any of the following conditions occur:
1. `VITE_GEMINI_API_KEY` is missing or set to placeholder string.
2. Network connectivity fails (device offline).
3. The LLM API returns a non-200 HTTP code or timeouts.
4. The JSON payload fails Zod schema validation.

The `invokeAIAgent` service automatically switches to the offline rule-based fallback engine (`generateFallbackResponse`), returning structured, schema-compliant mock data derived from the current LCG simulation state. This guarantees zero white-screen or runtime errors for users.
