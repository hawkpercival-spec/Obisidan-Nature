/**
 * Erikson's psychosocial stages — only the late-life stages relevant to the
 * 70–100 elder track are surfaced.
 */
export type EriksonStage = { name: string; tension: string; virtue: string; guidance: string };

export const LATE_LIFE_STAGES: EriksonStage[] = [
  {
    name: 'Integrity vs. Despair (≈65+)',
    tension: 'Looking back on life as meaningful and one’s own, versus regret and bitterness.',
    virtue: 'Wisdom',
    guidance:
      'The work is to review your life and find it authored by you — not to erase regret, but to hold it inside a coherent story you can own.',
  },
  {
    name: 'Gerotranscendence (very late life)',
    tension:
      'A late shift from materialistic, achievement-based concerns toward acceptance, connection, and reduced fear of finitude.',
    virtue: 'Acceptance',
    guidance:
      'Attention narrows to what matters: relationships, meaning, and peace with endings. Grasping loosens; presence deepens.',
  },
];

/** A short reality-based frame for the three-lens elder work. */
export const ELDER_LENSES = {
  jungian:
    'Jung saw the second half of life as a turn inward — individuation, and a calmer relationship to mortality as part of the whole self.',
  freudian:
    'A Freudian frame attends to how earlier losses and unfinished mourning press on the present, so grief can be worked through rather than repeated.',
  lacanian:
    'A Lacanian frame asks what your life has meant as a story you told in language — and lets you re-author, rather than be authored by, that account.',
};
