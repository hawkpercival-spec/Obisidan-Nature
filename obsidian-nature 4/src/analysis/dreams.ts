import { AnalysisTone, DreamAnalysis, DreamEntry } from '@/types';

/**
 * Jungian dream analysis, structured for the analysand to take into session.
 *
 * Jung read dreams as dramas with a structure borrowed from classical theatre:
 *   - Exposition  (setting, cast, initial situation)
 *   - Peripeteia  (development / complication)
 *   - Lysis       (resolution or the point where it breaks off)
 * We surface these stages, highlight key fragments, and amplify recurring
 * symbols — without asserting any fixed, universal "meaning". The point is to
 * give the user working material for their analyst, not a verdict.
 */

const SYMBOL_HINTS: [RegExp, string][] = [
  [/water|sea|ocean|river|flood/i, 'Water often figures the unconscious itself — depth, feeling, the not-yet-known.'],
  [/house|room|building/i, 'A house frequently images the psyche; note which rooms are open, locked, or unknown.'],
  [/dead|death|die|grave/i, 'Death in dreams commonly marks transformation or an ending sought or feared, not literal death.'],
  [/chase|chased|running|pursued/i, 'Being pursued can figure a disowned part (the shadow) seeking acknowledgement.'],
  [/child|baby/i, 'The child can figure the vulnerable or the not-yet-lived potential (the divine child motif).'],
  [/animal|dog|snake|wolf|bird/i, 'Animals often carry instinctual or shadow energies; the specific animal matters.'],
  [/father|mother|parent/i, 'Parental figures may point to internalised authority or the parental imago rather than the real person.'],
  [/fall|falling/i, 'Falling can figure loss of control or a needed descent from an over-inflated position.'],
  [/door|gate|threshold/i, 'Thresholds mark transitions — a decision or passage the psyche is approaching.'],
  [/fire|burning/i, 'Fire can figure transformation, anger, or purgation, depending on its felt tone.'],
];

export function analyseDream(entry: DreamEntry, tone: AnalysisTone): DreamAnalysis {
  const text = `${entry.raw} ${entry.exposition} ${entry.peripeteia} ${entry.lysis}`.trim();

  const symbols = SYMBOL_HINTS.filter(([re]) => re.test(text)).map(([re, amp]) => ({
    symbol: (text.match(re)?.[0] ?? '').toLowerCase(),
    amplification: amp,
  }));

  const highlights = pickHighlights(text);

  const stageMap = {
    exposition:
      entry.exposition ||
      'Where does the dream open? Note the setting, who is present, and the mood before anything happens.',
    development:
      entry.peripeteia ||
      'What complicates or shifts? The turn usually carries the dream’s charge.',
    lysis:
      entry.lysis ||
      'How does it resolve — or break off? An unresolved lysis is itself information: the psyche has not yet found the ending.',
  };

  const opener =
    tone === 'clinician'
      ? 'Dream material prepared for the treating analyst. Offered as associations to open in session, not as interpretation.'
      : 'Your dream, structured for work with your analyst. These are openings, not answers — take them into session.';

  const summary = [
    opener,
    `\nCentral movement: the dream travels from “${firstClause(stageMap.exposition)}” toward “${firstClause(stageMap.lysis)}”.`,
    symbols.length
      ? `\nSymbols to amplify with your analyst: ${symbols.map((s) => s.symbol).filter(Boolean).join(', ')}.`
      : '\nNo stock symbols detected; work instead from your own associations to each image.',
    '\nBring your personal associations to each highlighted fragment — what does each image call up in your own life?',
  ].join('\n');

  return { tone, highlights, symbols, stageMap, summary };
}

function pickHighlights(text: string) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
  // Prefer sentences containing affect or a stock symbol.
  const scored = sentences.map((s) => ({
    fragment: s,
    score:
      (/(felt|afraid|scared|angry|sad|joy|shame|panic)/i.test(s) ? 2 : 0) +
      (SYMBOL_HINTS.some(([re]) => re.test(s)) ? 1 : 0),
  }));
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((h) => ({ fragment: h.fragment, note: 'Sit with this fragment; what personal memory does it touch?' }));
}

function firstClause(s: string) {
  return s.split(/[,.]/)[0].slice(0, 80);
}
