import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';
import { analysisRouter } from './analysis.route';

/**
 * Minimal reference server: better-auth routes + the analysis API on one origin.
 * Deploy anywhere Node runs (Fly, Render, Railway, a VPS). Then set the app's
 * `extra.authBaseUrl` (and optionally `extra.analysisBaseUrl`) in app.json to
 * this server's URL.
 */
const app = express();

// better-auth handles all /api/auth/* routes (must be mounted before express.json
// on its own path, per better-auth's Node guide).
app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json({ limit: '256kb' }));
app.use(analysisRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`Obsidian Nature server on :${port}`));
