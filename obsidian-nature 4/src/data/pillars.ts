import { SigilName } from '@/components/Sigil';

/**
 * The Percivalian Way — The Seven Pillars.
 *
 * A patient-facing, self-analysis arc that moves through the three Lacanian
 * registers (Imaginary, Symbolic, Real), the Freudian mechanisms of repetition
 * and drive, and a Jungian archetypal descent, closing on integration.
 *
 * NOTE on framing: the "nigromancy codex" is aesthetic only. All exercise
 * content is grounded psychological work — no supernatural claims, no mysticism
 * presented as literal reality. "Obsidian nature" = the shadow aspects of
 * personality, cognition, and behavior (a metaphor, not a metaphysics).
 */

export type PillarDef = {
  id: number;
  name: string;
  subtitle: string;
  register: 'Imaginary' | 'Symbolic' | 'Real' | 'Freudian' | 'Jungian' | 'Integration';
  sigil: SigilName;
  summary: string;
  coreConcepts: string[];
  /** Exercise templates; the engine personalises these against intake results. */
  exerciseSeeds: string[];
};

export const PILLARS: PillarDef[] = [
  {
    id: 1,
    name: 'The Self',
    subtitle: 'Jungian training — the central archetype, individuation, and the journey to wholeness',
    register: 'Jungian',
    sigil: 'seal',
    summary:
      'The Self is the psyche’s totality and the goal of wholeness, reached through individuation — integrating Ego, Persona, Shadow, Anima/Animus, and the collective unconscious.',
    coreConcepts: ['the Self', 'individuation', 'Ego · Persona · Shadow · Anima/Animus', 'collective unconscious'],
    exerciseSeeds: [
      'Active Imagination: let an image of wholeness arise, and describe it without forcing it.',
      'Meet a figure who embodies a trait you despise, and let it speak (the Shadow).',
    ],
  },
  {
    id: 2,
    name: 'The Archetypal',
    subtitle:
      'Universal patterns in the collective unconscious — archetypes, individuation, and the journey toward wholeness',
    register: 'Jungian',
    sigil: 'archetype',
    summary:
      'Discover which archetypes are active in your psyche. Engage the Jungian archetypes, the process of individuation, and the movement toward the Self.',
    coreConcepts: ['collective unconscious', 'archetype', 'individuation', 'Shadow · Persona · Anima/Animus · Self'],
    exerciseSeeds: [
      'Reflect on a recurring life pattern. Which archetype is staging it?',
      'Name the trait you most despise in others — then find where it lives in you (the Shadow).',
    ],
  },
  {
    id: 3,
    name: 'The Blood, The Bile, & The Nightingale',
    subtitle: 'The four temperaments — mastering your natural excess through the Doctrine of Opposites',
    register: 'Jungian',
    sigil: 'dagger',
    summary:
      'The medieval four humors as a self-regulation lens. Know your temperament (sanguine, choleric, melancholic, phlegmatic), name its excess, and rebalance it through opposite-action practice.',
    coreConcepts: ['four temperaments', 'the Doctrine of Opposites', 'opposite action', 'neuroplasticity'],
    exerciseSeeds: [
      'Which temperament leads in you — and what is its costly excess?',
      'Design one daily opposite-action ritual to rebalance that excess.',
    ],
  },
  {
    id: 4,
    name: 'Desire & Lack',
    subtitle: 'The barred subject and objet petit a',
    register: 'Symbolic',
    sigil: 'lack',
    summary:
      'Desire is structured by lack, not deprivation. You study what you chase, and how the chasing organises you.',
    coreConcepts: ['objet petit a', 'the barred subject ($)', 'desire of the Other', 'fantasy'],
    exerciseSeeds: [
      'Name a thing you were sure would complete you. What happened after you got it?',
      'Complete honestly: "If they really knew me, they would…". Sit with the sentence.',
    ],
  },
  {
    id: 5,
    name: 'The Name',
    subtitle: 'The Symbolic — language, law, and the Other',
    register: 'Symbolic',
    sigil: 'threshold',
    summary:
      'The register of speech, kinship, and the demands of the Other. You trace the signifiers that were placed on you before you could refuse them.',
    coreConcepts: ['the big Other', 'signifier / signified', 'Name-of-the-Father', 'symbolic debt'],
    exerciseSeeds: [
      'List the words your family used to name you (roles, labels, expectations). Which still speak through you?',
      'Whose voice do you hear when you judge yourself? Write what it says, verbatim.',
    ],
  },
  {
    id: 6,
    name: 'Repetition & the Drive',
    subtitle: 'The Freudian compulsion to repeat',
    register: 'Freudian',
    sigil: 'dream',
    summary:
      'Why the same scene recurs with new actors. You map the pattern you re-stage and the satisfaction hidden inside the suffering.',
    coreConcepts: ['repetition compulsion', 'drive', 'jouissance', 'transference'],
    exerciseSeeds: [
      'Chart three relationships (any kind) that ended the same way. Name the role you always play.',
      'What discomfort do you protect as if it were precious? Why might you keep it?',
    ],
  },
  {
    id: 7,
    name: 'The Sinthome',
    subtitle: 'Integration — assuming your symptom',
    register: 'Integration',
    sigil: 'seal',
    summary:
      'Not cure but authorship: taking responsibility for your particular knot. You decide how to carry what cannot be removed.',
    coreConcepts: ['sinthome', 'subjective responsibility', 'the act', 'individuation'],
    exerciseSeeds: [
      'Write the single sentence that has been true across every pillar so far.',
      'Given all you cannot change, what will you now choose to do differently — concretely, this week?',
    ],
  },
];

export const getPillar = (id: number) => PILLARS.find((p) => p.id === id)!;

/** The 365-day arc is sliced evenly across the seven pillars. */
export const DAYS_PER_PILLAR = Math.round(365 / PILLARS.length); // ~52 days each
