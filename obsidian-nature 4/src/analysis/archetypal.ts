import { AnalysisTone, LacanianReport } from '@/types';
import { ARCHETYPES, Archetype } from '@/data/archetypes';

/**
 * Local (offline) "Analyze through Jungian Lens" generator for Pillar II.
 *
 * Detects which archetypes are active in a free-text reflection (experiences,
 * dreams, life patterns) by keyword resonance, then writes a Jungian
 * pattern-analysis report. The remote LLM version (analysis/remote.ts →
 * analyzeArchetypalPattern) produces richer prose; this is the fallback.
 */

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function detectActiveArchetypes(text: string): { archetype: Archetype; hits: number }[] {
  const t = ` ${text.toLowerCase()} `;
  return ARCHETYPES.map((a) => ({
    archetype: a,
    hits: a.keys.reduce((n, k) => (t.includes(k.toLowerCase()) ? n + 1 : n), 0),
  }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits);
}

export function generateArchetypalPatternReport(tone: AnalysisTone, text: string): LacanianReport {
  const you = tone === 'clinician' ? 'the analysand' : 'you';
  const detected = detectActiveArchetypes(text);
  const active = detected.slice(0, 4);
  const names = active.map((d) => d.archetype.name);

  const opener =
    tone === 'clinician'
      ? 'Archetypal reading prepared for the treating analyst — offered as associations to open in session, not as a fixed interpretation.'
      : 'A Jungian reading of the pattern in your words. These are openings, not verdicts — take them into your own reflection and into session.';

  const body: string[] = [opener];

  if (active.length === 0) {
    body.push(
      `\nNo single archetype pressed forward strongly here. That is itself information: the material may be defended, or still forming. Write again, longer, and let the images arrive uncensored — the figures usually announce themselves once the ego stops narrating.`,
    );
  } else {
    body.push(`\nActive constellation. In this material, the archetypes most alive are: ${names.join(', ')}.`);
    for (const { archetype: a } of active) {
      body.push(
        `\n${a.name} (${a.glyph}). ${a.description} In ${you === 'you' ? 'your' : 'the analysand’s'} text it surfaces around the themes it governs. Watch its shadow form: ${a.shadow}`,
      );
    }
    body.push(
      `\nThe work. Individuation does not mean choosing the flattering archetypes and refusing the rest. It means relating consciously to each — especially the Shadow — so that its energy serves the whole rather than possessing you unseen. Bring ${names.length > 1 ? 'these figures' : 'this figure'} to your analyst as living material, not labels.`,
    );
  }

  return {
    id: uid(),
    createdAt: Date.now(),
    tone,
    title: 'Archetypal Pattern — Jungian Analysis',
    narrative: body.join('\n'),
    focusAreas: names.length ? names.map((n) => `relate consciously to ${n} (integrate, don’t be possessed)`) : ['let the images arrive uncensored, then re-read'],
    archetypes: names,
  };
}
