import { AnalysisTone, BedchamberResult, LacanianReport, PillarGrade, TemperamentResult } from '@/types';
import { TEMPERAMENTS, getTemperament, HumorId } from '@/data/fourHumors';

/**
 * Pillar III — "The Blood, The Bile, & The Nightingale" comprehensive analysis.
 *
 * Reads the user's exercise + journal entries (and their intake temperament
 * result, if available) and writes a progress report on rebalancing the
 * temperamental excess via the Doctrine of Opposites. Offline generator;
 * analysis/remote.ts → analyzeTemperamentPillar uses the LLM when configured.
 */

export type HumorEntry = { id: string; title: string; exercise: string; journal: string };

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function grade(entries: HumorEntry[]): PillarGrade {
  const filled = entries.filter((e) => (e.exercise + e.journal).trim().length > 0).length;
  const coverage = filled / Math.max(entries.length, 1);
  const words = entries.reduce((n, e) => n + (e.exercise + ' ' + e.journal).trim().split(/\s+/).filter(Boolean).length, 0);
  const depth = ['i felt', 'i noticed', 'opposite', 'patience', 'i acted', 'difficult', 'habit', 'i usually']
    .reduce((n, m) => n + (entries.map((e) => e.exercise + ' ' + e.journal).join(' ').toLowerCase().includes(m) ? 1 : 0), 0);

  const awareness = clamp(45 + coverage * 40 + words / 14);
  const practice = clamp(35 + depth * 6 + coverage * 20); // opposite-action engagement
  const balance = clamp(30 + coverage * 35 + depth * 3);

  const avg = (awareness + practice + balance) / 3;
  const letter: PillarGrade['letter'] =
    coverage < 0.5 ? 'Incomplete' : avg >= 82 ? 'A' : avg >= 68 ? 'B' : avg >= 52 ? 'C' : 'D';
  const commentary =
    letter === 'Incomplete'
      ? 'Not enough of the work is recorded yet. Complete more exercises and the opposite-action log before the analysis can form.'
      : practice < 55
        ? 'You can name the temperament and its excess well; the deliberate opposite-action practice is where the change actually happens — lean into it.'
        : 'Clear awareness and real practice against the grain. This is how a temperament widens its range.';
  return { letter, registers: { imaginary: balance, symbolic: awareness, real: practice }, commentary };
}

export function generateTemperamentPillarReport(
  tone: AnalysisTone,
  entries: HumorEntry[],
  intakeTemperament?: TemperamentResult,
  game?: BedchamberResult,
): LacanianReport {
  const you = tone === 'clinician' ? 'the analysand' : 'you';
  const g = grade(entries);
  const get = (id: string) => entries.find((e) => e.id === id);

  const primary: HumorId | undefined = intakeTemperament?.primary as HumorId | undefined;
  const t = primary ? getTemperament(primary) : undefined;

  const opener =
    tone === 'clinician'
      ? 'Progress note for the treating analyst on Pillar III (the four temperaments). Offered as case material.'
      : 'A reading of your work in Pillar III — The Blood, The Bile, & The Nightingale.';

  const lines: string[] = [opener];

  if (t) {
    lines.push(
      `\nTemperament. ${cap(you)} lead${tone === 'clinician' ? 's' : ''} with the ${t.name} humor (${t.humor} · ${t.element} · ${t.qualities}). Its gifts — ${t.strengths.join(', ')} — are real; its excess — ${t.excess.join(', ')} — is the growth edge.`,
    );
  } else {
    lines.push(`\nTemperament. From the work, ${you} identif${tone === 'clinician' ? 'ies' : 'y'} the humor most alive: “${short(get('identify')?.exercise)}”.`);
  }

  lines.push(`\nThe excess, seen. ${cap(you)} named a cost of the excess: “${short(get('excess')?.exercise)}” — and what it protects: “${short(get('excess')?.journal)}”. Naming the secondary gain is what makes rebalancing possible.`);

  lines.push(`\nThe Doctrine of Opposites. The opposite-action ritual ${you} designed — “${short(get('opposite')?.exercise)}” — is the heart of this pillar. What felt unnatural about it (“${short(get('opposite')?.journal)}”) is precisely the neural groove being widened.`);

  lines.push(`\nSensory rebalancing. ${cap(you)} chose sensory shifts toward balance: “${short(get('sensory')?.exercise)}”. Used deliberately, these become a reliable lever on state.`);

  if (game) {
    lines.push(
      `\nThe bedchamber (projective). ${cap(you)} chose to practise as a ${game.roleName}${game.top.length ? `, and treated the patient with a leaning toward ${game.top.join(' and ')}` : ''}. ${game.profile} Which role ${you} identif${tone === 'clinician' ? 'ies' : 'y'} with under pressure — the learned, distancing Physic or the exposed, proximate Plague Doctor — and which instruments ${you} reach${tone === 'clinician' ? 'es' : ''} for, read alongside the temperament: they show how the excess behaves when the stakes are real.`,
    );
    if (game.resonantQuotes?.length) {
      const q = game.resonantQuotes
        .map((r) => `for the ${r.tool.toLowerCase()}, “${r.quote}” (${r.play})`)
        .join('; ');
      lines.push(
        `\nThe lines that resonated. Offered a choice of Shakespeare for each instrument, ${you} felt drawn to: ${q}. The line a person chooses is rarely accidental — it names, in borrowed words, what they could not yet say plainly. Read these resonances as further material for the work.`,
      );
    }
  }

  lines.push(`\nProgress. Awareness ${g.registers.symbolic}, opposite-action practice ${g.registers.real}, felt balance ${g.registers.imaginary}. ${g.commentary}`);
  lines.push(`\nThis analysis is archived and combines into your full Pillar III report when every section is complete.`);

  return {
    id: uid(),
    createdAt: Date.now(),
    tone,
    title: 'Pillar III — The Blood, The Bile, & The Nightingale · Analysis',
    narrative: lines.join('\n'),
    focusAreas: [
      t ? `rebalance the ${t.name} excess: ${t.oppositeAction}` : 'practise the deliberate opposite of your habitual excess',
      'use sensory regulation on purpose, not by accident',
      'repeat the opposite action daily — range comes from repetition',
      ...(game && game.top.length ? [`notice how ${game.top.join(' and ')} showed up in the bedchamber — is that your pattern under pressure?`] : []),
    ],
    grade: g,
    pillarId: 3,
  };
}

/* helpers */
function short(v?: string) {
  const s = (v ?? '').trim();
  return !s ? '—' : s.length > 120 ? `${s.slice(0, 117)}…` : s;
}
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

// Keep the full temperament list importable for callers that want the labels.
export { TEMPERAMENTS };
