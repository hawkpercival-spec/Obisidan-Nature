import Constants from 'expo-constants';
import { authClient } from '@/auth/auth';

/**
 * Thin client for the analysis backend.
 *
 * SECURITY: the LLM provider key (Anthropic/OpenAI) must NEVER live in the app —
 * anything bundled ships to every device and can be extracted. The app therefore
 * calls YOUR server, which holds the key and calls the model. See server/ for a
 * reference implementation of these routes.
 *
 * We reuse the better-auth session: the Expo client stores the session cookie,
 * and `authClient.getCookie()` returns it for attaching to native fetch calls so
 * the server can authenticate + rate-limit the request.
 */
const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;
const BASE = extra.analysisBaseUrl || extra.authBaseUrl || '';

/** True only when a real (non-placeholder) endpoint is configured. */
export function analysisConfigured(): boolean {
  return BASE.length > 0 && !/YOUR_|localhost|example\.com/i.test(BASE);
}

const DEFAULT_TIMEOUT_MS = 30000;

export async function requestAnalysis<T>(kind: string, payload: unknown): Promise<T> {
  if (!analysisConfigured()) throw new Error('analysis endpoint not configured');

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    // getCookie is provided by @better-auth/expo; cast guards across versions.
    const cookie = (authClient as unknown as { getCookie?: () => string }).getCookie?.();
    if (cookie) headers.Cookie = cookie;
  } catch {
    /* not signed in / no cookie — server may reject, which triggers local fallback */
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE.replace(/\/$/, '')}/api/analysis/${kind}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`analysis/${kind} responded ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/** Shape the server returns for report-style endpoints (structural fields added client-side). */
export type RemoteReport = {
  title: string;
  narrative: string;
  focusAreas: string[];
  archetypes?: string[];
  grade?: {
    letter: 'A' | 'B' | 'C' | 'D' | 'Incomplete';
    registers: { imaginary: number; symbolic: number; real: number };
    commentary: string;
  };
};
