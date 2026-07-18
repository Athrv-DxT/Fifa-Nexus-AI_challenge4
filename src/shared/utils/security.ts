import { useSimulationStore } from '../../simulation/store';

export type UserRole = 'Fan' | 'Volunteer' | 'Operations' | 'Executive';

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Fan: ['fan'],
  Volunteer: ['fan', 'volunteer'],
  Operations: ['fan', 'volunteer', 'operations', 'diagnostics'],
  Executive: ['fan', 'executive', 'diagnostics']
};

/**
 * Sanitizes input strings to prevent basic XSS or styling breakages.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes AI responses to strip scripts and dangerous HTML injection tags.
 */
export function sanitizeOutput(output: string): string {
  if (!output) return '';
  // Strip script, style, and iframe tags
  let cleaned = output
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, 'href="#"')
    .replace(/onerror\s*=\s*["'][^"']*["']/gi, '');
  return cleaned;
}

/**
 * Validates critical environment variables.
 */
export function validateEnvironment(): void {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (key && (key.includes('YOUR_') || key.length < 10)) {
    throw new Error("Configuration Error: VITE_GEMINI_API_KEY is invalid or uses a default placeholder.");
  }
}

/**
 * Enterprise secure audit logger.
 */
export const secureLogger = {
  info: (module: 'simulation' | 'ai' | 'security' | 'user', message: string, metadata?: any) => {
    const store = useSimulationStore.getState();
    const cleanMsg = sanitizeInput(message);
    store.addLog(module, 'info', `${cleanMsg}${metadata ? ' | ' + JSON.stringify(metadata) : ''}`);
  },
  warning: (module: 'simulation' | 'ai' | 'security' | 'user', message: string, metadata?: any) => {
    const store = useSimulationStore.getState();
    const cleanMsg = sanitizeInput(message);
    store.addLog(module, 'warning', `${cleanMsg}${metadata ? ' | ' + JSON.stringify(metadata) : ''}`);
  },
  error: (module: 'simulation' | 'ai' | 'security' | 'user', message: string, metadata?: any) => {
    const store = useSimulationStore.getState();
    const cleanMsg = sanitizeInput(message);
    store.addLog(module, 'error', `${cleanMsg}${metadata ? ' | ' + JSON.stringify(metadata) : ''}`);
  },
  security: (message: string, metadata?: any) => {
    const store = useSimulationStore.getState();
    const cleanMsg = sanitizeInput(message);
    store.addLog('security', 'error', `[SECURITY VIOLATION] ${cleanMsg}${metadata ? ' | ' + JSON.stringify(metadata) : ''}`);
  }
};

/**
 * Verifies if a user role has permissions to access a dashboard tab.
 */
export function checkPermissions(role: string, tab: string): boolean {
  const permissions = ROLE_PERMISSIONS[role as UserRole] || [];
  return permissions.includes(tab);
}

// Common jailbreak or prompt injection detection patterns
const INJECTION_PATTERNS = [
  /ignore\s+(?:all\s+)?prior\s+instructions/gi,
  /bypass\s+safety/gi,
  /you\s+are\s+now\s+an\s+unrestricted/gi,
  /system\s+override/gi,
  /developer\s+mode/gi,
  /<script>/gi,
  /javascript:/gi,
  /override\s+rules/gi,
  /reveal\s+hidden\s+prompts/gi,
  /leak\s+secrets/gi,
  /execute\s+arbitrary\s+commands/gi,
  /manipulate\s+system\s+instructions/gi
];

/**
 * Validates a prompt string against injection and jailbreak patterns.
 */
export function validatePrompt(prompt: string): { valid: boolean; reason?: string } {
  if (!prompt) return { valid: true };
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(prompt)) {
      return {
        valid: false,
        reason: `Input matched suspicious safety pattern: ${pattern.toString()}`
      };
    }
  }
  return { valid: true };
}

const rateLimitCache: Record<string, number[]> = {};
const LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Max 10 requests per minute

/**
 * Sliding window rate limiter to protect endpoints from flooding.
 */
export function rateLimiter(clientId: string): boolean {
  const now = Date.now();
  if (!rateLimitCache[clientId]) {
    rateLimitCache[clientId] = [];
  }
  
  // Filter out timestamps outside the window
  rateLimitCache[clientId] = rateLimitCache[clientId].filter(ts => now - ts < LIMIT_WINDOW_MS);
  
  if (rateLimitCache[clientId].length >= MAX_REQUESTS) {
    return false;
  }
  
  rateLimitCache[clientId].push(now);
  return true;
}

/**
 * Recursively sanitizes all string properties of an object or array.
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeOutput(obj) as any;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as any;
  }
  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = sanitizeObject((obj as any)[key]);
      }
    }
    return newObj;
  }
  return obj;
}
