import { AnalysisTone, LacanianReport, PillarGrade } from '@/types';
import { detectActiveArchetypes } from './archetypal';
import { SELF_MODULES } from '@/data/theSelf';

/**
 * Pillar I — "The Self" comprehensive Jungian analysis.
 *
 * Runs when the user presses Submit after completing the interactive exercises
 * and journal entries. It reads ALL submitted material and produces a
 * comprehensive progress + analysis report, which is archived (added to the
 * pillar's reports) and later folded into the full pillar report.
 *
 * This is the offline generator; analysis/remote.ts → analyzeSelfPillar routes
 * to the LLM when a server is configured, with this as the fallback.
 */

export type SelfEntry = { moduleId: string; title: string; exercise: string; journal: string };

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function gradeProgress(entries: SelfEntry[]): PillarGrade {
  const filled = entries.filter((e) => (e.exercise + e.journal).trim().length > 0);
  const coverage = filled.length / Math.max(SELF_MODULES.length, 1); // 0..1
  const words = entries.reduce((n, e) => n + (e.exercise + ' ' + e.journal).trim().split(/\s+/).filter(Boolean).length, 0);
  const depth = countMarkers(entries.map((e) => e.exercise + ' ' + e.journal).join(' '), [
    'i felt', 'i realised', 'i realized', 'shadow', 'afraid', 'ashamed', 'my mother', 'my father', 'as a child', 'i keep', 'dream',
  ]);

  const conscious = clamp(40 + coverage * 45 + words / 12); // articulation / bringing to consciousness
  const integration = clamp(35 + depth * 6 + coverage * 20); // integration of opposites/shadow
  const wholeness = clamp(30 + coverage * 40 + depth * 3); // orientation toward the Self

  const avg = (conscious + integration + wholeness) / 3;
  const letter: PillarGrade['letter'] =
    coverage < 0.5 ? 'Incomplete' : avg >= 82 ? 'A' : avg >= 68 ? 'B' : avg >= 52 ? 'C' : 'D';

  const commentary =
    letter === 'Incomplete'
      ? 'Several modules are not yet worked. Return and complete the exercises and journals before the full analysis can form.'
      : integration < 55
        ? 'Good conscious articulation; the harder work of integrating the Shadow and the opposites is still ahead.'
        : wholeness < 55
          ? 'Real integration is underway, but the orientation toward the Self — holding the whole — is still forming.'
          : 'Strong, whole-psyche engagement. Ego and Self are beginning to align.';

  return { letter, registers: { imaginary: integration, symbolic: conscious, real: wholeness }, commentary };
}

export function generateSelfPillarReport(tone: AnalysisTone, entries: SelfEntry[]): LacanianReport {
  const you = tone === 'clinician' ? 'the analysand' : 'you';
  const es = tone === 'clinician' ? 's' : '';
  const all = entries.map((e) => `${e.exercise} ${e.journal}`).join(' ');
  const archetypes = detectActiveArchetypes(all).slice(0, 5).map((d) => d.archetype.name);
  const grade = gradeProgress(entries);
  const get = (id: string) => entries.find((e) => e.moduleId === id);

  const opener =
    tone === 'clinician'
      ? 'Comprehensive Jungian progress note for the treating analyst, drawn from the analysand’s Pillar I (The Self) exercises and journals. Offered as case material to verify in session.'
      : 'A comprehensive Jungian reading of your work in Pillar I — The Self. This is a progress map, not a verdict.';

  const lines: string[] = [opener];

  lines.push(`\nEgo and Persona. From ${you === 'you' ? 'your' : 'the'} work, the conscious identity (“${short(get('ego')?.journal)}”) and the masks (“${short(get('persona')?.journal)}”) are becoming visible as parts, not the whole. Seeing the Persona as a mask is the first loosening.`);

  lines.push(`\nThe Shadow. In the Active Imagination work, ${you} met a disowned figure (“${short(get('shadow')?.exercise)}”). What it wanted — “${short(get('shadow')?.journal)}” — is precisely the energy to reclaim. Integration, not conquest, is the task.`);

  lines.push(`\nThe contrasexual figure. The Anima/Animus appears as “${short(get('anima_animus')?.exercise)}”, showing itself in ${you === 'you' ? 'your' : 'the'} attractions and resentments. Relating to it consciously is what brings balance.`);

  lines.push(`\nIndividuation in motion. ${cap(you)} identif${tone === 'clinician' ? 'ies' : 'y'} what wants to become conscious now: “${short(get('individuation')?.journal)}”. That is the live edge of the process.`);

  if (archetypes.length) {
    lines.push(`\nActive archetypes. Across the material, these figures are alive: ${archetypes.join(', ')}. Confront and relate to them consciously rather than being driven by them.`);
  }

  lines.push(`\nBalancing opposites & the Self. The tension ${you} named (“${short(get('balancing_opposites')?.journal)}”) is not a problem to solve but the very place the Self forms. Aligning Ego with Self — “${short(get('self_realization')?.journal)}” — is the ongoing goal.`);

  lines.push(`\nProgress. Integration ${grade.registers.imaginary}, conscious articulation ${grade.registers.symbolic}, orientation to wholeness ${grade.registers.real}. ${grade.commentary}`);
  lines.push(`\nThis analysis is archived. When every module in Pillar I is complete, these records combine into your full pillar report.`);

  return {
    id: uid(),
    createdAt: Date.now(),
    tone,
    title: 'Pillar I — The Self · Jungian Progress & Analysis',
    narrative: lines.join('\n'),
    focusAreas: [
      'integrate the Shadow figure’s energy rather than projecting it',
      'relate consciously to the Anima/Animus',
      ...(archetypes.length ? [`work the active archetypes: ${archetypes.join(', ')}`] : []),
      'hold the tension of opposites instead of choosing one side',
    ],
    archetypes,
    grade,
    pillarId: 1,
  };
}

/* helpers */
function short(v?: string) {
  const t = (v ?? '').trim();
  if (!t) return '—';
  return t.length > 120 ? `${t.slice(0, 117)}…` : t;
}
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}
function countMarkers(text: string, markers: string[]) {
  const t = text.toLowerCase();
  return markers.reduce((n, m) => n + (t.includes(m) ? 1 : 0), 0);
}
