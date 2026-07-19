# FIFA Nexus AI - Enterprise Contributing Guidelines

Thank you for contributing to the FIFA Nexus AI platform. Please adhere to these engineering standards to maintain production quality.

---

## 1. Development Principles

- **Feature-First Architecture**: Group code by feature or shared utility.
- **Strict TypeScript**: Avoid `any`. Define explicit types for props, state, and API schemas.
- **Zero-Emoji Policy**: Keep code comments, READMEs, and technical documentation professional and emoji-free.
- **WCAG 2.2 AA Compliance**: Ensure all interactive elements have ARIA attributes, semantic tags, and focus management.

---

## 2. Local Environment Setup

1. Clone repository:
   ```bash
   git clone https://github.com/Athrv-DxT/Fifa-Nexus-AI_challenge4.git
   cd Fifa-Nexus-AI_challenge4
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```

---

## 3. Pull Request Checklist

Before submitting a PR, verify all mandatory checks locally:

```bash
# 1. Verify TypeScript types
npm run typecheck

# 2. Run static linter
npm run lint

# 3. Run unit and coverage test suite
npm run test:coverage

# 4. Confirm production build compiles
npm run build
```

Every PR must pass the automated GitHub Actions CI workflow prior to merging into `main`.
