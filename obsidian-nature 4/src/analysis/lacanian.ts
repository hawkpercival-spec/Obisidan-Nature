import {
  AnalysisTone,
  ArchetypalInput,
  CognitionResult,
  EnneagramResult,
  HomeworkAssignment,
  IntakeAnswers,
  LacanianReport,
  LifeStageContext,
  NightlyInventory,
  PillarGrade,
  TemperamentResult,
} from '@/types';
import { enneagramName } from '@/data/enneagram';
import { FUNCTION_NAMES } from '@/data/cognition';
import { TEMPERAMENT_DESC } from '@/data/temperament';
import { PillarDef } from '@/data/pillars';
import { LATE_LIFE_STAGES, ELDER_LENSES } from './erikson';

/**
 * On-device analysis generator.
 *
 * Everything here is TEMPLATE-DRIVEN so the app produces coherent, grounded,
 * Lacanian-styled reports offline. Each function is a clean seam: swap the body
 * for a server LLM call (feeding the same inputs) whenever you want richer prose.
 *
 * GROUNDING RULE: language is psychological and metaphorical. No supernatural
 * claims, no mysticism asserted as literal reality. "Obsidian nature" = shadow.
 */

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/** Tone helper — clinician mode addresses the treating analyst about the patient. */
function open(tone: AnalysisTone, name?: string | null) {
  return tone === 'clinician'
    ? `Case note for the treating analyst. The following formulation is offered as material for your work with this analysand${name ? ` (${name})` : ''}, not as a substitute for your clinical judgement.`
    : `You arrive as a subject divided — as all speaking beings are. Read this not as a verdict but as a map of where your speech has been circling.`;
}

function subj(tone: AnalysisTone) {
  return tone === 'clinician' ? 'the analysand' : 'you';
}

// ---------------------------------------------------------------------------
// INTAKE REPORT
// ---------------------------------------------------------------------------

export type IntakeInputs = {
  tone: AnalysisTone;
  name?: string | null;
  age?: number;
  answers: IntakeAnswers;
  enneagram?: EnneagramResult;
  cognition?: CognitionResult;
  temperament?: TemperamentResult;
  archetypes?: string[];
};

export function generateIntakeReport(inp: IntakeInputs): LacanianReport {
  const { tone } = inp;
  const S = subj(tone);
  const lines: string[] = [open(tone, inp.name)];

  // Freudian + Lacanian intake answers (see data/intake.ts for the full form).
  const presenting = str(inp.answers.f_presenting);
  const symptoms = str(inp.answers.f_symptoms);
  const avoidance = str(inp.answers.f_avoidance);
  const parents = str(inp.answers.f_parents);
  const earliest = str(inp.answers.f_earliest);
  const patterns = str(inp.answers.f_patterns);
  const origins = str(inp.answers.l_origins);
  const meaning = str(inp.answers.l_meaning);
  const body = str(inp.answers.l_body);
  const death = str(inp.answers.l_death);
  const desire = str(inp.answers.l_desire);
  const good = str(inp.answers.l_good);
  const repetition = str(inp.answers.l_repetition);
  const es = tone === 'clinician' ? 's' : '';

  lines.push(
    `\nThe presenting knot. ${cap(S)} name${es} what troubles ${tone === 'clinician' ? 'them' : 'you'}: “${presenting || '—'}”, showing itself as ${symptoms || 'the symptoms described'}. In a Lacanian reading this is less a problem to be solved than a signifier ${S} circle${es} — a place where speech snags on desire. Note how it is phrased as a demand addressed to an Other.`,
  );

  lines.push(
    `\nHistory and origins (Freudian). Growing up, ${tone === 'clinician' ? 'the analysand’s' : 'your'} bond with mother and father — “${parents || '—'}” — lays down a template that the present re-stages. The earliest remembered scene, “${earliest || '—'}”, is rarely innocent: it is chosen by the psyche for a reason. On the question of origins ${S} say${es}: “${origins || '—'}”.`,
  );

  lines.push(
    `\nDefense and repetition. ${cap(S)} keep${es} distress at bay by: “${avoidance || '—'}”. And the pattern ${S} ${tone === 'clinician' ? 'is' : 'are'} beginning to see is “${patterns || '—'}”. This is the Freudian compulsion to repeat — and its Lacanian counterpart, a jouissance, a costly satisfaction hidden inside the suffering.`,
  );

  lines.push(
    `\nThe Real — meaning, body, aliveness. Were the symptom to speak, ${S} sense${es} it points at: “${meaning || '—'}”. The body is experienced as “${body || '—'}”, and the question of aliveness answered: “${death || '—'}”. These press on what resists language — the material the later pillars will circle carefully.`,
  );

  lines.push(
    `\nDesire and the Good. Beneath the surface wishes, ${S} want${es} most: “${desire || '—'}”. And ${tone === 'clinician' ? 'their' : 'your'} singular idea of a good life, apart from what is expected, is: “${good || '—'}”. The work is to separate this desire from the desire of the Other.`,
  );

  if (repetition) {
    lines.push(
      `\nThe self as symptom (the pivot). On the central question — why this keeps happening, and ${tone === 'clinician' ? 'the analysand’s' : 'your'} own hand in it — ${S} write${es}: “${repetition}”. This move, from “why me?” to “what is my part?”, is where the obsidian nature is met rather than merely suffered.`,
    );
  }

  if (inp.enneagram) {
    const e = inp.enneagram;
    lines.push(
      `\nEnneagram (${e.type} — ${enneagramName(e.type)}${e.wing ? `, wing ${e.wing}` : ''}). This fixation names the characteristic strategy by which ${S} manage${tone === 'clinician' ? 's' : ''} anxiety. It will colour how ${S} enter${tone === 'clinician' ? 's' : ''} each pillar — especially the defended edge of the type.`,
    );
  }
  if (inp.cognition) {
    const c = inp.cognition;
    lines.push(
      `\nJungian cognition (${c.type}). Dominant ${FUNCTION_NAMES[c.functionStack[0]]}, inferior ${FUNCTION_NAMES[c.functionStack[3]]}. The inferior function is where the shadow most often erupts; exercises will deliberately route through it.`,
    );
  }
  if (inp.temperament) {
    const t = inp.temperament;
    lines.push(
      `\nMedieval temperament (${t.primary} / ${t.secondary}). ${TEMPERAMENT_DESC[t.primary]} This sets the affective weather in which the work will be done.`,
    );
  }
  if (inp.archetypes?.length) {
    lines.push(
      `\nArchetypal field. From ${tone === 'clinician' ? 'the analysand’s' : 'your'} chosen stories, these figures recur: ${inp.archetypes.join(', ')}. They will be worked directly in Pillar II (The Archetypal).`,
    );
  }

  const focusAreas = deriveFocusAreas(inp);
  lines.push(`\nWhat to cultivate. Across the Seven Pillars, attend especially to: ${focusAreas.join('; ')}.`);

  if (inp.age && inp.age >= 70 && inp.age <= 100) {
    lines.push(`\n${elderAddendum(tone)}`);
  }

  if (tone === 'clinician') {
    lines.push(
      `\nFor the consulting room. Useful openings: the demand embedded in the complaint; the provenance of the internalised judge; the secondary gain in the retained symptom. Offered for your case study, to be verified against the analysand’s speech in session.`,
    );
  }

  return {
    id: uid(),
    createdAt: Date.now(),
    tone,
    title: 'Intake — Freudian & Lacanian Case Formulation',
    narrative: lines.join('\n'),
    focusAreas,
    archetypes: inp.archetypes,
  };
}

function deriveFocusAreas(inp: IntakeInputs): string[] {
  const out: string[] = [];
  if (inp.enneagram) out.push(`loosening the type-${inp.enneagram.type} strategy where it forecloses desire`);
  if (inp.cognition) out.push(`developing the inferior ${FUNCTION_NAMES[inp.cognition.functionStack[3]]}`);
  if (inp.temperament) out.push(`working with the ${inp.temperament.primary} temperament’s characteristic excess`);
  if (str(inp.answers.f_avoidance)) out.push('meeting what your defenses keep at bay, rather than avoiding it');
  if (str(inp.answers.f_patterns)) out.push('naming the satisfaction hidden inside the repeating pattern');
  if (str(inp.answers.l_meaning)) out.push('reading the symptom as a message rather than a malfunction');
  if (str(inp.answers.l_repetition)) out.push('owning your part in what repeats — moving from “why me?” to “what is my hand in this?”');
  out.push('separating your desire from the desire of the Other');
  return out;
}

// ---------------------------------------------------------------------------
// ARCHETYPE REPORT (Archetypal Explorations tab)
// ---------------------------------------------------------------------------

export function detectArchetypes(input?: ArchetypalInput): string[] {
  if (!input) return [];
  const text = `${input.movies} ${input.books} ${input.fairytales} ${input.characters}`.toLowerCase();
  const map: [string, string[]][] = [
    ['The Shadow', ['villain', 'dark', 'monster', 'evil', 'joker', 'vader', 'wolf']],
    ['The Hero', ['hero', 'quest', 'warrior', 'knight', 'skywalker', 'harry', 'aragorn']],
    ['The Orphan / Innocent', ['orphan', 'child', 'lost', 'cinderella', 'oliver']],
    ['The Sage / Mentor', ['wizard', 'mentor', 'teacher', 'gandalf', 'dumbledore', 'yoda']],
    ['The Lover', ['love', 'romance', 'passion', 'juliet']],
    ['The Rebel / Outlaw', ['rebel', 'outlaw', 'anti-hero', 'thief', 'robin']],
    ['The Caregiver', ['mother', 'nurse', 'protector', 'guardian']],
    ['The Trickster', ['trickster', 'loki', 'fox', 'jester', 'coyote']],
    ['The Ruler', ['king', 'queen', 'throne', 'ruler', 'emperor']],
    ['The Magician / Alchemist', ['magic', 'alchemist', 'transform', 'witch']],
  ];
  const found = map.filter(([, keys]) => keys.some((k) => text.includes(k))).map(([a]) => a);
  // Always give the shadow its due in this app.
  if (!found.includes('The Shadow')) found.push('The Shadow (implicit — to be surfaced)');
  return Array.from(new Set(found)).slice(0, 6);
}

export function generateArchetypeReport(tone: AnalysisTone, input?: ArchetypalInput): LacanianReport {
  const archetypes = detectArchetypes(input);
  const S = subj(tone);
  const narrative = [
    open(tone),
    `\nFrom the stories ${S} love${tone === 'clinician' ? 's' : ''}, we read the archetypal field — the cast of figures through which the psyche stages itself. Jung would call these the inhabitants of the collective unconscious as they appear in personal material; Lacan would remind us they are also signifiers, positions in a structure.`,
    `\nSurfaced archetypes: ${archetypes.join(', ')}.`,
    `\nBring these to your analyst. The figures you are drawn to often carry ideal-ego material; the ones you cannot stand usually carry the shadow — the obsidian nature you have exiled. Both are you.`,
  ].join('\n');
  return {
    id: uid(),
    createdAt: Date.now(),
    tone,
    title: 'Archetypal Explorations',
    narrative,
    focusAreas: archetypes.map((a) => `work the projection carried by ${a}`),
    archetypes,
  };
}

// ---------------------------------------------------------------------------
// PILLAR EXERCISE PERSONALISATION
// ---------------------------------------------------------------------------

export function personaliseExercises(
  pillar: PillarDef,
  ctx: { enneagram?: EnneagramResult; cognition?: CognitionResult; temperament?: TemperamentResult; age?: number },
): string[] {
  const ex = [...pillar.exerciseSeeds];

  if (ctx.cognition) {
    const inf = FUNCTION_NAMES[ctx.cognition.functionStack[3]];
    ex.push(`Cognition work: approach this pillar deliberately through your inferior ${inf} — the function that ambushes you. Where does it show up in this material?`);
  }
  if (ctx.enneagram) {
    ex.push(`Type work: notice how your Enneagram ${ctx.enneagram.type} strategy tries to “solve” this pillar prematurely. Resist the solution; stay with the question.`);
  }
  if (ctx.temperament) {
    ex.push(`Temperament work: your ${ctx.temperament.primary} nature will react to this pillar in a characteristic way — track that reaction as data.`);
  }
  if (ctx.age && ctx.age >= 70 && ctx.age <= 100) {
    ex.push(elderExerciseForPillar(pillar));
  }
  return ex;
}

function elderExerciseForPillar(pillar: PillarDef): string {
  const stage = LATE_LIFE_STAGES[0];
  return `Elder integration: relate this pillar to the task of ${stage.name.toLowerCase()}. ${ELDER_LENSES.lacanian} Write what this pillar has meant across the whole arc of your life.`;
}

// ---------------------------------------------------------------------------
// PILLAR CASE FORMULATION + GRADING
// ---------------------------------------------------------------------------

/** Grade a pillar submission against a (self-)Lacanian rubric across the three registers. */
export function gradePillar(responses: string[]): PillarGrade {
  const words = responses.join(' ').trim().split(/\s+/).filter(Boolean).length;
  const depthMarkers = countMarkers(responses.join(' '), [
    'because', 'i felt', 'i realised', 'i realized', 'reminds me', 'as a child', 'my mother', 'my father', 'afraid', 'ashamed', 'desire', 'i keep',
  ]);
  const specificity = countMarkers(responses.join(' '), ['when', 'the time', 'once', 'that day', 'she said', 'he said']);

  const symbolic = clamp(40 + words / 6 + depthMarkers * 4); // articulation in language
  const imaginary = clamp(45 + specificity * 6 + depthMarkers * 2); // relation to self-image
  const real = clamp(30 + depthMarkers * 5); // proximity to the traumatic kernel

  const avg = (symbolic + imaginary + real) / 3;
  const letter: PillarGrade['letter'] =
    words < 25 ? 'Incomplete' : avg >= 82 ? 'A' : avg >= 68 ? 'B' : avg >= 52 ? 'C' : 'D';

  const commentary =
    letter === 'Incomplete'
      ? 'The pillar is not yet spoken. Return and let yourself write past the first, safe sentence.'
      : real < 55
        ? 'Good symbolic articulation, but the work circles the wound without touching its edge. The next pass should risk the harder detail.'
        : imaginary < 55
          ? 'You reach real material, yet the relation to your own image stays hidden. Ask how this protects a picture of yourself.'
          : 'Strong integration across registers. The subject speaks here, not merely the ego.';

  return { letter, registers: { imaginary, symbolic, real }, commentary };
}

export function generatePillarReport(
  pillar: PillarDef,
  tone: AnalysisTone,
  responses: string[],
): LacanianReport {
  const grade = gradePillar(responses);
  const S = subj(tone);
  const narrative = [
    open(tone),
    `\nPillar ${roman(pillar.id)} — ${pillar.name}. ${pillar.summary}`,
    `\nFormulation. Working the register of the ${pillar.register}, ${S} produced material scoring — Imaginary ${grade.registers.imaginary}, Symbolic ${grade.registers.symbolic}, Real ${grade.registers.real}. ${grade.commentary}`,
    `\nGrade: ${grade.letter}.`,
    grade.registers.real < 55
      ? `\nRefinement to carry forward. An area of lack is visible near the Real; the year-long arc will add exercises here before the next pillar closes.`
      : `\nThe subject has advanced. The knot is being spoken rather than merely suffered.`,
    tone === 'clinician'
      ? `\nFor the treating analyst: offered as case-study material; verify against session speech.`
      : '',
  ].filter(Boolean).join('\n');

  return {
    id: uid(),
    createdAt: Date.now(),
    tone,
    title: `Pillar ${roman(pillar.id)} — Case Formulation`,
    narrative,
    focusAreas: [grade.commentary],
    grade,
    pillarId: pillar.id,
  };
}

// ---------------------------------------------------------------------------
// HOMEWORK (weekly, assigned Fridays)
// ---------------------------------------------------------------------------

export function generateHomework(
  pillar: PillarDef,
  ctx: { enneagram?: EnneagramResult; cognition?: CognitionResult; assignedAt: number; dueAt: number; hasDreams: boolean; hasNightly: boolean },
): HomeworkAssignment {
  const parts = [
    `This week’s assignment for Pillar ${roman(pillar.id)} (${pillar.name}).`,
    `Core task: ${pillar.exerciseSeeds[0]}`,
  ];
  if (ctx.cognition) parts.push(`Route the reflection through your inferior ${FUNCTION_NAMES[ctx.cognition.functionStack[3]]}.`);
  if (ctx.enneagram) parts.push(`Watch for your type-${ctx.enneagram.type} defence and name it when it appears.`);
  if (ctx.hasDreams) parts.push('Bring one dream from your journal this week and connect its central symbol to this pillar.');
  if (ctx.hasNightly) parts.push('Draw on at least two Nightly Inventory entries as evidence.');
  parts.push('Submit by next Friday. Your submission will be graded against the Lacanian rubric and folded into your Progress Report.');

  return {
    id: uid(),
    pillarId: pillar.id,
    assignedAt: ctx.assignedAt,
    dueAt: ctx.dueAt,
    prompt: parts.join('\n\n'),
  };
}

export function gradeHomework(pillar: PillarDef, tone: AnalysisTone, submission: string): LacanianReport {
  return generatePillarReport(pillar, tone, [submission]);
}

// ---------------------------------------------------------------------------
// NIGHTLY INVENTORY (Freudian/Lacanian, generated each night at 9pm / elder time)
// ---------------------------------------------------------------------------

const NIGHTLY_JOURNAL = [
  'Recount the moment today you least want to remember. Write it plainly.',
  'Where today did you perform a version of yourself? For whom?',
  'What did you want today that you did not admit wanting?',
  'Whose approval shaped a choice you made today?',
  'What small resentment are you carrying to bed? Trace it to its first address.',
];
const NIGHTLY_ANALYSIS = [
  'Freudian inventory: find one slip, forgetting, or “accident” from today. What wish might it have served?',
  'Lacanian inventory: pick one thing you said today. To whom was it really addressed?',
  'Locate today’s repetition — where did an old scene re-stage itself with new actors?',
  'Name one demand you made today, and the desire hiding beneath the demand.',
  'What did your body know today before you let yourself know it?',
];

export function generateNightly(date: string, opts: { age?: number; tone: AnalysisTone }): NightlyInventory {
  const seed = hashDate(date);
  const inv: NightlyInventory = {
    id: uid(),
    date,
    journalPrompt: NIGHTLY_JOURNAL[seed % NIGHTLY_JOURNAL.length],
    analysisPrompt: NIGHTLY_ANALYSIS[(seed >> 2) % NIGHTLY_ANALYSIS.length],
  };
  if (opts.age && opts.age >= 70 && opts.age <= 100) {
    const stage = LATE_LIFE_STAGES[seed % LATE_LIFE_STAGES.length];
    inv.elderGuidance = `End-of-life integration — ${stage.name}. ${stage.guidance} ${ELDER_LENSES.freudian}`;
  }
  return inv;
}

// ---------------------------------------------------------------------------
// DAILY RITUAL (unlocked only after all pillars complete)
// ---------------------------------------------------------------------------

export function generateDailyRitual(ctx: {
  tone: AnalysisTone;
  enneagram?: EnneagramResult;
  cognition?: CognitionResult;
  temperament?: TemperamentResult;
  age?: number;
  focusAreas: string[];
  date: string;
}): { checkIn: string; exercise: string } {
  const seed = hashDate(ctx.date);
  const focus = ctx.focusAreas[seed % Math.max(ctx.focusAreas.length, 1)] ?? 'your desire';
  const checkIn = `Daily check-in. On a line each: your mood, your body, the desire you notice this morning, and the defence you expect to reach for today.`;
  const parts = [`Today’s ritual is built from everything you have surfaced. Focus: ${focus}.`];
  if (ctx.cognition) parts.push(`Deliberately practise your inferior ${FUNCTION_NAMES[ctx.cognition.functionStack[3]]} once today, and note what it costs.`);
  if (ctx.enneagram) parts.push(`When your type-${ctx.enneagram.type} reflex fires, pause three breaths before acting.`);
  if (ctx.age && ctx.age >= 70 && ctx.age <= 100) parts.push(ELDER_LENSES.jungian);
  return { checkIn, exercise: parts.join(' ') };
}

// ---------------------------------------------------------------------------
// LIFE-STAGE (elder) advice for integrating younger loved ones
// ---------------------------------------------------------------------------

export function analyseLifeStageContext(tone: AnalysisTone, c: LifeStageContext): string {
  return [
    `Integrating a loved one in a different life stage (${c.loved_one_stage}, age range ${c.loved_one_age_range}).`,
    `\nLacanian: the gap between your stages is also a gap in desire — you each want from a different position in life. Their impatience and your reflection are not failures but different clocks.`,
    `\nFreudian: notice where this relationship revives an older one. “${c.feelings || '—'}” may be addressed partly to a figure from your past.`,
    `\nJungian: ${ELDER_LENSES.jungian} What you fear here — “${c.fears || '—'}” — often marks the exact place growth is asked of you.`,
    `\nA concrete step: name one expectation you can release so the relationship can meet you as you are now.`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : v == null ? '' : String(v);
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
function roman(n: number) {
  return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][n - 1] ?? String(n);
}
function hashDate(d: string) {
  let h = 0;
  for (let i = 0; i < d.length; i++) h = (h * 31 + d.charCodeAt(i)) >>> 0;
  return h;
}
function elderAddendum(tone: AnalysisTone) {
  const stage = LATE_LIFE_STAGES[0];
  return `Elder track engaged. In addition to the pillars, ${subj(tone)} will receive end-of-life integration work drawn from Jungian, Freudian, and Lacanian frames, alongside the relevant Eriksonian stage — ${stage.name} (virtue: ${stage.virtue}). ${stage.guidance}`;
}
