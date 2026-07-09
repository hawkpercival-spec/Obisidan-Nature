import { Temperament, TemperamentResult } from '@/types';

/**
 * Medieval four-temperament estimator (humoral typology).
 *
 * The four classical temperaments — sanguine (air/blood), choleric (fire/yellow
 * bile), melancholic (earth/black bile), phlegmatic (water/phlegm) — used here
 * purely as a descriptive personality lens, not as medical physiology.
 */
export type TemperamentItem = { id: string; text: string; temperament: Temperament };

export const TEMPERAMENT_ITEMS: TemperamentItem[] = [
  { id: 't1', text: 'I am lively, sociable, and quick to enthusiasm.', temperament: 'sanguine' },
  { id: 't2', text: 'I bounce back fast and rarely brood for long.', temperament: 'sanguine' },
  { id: 't3', text: 'I am driven, decisive, and impatient with obstacles.', temperament: 'choleric' },
  { id: 't4', text: 'I take command naturally and dislike indecision.', temperament: 'choleric' },
  { id: 't5', text: 'I feel things deeply and reflect on meaning and loss.', temperament: 'melancholic' },
  { id: 't6', text: 'I hold high standards and notice imperfection keenly.', temperament: 'melancholic' },
  { id: 't7', text: 'I am calm, steady, and slow to anger.', temperament: 'phlegmatic' },
  { id: 't8', text: 'I prefer harmony and avoid unnecessary conflict.', temperament: 'phlegmatic' },
];

export const TEMPERAMENT_DESC: Record<Temperament, string> = {
  sanguine: 'Air / blood — warm, expressive, sociable; works through connection and enthusiasm.',
  choleric: 'Fire / yellow bile — driven, assertive, goal-forging; works through will and command.',
  melancholic: 'Earth / black bile — deep, exacting, reflective; works through meaning and ideals.',
  phlegmatic: 'Water / phlegm — steady, calm, conciliatory; works through patience and peace.',
};

/** answers: id -> 1 (agree) .. 5 (disagree). */
export function scoreTemperament(answers: Record<string, number>): TemperamentResult {
  const scores: Record<Temperament, number> = { sanguine: 0, choleric: 0, melancholic: 0, phlegmatic: 0 };
  for (const item of TEMPERAMENT_ITEMS) {
    const raw = answers[item.id] ?? 3;
    scores[item.temperament] += 3 - raw; // agreement
  }
  const ranked = (Object.keys(scores) as Temperament[]).sort((a, b) => scores[b] - scores[a]);
  return { primary: ranked[0], secondary: ranked[1], scores };
}
