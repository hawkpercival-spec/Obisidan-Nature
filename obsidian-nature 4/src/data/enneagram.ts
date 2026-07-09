import { EnneagramResult, EnneagramType } from '@/types';

/**
 * RHETI-style forced-choice enneagram inventory (abridged, self-scored).
 *
 * The published RHETI is 144 paired statements; this is a representative
 * subset for in-app estimation. Each item pits two type-statements; the chosen
 * option scores +1 for that type. Highest total = dominant type; the higher of
 * the two adjacent types = wing.
 *
 * This estimates a type for self-reflection; it is not a substitute for the
 * official Riso-Hudson RHETI.
 */
export type RhetiItem = { id: string; a: { text: string; type: EnneagramType }; b: { text: string; type: EnneagramType } };

export const RHETI_ITEMS: RhetiItem[] = [
  { id: 'q1', a: { text: 'I have been more of an idealist who wants things to be right.', type: 1 }, b: { text: 'I have been more of a helper who wants to be needed.', type: 2 } },
  { id: 'q2', a: { text: 'I push myself to achieve and be seen as successful.', type: 3 }, b: { text: 'I retreat into my inner world to feel my feelings deeply.', type: 4 } },
  { id: 'q3', a: { text: 'I conserve my energy and observe before engaging.', type: 5 }, b: { text: 'I look for reassurance and test whether things are safe.', type: 6 } },
  { id: 'q4', a: { text: 'I keep my options open and chase what excites me.', type: 7 }, b: { text: 'I take charge and resist being controlled.', type: 8 } },
  { id: 'q5', a: { text: 'I keep the peace and avoid conflict.', type: 9 }, b: { text: 'I hold myself and others to high standards.', type: 1 } },
  { id: 'q6', a: { text: 'I give to others, sometimes at my own expense.', type: 2 }, b: { text: 'I adapt my image to win approval.', type: 3 } },
  { id: 'q7', a: { text: 'I feel different from others, uniquely marked.', type: 4 }, b: { text: 'I need privacy and time alone to recharge.', type: 5 } },
  { id: 'q8', a: { text: 'I scan for danger and plan for what could go wrong.', type: 6 }, b: { text: 'I reframe pain quickly and stay upbeat.', type: 7 } },
  { id: 'q9', a: { text: 'I confront directly and protect the vulnerable.', type: 8 }, b: { text: 'I merge with others and lose track of my own wants.', type: 9 } },
  { id: 'q10', a: { text: 'I feel a strong inner critic policing my behaviour.', type: 1 }, b: { text: 'I read what others need before they say it.', type: 2 } },
  { id: 'q11', a: { text: 'I measure my worth by accomplishment.', type: 3 }, b: { text: 'I am drawn to beauty, melancholy, and depth.', type: 4 } },
  { id: 'q12', a: { text: 'I hoard knowledge and feel safest as an expert.', type: 5 }, b: { text: 'I am loyal and struggle with doubt about who to trust.', type: 6 } },
  { id: 'q13', a: { text: 'I avoid limitation and fear missing out.', type: 7 }, b: { text: 'I assert my will and dislike appearing weak.', type: 8 } },
  { id: 'q14', a: { text: 'I go along to get along.', type: 9 }, b: { text: 'I try to improve myself and everything around me.', type: 1 } },
  { id: 'q15', a: { text: 'I want to be indispensable to the people I love.', type: 2 }, b: { text: 'I curate how I am perceived.', type: 3 } },
  { id: 'q16', a: { text: 'I long for what is missing and idealise the absent.', type: 4 }, b: { text: 'I detach to think clearly under pressure.', type: 5 } },
  { id: 'q17', a: { text: 'I seek authority to lean on, then rebel against it.', type: 6 }, b: { text: 'I stay busy so I never have to sit with pain.', type: 7 } },
  { id: 'q18', a: { text: 'I would rather be in control than be controlled.', type: 8 }, b: { text: 'I numb my priorities to keep everyone comfortable.', type: 9 } },
];

const TYPE_NAMES: Record<EnneagramType, string> = {
  1: 'The Reformer',
  2: 'The Helper',
  3: 'The Achiever',
  4: 'The Individualist',
  5: 'The Investigator',
  6: 'The Loyalist',
  7: 'The Enthusiast',
  8: 'The Challenger',
  9: 'The Peacemaker',
};

export const enneagramName = (t: EnneagramType) => TYPE_NAMES[t];

export function scoreEnneagram(choices: Record<string, 'a' | 'b'>): EnneagramResult {
  const scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 } as Record<EnneagramType, number>;
  for (const item of RHETI_ITEMS) {
    const pick = choices[item.id];
    if (pick === 'a') scores[item.a.type] += 1;
    else if (pick === 'b') scores[item.b.type] += 1;
  }
  const type = (Object.keys(scores) as unknown as EnneagramType[]).reduce((best, t) =>
    scores[t] > scores[best] ? t : best,
  1 as EnneagramType);

  // wing = higher-scoring adjacent type
  const left = (((type + 7) % 9) + 1) as EnneagramType; // type-1
  const right = ((type % 9) + 1) as EnneagramType; // type+1
  const wing = scores[left] >= scores[right] ? left : right;

  return { type, wing, scores };
}
