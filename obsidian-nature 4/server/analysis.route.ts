import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { auth } from './auth'; // your better-auth server instance
import { SYSTEM_PROMPT, buildPrompt } from './prompts';

/**
 * Reference analysis API for Obsidian Nature.
 *
 * Mount this on the SAME origin as better-auth so the app's session cookie is
 * valid here:
 *
 *   import { analysisRouter } from './analysis.route';
 *   app.use(analysisRouter);
 *
 * The app posts to POST /api/analysis/:kind (see src/analysis/endpoint.ts).
 * Every request is authenticated with the better-auth session, lightly
 * rate-limited, and answered with strict JSON from Claude. The mobile client
 * falls back to its local template engine if this endpoint is unreachable, so a
 * transient failure here never blocks the user.
 */
export const analysisRouter = Router();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const MODEL = process.env.ANALYSIS_MODEL ?? 'claude-sonnet-5';

const VALID_KINDS = new Set([
  'intake-report',
  'archetype-report',
  'pillar-report',
  'homework-grade',
  'self-pillar-report',
  'temperament-pillar-report',
  'archetypal-pattern',
  'dream',
  'nightly',
  'daily-ritual',
]);

// Tiny in-memory rate limiter (swap for Redis in production).
const hits = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 40; // requests
const WINDOW_MS = 60 * 60 * 1000; // per hour per user

function rateLimited(userId: string): boolean {
  const now = Date.now();
  const rec = hits.get(userId);
  if (!rec || now > rec.resetAt) {
    hits.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > LIMIT;
}

analysisRouter.post('/api/analysis/:kind', async (req: Request, res: Response) => {
  const { kind } = req.params;
  if (!VALID_KINDS.has(kind)) return res.status(404).json({ error: 'unknown kind' });

  // 1) Authenticate via better-auth session (cookie forwarded by the app).
  const session = await auth.api.getSession({ headers: req.headers as any });
  if (!session?.user) return res.status(401).json({ error: 'unauthenticated' });

  // 2) Rate limit.
  if (rateLimited(session.user.id)) return res.status(429).json({ error: 'rate limited' });

  // 3) Build the prompt and call Claude.
  try {
    const { user } = buildPrompt(kind, req.body ?? {});
    const completion = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1600,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: user }],
    });

    const text = completion.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');

    const json = extractJson(text);
    if (!json) return res.status(502).json({ error: 'model did not return valid JSON' });
    return res.json(json);
  } catch (e) {
    console.error('[analysis]', kind, e);
    // 500 → the mobile client silently falls back to its local generator.
    return res.status(500).json({ error: 'analysis failed' });
  }
});

/** Robustly pull the first JSON object out of a model response. */
function extractJson(text: string): unknown | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}
