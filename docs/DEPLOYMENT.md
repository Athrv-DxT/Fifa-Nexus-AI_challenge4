# FIFA Nexus AI - Enterprise Deployment Guide

This guide details how to build, preview, and deploy the FIFA Nexus AI platform across Vercel, Netlify, or custom web servers.

---

## Environment Prerequisites

The application requires Node.js 20+ and npm 10+.

### Environment Variables Configuration
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable Name | Required | Description | Default / Fallback |
| :--- | :---: | :--- | :--- |
| `VITE_GEMINI_API_KEY` | Optional | Google Gemini API Key for live AI queries | Falls back to offline deterministic rule engine |

---

## Build Commands

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run TypeScript verification
npm run typecheck

# Run static linter
npm run lint

# Run unit and coverage test suite
npm run test:coverage

# Build production bundle
npm run build

# Preview build artifact locally
npm run preview
```

---

## 1. Vercel Deployment

The project contains a pre-configured `vercel.json` file.

### Steps:
1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Run deployment:
   ```bash
   vercel --prod
   ```
3. Set Environment Variable in Vercel Dashboard:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: `your_actual_api_key`

### Production Features Configured:
- SPA Route Rewrites: Routes all requests (`/*`) to `index.html`.
- Permanent Cache Control: Sets `Cache-Control: public, max-age=31536000, immutable` for `/assets/*`.
- Security Headers: Applies strict CSP, HSTS, and X-Frame-Options to all responses.

---

## 2. Netlify Deployment

The repository includes `netlify.toml` for automated builds.

### Steps:
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
2. Deploy to production:
   ```bash
   netlify deploy --build --prod
   ```
3. Set environment variable:
   ```bash
   netlify env:set VITE_GEMINI_API_KEY "your_actual_api_key"
   ```

---

## 3. Docker / Nginx Static Server Deployment

To host using an Nginx web server, use the following server configuration block:

```nginx
server {
    listen 80;
    server_name fifa-nexus.example.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        add_header X-Frame-Options "DENY";
        add_header X-Content-Type-Options "nosniff";
        add_header Referrer-Policy "no-referrer";
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```
