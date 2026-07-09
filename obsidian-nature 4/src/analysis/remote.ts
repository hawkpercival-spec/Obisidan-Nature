import * as local from './lacanian';
import { analyseDream as localAnalyseDream } from './dreams';
import { generateArchetypalPatternReport as localArchetypalPattern } from './archetypal';
import { generateSelfPillarReport as localSelfPillar, SelfEntry } from './self';
import { generateTemperamentPillarReport as localTemperamentPillar, HumorEntry } from './temperamentPillar';
import { requestAnalysis, RemoteReport, analysisConfigured } from './endpoint';
import {
  AnalysisTone,
  ArchetypalInput,
  BedchamberResult,
  DreamAnalysis,
  DreamEntry,
  LacanianReport,
  NightlyInventory,
  TemperamentResult,
} from '@/types';

export { analysisConfigured };

/**
 * Async analysis layer.
 *
 * Each function calls the backend LLM endpoint and, on ANY failure (endpoint not
 * configured, offline, timeout, non-2xx), falls back to the deterministic local
 * generator in ./lacanian.ts or ./dreams.ts. The app therefore always produces a
 * result — richer prose when the server is reachable, solid template output when
 * it isn't. Screens just `await` these.
 */

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function wrapReport(
  tone: AnalysisTone,
  r: RemoteReport,
  extra?: Partial<LacanianReport>,
): LacanianReport {
  return {
    id: uid(),
    createdAt: Date.now(),
    tone,
    title: r.title,
    narrative: r.narrative,
    focusAreas: r.focusAreas ?? [],
    archetypes: r.archetypes,
    grade: r.grade,
    ...extra,
  };
}

export async function generateIntakeReport(inp: local.IntakeInputs): Promise<LacanianReport> {
  try {
    const r = await requestAnalysis<RemoteReport>('intake-report', inp);
    return wrapReport(inp.tone, r);
  } catch {
    return local.generateIntakeReport(inp);
  }
}

export async function generateArchetypeReport(
  tone: AnalysisTone,
  input?: ArchetypalInput,
): Promise<LacanianReport> {
  try {
    const r = await requestAnalysis<RemoteReport>('archetype-report', { tone, input });
    return wrapReport(tone, r);
  } catch {
    return local.generateArchetypeReport(tone, input);
  }
}

export async function generatePillarReport(
  pillar: Parameters<typeof local.generatePillarReport>[0],
  tone: AnalysisTone,
  responses: string[],
): Promise<LacanianReport> {
  try {
    const r = await requestAnalysis<RemoteReport>('pillar-report', { pillar, tone, responses });
    return wrapReport(tone, r, { pillarId: pillar.id });
  } catch {
    return local.generatePillarReport(pillar, tone, responses);
  }
}

export async function gradeHomework(
  pillar: Parameters<typeof local.gradeHomework>[0],
  tone: AnalysisTone,
  submission: string,
): Promise<LacanianReport> {
  try {
    const r = await requestAnalysis<RemoteReport>('homework-grade', { pillar, tone, submission });
    return wrapReport(tone, r, { pillarId: pillar.id });
  } catch {
    return local.gradeHomework(pillar, tone, submission);
  }
}

/** Pillar II — "Analyze through Jungian Lens" on a free-text reflection. */
export async function analyzeArchetypalPattern(tone: AnalysisTone, text: string): Promise<LacanianReport> {
  try {
    const r = await requestAnalysis<RemoteReport>('archetypal-pattern', { tone, text });
    return wrapReport(tone, r);
  } catch {
    return localArchetypalPattern(tone, text);
  }
}

/** Pillar I — comprehensive Jungian analysis over all "The Self" exercises + journals. */
export async function analyzeSelfPillar(tone: AnalysisTone, entries: SelfEntry[]): Promise<LacanianReport> {
  try {
    const r = await requestAnalysis<RemoteReport>('self-pillar-report', { tone, entries });
    return wrapReport(tone, r, { pillarId: 1 });
  } catch {
    return localSelfPillar(tone, entries);
  }
}

/** Pillar III — four-temperaments (Doctrine of Opposites) analysis. */
export async function analyzeTemperamentPillar(
  tone: AnalysisTone,
  entries: HumorEntry[],
  intakeTemperament?: TemperamentResult,
  game?: BedchamberResult,
): Promise<LacanianReport> {
  try {
    const r = await requestAnalysis<RemoteReport>('temperament-pillar-report', { tone, entries, intakeTemperament, game });
    return wrapReport(tone, r, { pillarId: 3 });
  } catch {
    return localTemperamentPillar(tone, entries, intakeTemperament, game);
  }
}

export async function analyseDream(entry: DreamEntry, tone: AnalysisTone): Promise<DreamAnalysis> {
  try {
    return await requestAnalysis<DreamAnalysis>('dream', { entry, tone });
  } catch {
    return localAnalyseDream(entry, tone);
  }
}

export async function generateNightly(
  date: string,
  opts: { age?: number; tone: AnalysisTone },
): Promise<NightlyInventory> {
  try {
    const r = await requestAnalysis<{ journalPrompt: string; analysisPrompt: string; elderGuidance?: string }>(
      'nightly',
      { date, ...opts },
    );
    return {
      id: uid(),
      date,
      journalPrompt: r.journalPrompt,
      analysisPrompt: r.analysisPrompt,
      elderGuidance: r.elderGuidance,
    };
  } catch {
    return local.generateNightly(date, opts);
  }
}

export async function generateDailyRitual(
  ctx: Parameters<typeof local.generateDailyRitual>[0],
): Promise<{ checkIn: string; exercise: string }> {
  try {
    return await requestAnalysis<{ checkIn: string; exercise: string }>('daily-ritual', ctx);
  } catch {
    return local.generateDailyRitual(ctx);
  }
}
