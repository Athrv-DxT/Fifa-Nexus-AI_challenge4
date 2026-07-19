# FIFA Nexus AI - Enterprise Security Architecture & Threat Model

## Security Principles

FIFA Nexus AI adheres to OWASP Top 10 web security guidelines, Google Cloud security standards, and GenAI safety best practices.

---

## 1. Threat Model & Vulnerability Mitigations

| Threat Category | Potential Risk | Enterprise Mitigation Strategy | Implementation |
| :--- | :--- | :--- | :--- |
| **Cross-Site Scripting (XSS)** | Malicious script execution in UI | HTML entity encoding on user input; script tag stripping on AI output | `sanitizeInput()`, `sanitizeObject()` |
| **Privilege Escalation** | Unauthorized access to executive/ops tools | Serverless RBAC matrix with conditional route rendering | `checkPermissions()`, `App.tsx` guards |
| **Prompt Injection Attack** | System prompt override, secret leakage | Pattern-based prompt scanner blocking jailbreaks prior to API execution | `validatePrompt()` |
| **GenAI Denial of Service** | Request flooding, API billing exhaustion | Client-side sliding-window rate limiting (max 10 req/min) | `rateLimiter` sliding cache |
| **Data Leakage** | API keys or stack traces exposed in UI | Centralized Error Boundary, environment validation, fallback engine | `ErrorBoundary.tsx`, `validateEnvironment()` |
| **Clickjacking & Framing** | UI Redirection / Framing attacks | HTTP Security Headers enforcing `X-Frame-Options: DENY` | `vite.config.ts`, `vercel.json`, `netlify.toml` |

---

## 2. Role-Based Access Control (RBAC) Matrix

The system defines 4 operational roles with distinct view permissions:

| Operational View | Fan Role | Volunteer Role | Operations Role | Executive Role |
| :--- | :---: | :---: | :---: | :---: |
| **Fan Concierge Dashboard** (`fan`) | Allowed | Allowed | Allowed | Allowed |
| **Volunteer Operations Console** (`volunteer`) | Denied | Allowed | Allowed | Denied |
| **Operations Command Center** (`operations`) | Denied | Denied | Allowed | Denied |
| **Executive Strategic Brief** (`executive`) | Denied | Denied | Denied | Allowed |
| **System Diagnostics & Logs** (`diagnostics`) | Denied | Denied | Allowed | Allowed |

If an unauthorized role switch or deep link access is attempted:
1. The Route Guard in `App.tsx` intercepts rendering.
2. A high-priority security audit log event is written.
3. An accessible "Access Denied" view is displayed with a safe reset button.

---

## 3. Prompt Injection Defense Engine

All user queries passed to GenAI agents are scanned using regex patterns targeting common jailbreak vectors:
- Instruction override attempts (`ignore previous instructions`, `bypass safety`)
- Secret leakage requests (`reveal prompt`, `show system prompt`, `leak secret`)
- Command execution syntax (`execute command`, `run script`)

If an injection attempt is detected, the request is aborted immediately without making a network call to the LLM API, returning a safe warning message.

---

## 4. HTTP Security Headers Configuration

Configured across development (`vite.config.ts`) and production deployments (`vercel.json`, `netlify.toml`):

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://generativelanguage.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https:;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```
