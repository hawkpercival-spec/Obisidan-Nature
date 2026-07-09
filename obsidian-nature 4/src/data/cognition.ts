import { CognitionResult, CognitionType } from '@/types';

/**
 * Jungian cognition-type estimator (four dichotomies -> 16 types).
 *
 * Each item loads on one axis; agreeing pushes toward the first pole.
 * We derive the four letters, then a canonical function stack.
 */
export type CogAxis = 'EI' | 'SN' | 'TF' | 'JP';
export type CogItem = { id: string; text: string; axis: CogAxis; poleA: string; poleB: string };

export const COGNITION_ITEMS: CogItem[] = [
  { id: 'e1', text: 'Being around people energises me more than it drains me.', axis: 'EI', poleA: 'E', poleB: 'I' },
  { id: 'e2', text: 'I do my best thinking out loud, in conversation.', axis: 'EI', poleA: 'E', poleB: 'I' },
  { id: 'e3', text: 'After a long social day I need solitude to recover.', axis: 'EI', poleA: 'I', poleB: 'E' },
  { id: 's1', text: 'I trust concrete facts more than hunches about patterns.', axis: 'SN', poleA: 'S', poleB: 'N' },
  { id: 's2', text: 'I am drawn to future possibilities and hidden meanings.', axis: 'SN', poleA: 'N', poleB: 'S' },
  { id: 's3', text: 'I notice sensory detail in the present moment.', axis: 'SN', poleA: 'S', poleB: 'N' },
  { id: 't1', text: 'I decide by logic even when it upsets people.', axis: 'TF', poleA: 'T', poleB: 'F' },
  { id: 't2', text: 'I weigh how choices affect people’s feelings first.', axis: 'TF', poleA: 'F', poleB: 'T' },
  { id: 't3', text: 'Fairness (consistent principle) matters more than harmony.', axis: 'TF', poleA: 'T', poleB: 'F' },
  { id: 'j1', text: 'I like plans settled and dislike loose ends.', axis: 'JP', poleA: 'J', poleB: 'P' },
  { id: 'j2', text: 'I prefer to keep options open and improvise.', axis: 'JP', poleA: 'P', poleB: 'J' },
  { id: 'j3', text: 'Deadlines and closure feel satisfying, not confining.', axis: 'JP', poleA: 'J', poleB: 'P' },
];

// Canonical function stacks (dominant -> inferior).
const STACKS: Record<CognitionType, string[]> = {
  INTJ: ['Ni', 'Te', 'Fi', 'Se'], INTP: ['Ti', 'Ne', 'Si', 'Fe'],
  ENTJ: ['Te', 'Ni', 'Se', 'Fi'], ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'], INFP: ['Fi', 'Ne', 'Si', 'Te'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti'], ENFP: ['Ne', 'Fi', 'Te', 'Si'],
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'], ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi'], ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'], ISFP: ['Fi', 'Se', 'Ni', 'Te'],
  ESTP: ['Se', 'Ti', 'Fe', 'Ni'], ESFP: ['Se', 'Fi', 'Te', 'Ni'],
};

/** answers: id -> 1 (agree) .. 5 (disagree) Likert. */
export function scoreCognition(answers: Record<string, number>): CognitionResult {
  const axisScore: Record<CogAxis, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  for (const item of COGNITION_ITEMS) {
    const raw = answers[item.id] ?? 3; // default neutral
    const agreement = 3 - raw; // +2 strong agree .. -2 strong disagree
    // Positive agreement pushes toward poleA.
    axisScore[item.axis] += item.poleA === firstPole(item.axis) ? agreement : -agreement;
  }
  const type = (
    (axisScore.EI >= 0 ? 'E' : 'I') +
    (axisScore.SN >= 0 ? 'S' : 'N') +
    (axisScore.TF >= 0 ? 'T' : 'F') +
    (axisScore.JP >= 0 ? 'J' : 'P')
  ) as CognitionType;

  return { type, functionStack: STACKS[type], axes: axisScore };
}

// Reference pole so sign accumulation is consistent per axis.
function firstPole(axis: CogAxis): string {
  return { EI: 'E', SN: 'S', TF: 'T', JP: 'J' }[axis];
}

export const FUNCTION_NAMES: Record<string, string> = {
  Ni: 'Introverted Intuition', Ne: 'Extraverted Intuition',
  Si: 'Introverted Sensing', Se: 'Extraverted Sensing',
  Ti: 'Introverted Thinking', Te: 'Extraverted Thinking',
  Fi: 'Introverted Feeling', Fe: 'Extraverted Feeling',
};
