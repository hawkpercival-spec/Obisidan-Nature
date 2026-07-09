# Obsidian Nature — analysis backend (reference)

The app never holds an LLM key. It calls this server, which authenticates the
request with the better-auth session and calls Claude. If this server is down or
unset, the app silently falls back to its on-device template engine.

## Endpoints

`POST /api/analysis/:kind` — kinds: `intake-report`, `archetype-report`,
`pillar-report`, `homework-grade`, `dream`, `nightly`, `daily-ritual`.
Body = the payload the client sends (see `src/analysis/remote.ts`). Returns the
JSON shape declared in `prompts.ts`.

Auth routes (`/api/auth/*`) are served by better-auth on the same origin so the
mobile session cookie is valid on the analysis routes too.

## Run

```bash
cd server
npm install
export ANTHROPIC_API_KEY=sk-ant-...
export APPLE_CLIENT_ID=...            # Apple Services ID
export APPLE_CLIENT_SECRET=...        # signed client-secret JWT
export ANALYSIS_MODEL=claude-sonnet-5 # optional; default shown
npm run dev
```

Wire a real database adapter in `auth.ts` (drizzle/prisma/etc.) before
production — better-auth needs persistence for sessions and accounts.

## Point the app at it

In `../app.json` set:
```json
"extra": {
  "authBaseUrl": "https://your-server.example.com",
  "analysisBaseUrl": "https://your-server.example.com"
}
```
`analysisConfigured()` in the app treats `localhost`, `example.com`, and
`YOUR_...` placeholders as "not configured" and stays on the local fallback, so
you can develop the UI without a server and flip to live by setting a real URL.

## Notes / hardening

- The in-memory rate limiter resets on restart — move to Redis for real traffic.
- Consider logging only non-PII metadata; the payloads contain sensitive
  self-analysis material. Encrypt at rest and set a short retention window.
- `max_tokens`/`temperature` are tuned for report-length prose; adjust per kind
  if you want tighter or longer output.
- Model string is configurable via `ANALYSIS_MODEL`.
