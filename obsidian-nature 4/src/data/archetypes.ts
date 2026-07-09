/**
 * Jungian archetypes for Pillar II — The Archetypal.
 *
 * Drawn from Jung's essays (The Archetypes and the Collective Unconscious,
 * Aion, Two Essays on Analytical Psychology, Symbols of Transformation, and the
 * essays on the Trickster, the Kore, the Child, and Spirit). Descriptions are
 * grounded psychological summaries — the archetypes are patterns in the psyche,
 * not supernatural entities.
 */

export type ArchetypeGroup = 'structural' | 'figure';

export type Archetype = {
  id: string;
  name: string;
  glyph: string; // decorative unicode mark for the card
  group: ArchetypeGroup;
  description: string;
  /** How this archetype shows up in its shadow / one-sided form. */
  shadow: string;
  /** Keywords used by the local pattern-recognition fallback. */
  keys: string[];
};

/** The structural archetypes — the load-bearing components of the psyche. */
const STRUCTURAL: Archetype[] = [
  {
    id: 'ego', name: 'The Ego', glyph: '☉', group: 'structural',
    description: 'The center of consciousness — your sense of “I,” the part of you that knows itself and organises waking experience.',
    shadow: 'Mistaking the ego for the whole self; inflation or rigidity that refuses the unconscious.',
    keys: ['i am', 'myself', 'in control', 'my identity', 'who i am'],
  },
  {
    id: 'persona', name: 'The Persona', glyph: '⛨', group: 'structural',
    description: 'The social mask — the adapted face you present to meet the expectations of others and the world.',
    shadow: 'Identifying so fully with the mask that the real personality is hidden even from yourself.',
    keys: ['mask', 'image', 'reputation', 'what people think', 'pretend', 'perform', 'appear'],
  },
  {
    id: 'shadow', name: 'The Shadow', glyph: '☾', group: 'structural',
    description: 'The disowned, repressed, or unlived parts of yourself — not only what is “dark,” but also unrealised potential and vitality you have exiled. Your obsidian nature.',
    shadow: 'Projection: seeing your own disowned traits in others and reacting to them with disproportionate charge.',
    keys: ['ashamed', 'hate that', 'can’t stand', 'jealous', 'envy', 'hidden', 'dark', 'i would never', 'disgust'],
  },
  {
    id: 'anima', name: 'The Anima', glyph: '☽', group: 'structural',
    description: 'In Jung’s framing, the unconscious feminine image in a man’s psyche — the carrier of Eros, feeling, relatedness, and soul. (Read today as a contrasexual/complementary inner figure in anyone.)',
    shadow: 'Moodiness, resentful sentimentality, or projecting the ideal woman onto real partners.',
    keys: ['feeling', 'longing', 'muse', 'soul', 'she', 'her', 'romance', 'moody'],
  },
  {
    id: 'animus', name: 'The Animus', glyph: '♁', group: 'structural',
    description: 'In Jung’s framing, the unconscious masculine image in a woman’s psyche — the carrier of Logos, assertion, and meaning. (Also read as a complementary inner figure in anyone.)',
    shadow: 'Rigid opinions, argumentativeness, or being ridden by unexamined “oughts.”',
    keys: ['opinion', 'principle', 'should', 'logic', 'he', 'him', 'authority', 'argue'],
  },
  {
    id: 'self', name: 'The Self', glyph: '✶', group: 'structural',
    description: 'The archetype of wholeness and the regulating center of the entire psyche — conscious and unconscious together. It is the goal of individuation, often symbolised by the circle, mandala, or a union of opposites.',
    shadow: 'Confusing ego-inflation for realisation; grasping wholeness as an achievement rather than a lifelong orientation.',
    keys: ['whole', 'meaning of my life', 'wholeness', 'centered', 'integration', 'purpose', 'unity'],
  },
];

/** Archetypal figures and images that recur in dreams, myth, and life. */
const FIGURES: Archetype[] = [
  {
    id: 'great_mother', name: 'The Great Mother', glyph: '◉', group: 'figure',
    description: 'The dual image of nurture and engulfment — life-giving, containing, and protective, yet also devouring or smothering.',
    shadow: 'The devouring mother: possessiveness, guilt-binding, refusal to let growth separate.',
    keys: ['mother', 'nurture', 'smother', 'home', 'care', 'protect', 'womb'],
  },
  {
    id: 'father', name: 'The Father', glyph: '⛭', group: 'figure',
    description: 'Order, structure, authority, and law — the principle that names, limits, and directs.',
    shadow: 'The tyrant: rigidity, domination, or an authority that crushes rather than orders.',
    keys: ['father', 'authority', 'law', 'rules', 'order', 'boss', 'discipline'],
  },
  {
    id: 'wise_old_man', name: 'The Wise Old Man (Senex / Spirit)', glyph: '☖', group: 'figure',
    description: 'The figure of meaning, guidance, and knowledge — the mentor or sage who appears when the ego is at a loss.',
    shadow: 'Cold dogma, sterile intellectualism, or advice that substitutes for lived experience.',
    keys: ['mentor', 'teacher', 'wisdom', 'guide', 'sage', 'advice', 'elder', 'wise'],
  },
  {
    id: 'divine_child', name: 'The Divine Child', glyph: '❋', group: 'figure',
    description: 'Emerging potential and futurity — vulnerable yet numinous, carrying the promise of what is not yet lived.',
    shadow: 'Escapism, helplessness, or clinging to potential to avoid the labour of becoming.',
    keys: ['child', 'new beginning', 'potential', 'innocent', 'baby', 'fresh start', 'hope'],
  },
  {
    id: 'maiden', name: 'The Maiden (Kore)', glyph: '✿', group: 'figure',
    description: 'Innocence, renewal, and the threshold of transformation — the feminine principle of new life and change.',
    shadow: 'Naïveté that refuses experience, or being defined only by others’ desire.',
    keys: ['innocence', 'maiden', 'girl', 'renewal', 'purity', 'threshold'],
  },
  {
    id: 'hero', name: 'The Hero', glyph: '⚔', group: 'figure',
    description: 'The ego’s struggle to overcome obstacles and transform — the journey, the descent, and the “slaying of the dragon” that wins new consciousness.',
    shadow: 'Hubris, endless conquest, or heroism that is really a flight from vulnerability.',
    keys: ['struggle', 'overcome', 'fight', 'journey', 'prove', 'conquer', 'achieve', 'battle'],
  },
  {
    id: 'trickster', name: 'The Trickster', glyph: '✧', group: 'figure',
    description: 'The boundary-crosser and shape-shifter — disrupts fixed order, exposes pretence, and forces unexpected change through cunning and reversal.',
    shadow: 'Malice, chaos for its own sake, self-sabotage disguised as play.',
    keys: ['joke', 'trick', 'chaos', 'rebel', 'break rules', 'mischief', 'sabotage', 'unexpected'],
  },
  {
    id: 'wounded_healer', name: 'The Wounded Healer', glyph: '☤', group: 'figure',
    description: 'The capacity to heal others through, not despite, one’s own wound — the injury that becomes a source of compassion and insight.',
    shadow: 'Over-identifying with the wound, or helping others to avoid one’s own healing.',
    keys: ['wound', 'heal', 'help others', 'pain', 'caregiver', 'therapy', 'suffering'],
  },
  {
    id: 'syzygy', name: 'The Syzygy (Divine Couple)', glyph: '⚭', group: 'figure',
    description: 'The union of opposites — anima and animus paired, the inner marriage that images psychic completeness.',
    shadow: 'Fusion that erases difference, or endless searching for a partner to complete you.',
    keys: ['union', 'partner', 'couple', 'marriage', 'complete me', 'other half', 'balance'],
  },
  {
    id: 'puer', name: 'The Puer Aeternus', glyph: '⚑', group: 'figure',
    description: 'The eternal youth — freedom, inspiration, and openness to possibility, resistant to limitation and grounding.',
    shadow: 'Refusal to commit, perpetual provisional living, flight from the ordinary.',
    keys: ['freedom', 'someday', 'keep options', 'restless', 'wander', 'commitment', 'grow up'],
  },
  {
    id: 'trickster_shadow', name: 'The Mana Personality', glyph: '⛧', group: 'figure',
    description: 'The figure of charisma and power one may inflate into after contacting the unconscious — guru, magician, or “special one.”',
    shadow: 'Inflation: mistaking a glimpse of the archetypal for personal greatness.',
    keys: ['special', 'chosen', 'power', 'charisma', 'guru', 'destiny', 'superior'],
  },
  {
    id: 'rebirth', name: 'Rebirth', glyph: '♺', group: 'figure',
    description: 'Transformation through death and return — the archetypal pattern of dissolution, renewal, and coming back changed.',
    shadow: 'Chasing dramatic “rebirths” to avoid steady change; endings without integration.',
    keys: ['reborn', 'transform', 'change', 'ending', 'let go', 'renewal', 'phoenix', 'death'],
  },
];

export const ARCHETYPES: Archetype[] = [...STRUCTURAL, ...FIGURES];

export const getArchetype = (id: string) => ARCHETYPES.find((a) => a.id === id);

/** The four movements of individuation (Pillar II’s spine). */
export type IndividuationStage = { n: number; title: string; body: string };

export const INDIVIDUATION: IndividuationStage[] = [
  {
    n: 1,
    title: 'Encountering and integrating the Shadow',
    body: 'The first labour: to meet what you have disowned — the traits you condemn in others, the impulses you deny — and to reclaim their energy without being ruled by them.',
  },
  {
    n: 2,
    title: 'Recognizing and differentiating from the Persona',
    body: 'To see the mask as a mask. Not to discard it — you need a face for the world — but to stop mistaking the role you play for who you are.',
  },
  {
    n: 3,
    title: 'Engaging with the Anima / Animus',
    body: 'To relate consciously to the contrasexual inner figure — the carrier of soul, feeling, meaning, and relatedness — rather than projecting it onto others or being possessed by its moods and opinions.',
  },
  {
    n: 4,
    title: 'Approaching the Self and wholeness',
    body: 'To orient toward the regulating center of the whole psyche — a lifelong movement, not a destination. Wholeness here means holding opposites together, not perfection.',
  },
];
