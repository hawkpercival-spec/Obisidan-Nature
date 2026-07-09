/**
 * Pillar III — The Blood, The Bile, & The Nightingale.
 *
 * The medieval / Galenic four-temperaments (four-humors) model, used here as a
 * personality-and-self-regulation lens.
 *
 * GROUNDING & SAFETY: the historical "cures" (bloodletting, purging, dietary
 * cures for moods) are presented as HISTORY — they are medically discredited and
 * some are harmful, and nothing here is health advice. The genuinely useful
 * principle, the Doctrine of Opposites, is carried forward as the evidence-based
 * practice it anticipates: "opposite action" (deliberately practising the
 * counter-behaviour to a habitual excess), which supports real neuroplastic
 * change through repetition.
 */

export type HumorId = 'sanguine' | 'choleric' | 'melancholic' | 'phlegmatic';

export type Temperament = {
  id: HumorId;
  name: string; // e.g. "Sanguine"
  humor: string; // e.g. "Blood"
  element: string; // Air / Fire / Earth / Water
  season: string;
  qualities: string; // "Warm and Moist"
  glyph: string;
  strengths: string[];
  excess: string[]; // shadow / imbalance
  /** Grounded, modern self-regulation to rebalance the excess. */
  balance: string;
  /** The opposite-action target (Doctrine of Opposites → evidence-based). */
  oppositeAction: string;
  /** HISTORICAL practices for this humor (educational only, not advice). */
  historical: string;
};

export const TEMPERAMENTS: Temperament[] = [
  {
    id: 'sanguine',
    name: 'Sanguine',
    humor: 'Blood',
    element: 'Air',
    season: 'Spring',
    qualities: 'Warm and Moist',
    glyph: '🜁',
    strengths: ['social', 'enthusiastic', 'optimistic', 'outgoing', 'lively'],
    excess: ['impulsive', 'easily distracted', 'flighty'],
    balance:
      'Ground the buoyancy: single-task, build follow-through, and let one commitment finish before beginning the next.',
    oppositeAction: 'Practise stillness and sustained focus where you would usually chase the next stimulation.',
    historical:
      'An excess of blood was “treated” by bloodletting (phlebotomy), timed to lunar and seasonal calendars — the practice explored in the bedchamber game. (Historical; discredited and dangerous.)',
  },
  {
    id: 'choleric',
    name: 'Choleric',
    humor: 'Yellow Bile',
    element: 'Fire',
    season: 'Summer',
    qualities: 'Warm and Dry',
    glyph: '🜂',
    strengths: ['ambitious', 'energetic', 'confident', 'decisive', 'natural leader'],
    excess: ['aggression', 'impatience', 'domineering', 'opinionated'],
    balance: 'Cool the fire: slow the tempo, invite other voices before deciding, and separate force from leadership.',
    oppositeAction: 'Perform deliberate rituals of patience and humility where you would usually assert or push.',
    historical:
      'The “hot and dry” choleric was prescribed cooling, moistening foods — cucumber, lettuce, barley water — and sometimes purgatives to expel excess yellow bile. (Historical; not health advice.)',
  },
  {
    id: 'melancholic',
    name: 'Melancholic',
    humor: 'Black Bile',
    element: 'Earth',
    season: 'Autumn',
    qualities: 'Cold and Dry',
    glyph: '🜃',
    strengths: ['analytical', 'detail-oriented', 'deep-thinking', 'loyal', 'artistic'],
    excess: ['sadness', 'overthinking', 'paralysing fear of failure'],
    balance:
      'Warm the ground: move from rumination to small action, seek connection, and let “good enough” interrupt the search for perfect.',
    oppositeAction: 'Act before you feel ready — behavioural activation — where you would usually withdraw and analyse.',
    historical:
      'The “cold and dry” melancholic was warmed with spices (cinnamon, nutmeg), rich meats, and red wine, and sometimes purged of “stagnant black bile.” (Historical; not health advice.)',
  },
  {
    id: 'phlegmatic',
    name: 'Phlegmatic',
    humor: 'Phlegm',
    element: 'Water',
    season: 'Winter',
    qualities: 'Cold and Moist',
    glyph: '🜄',
    strengths: ['calm', 'reliable', 'thoughtful', 'peaceful', 'mediator'],
    excess: ['passivity', 'procrastination', 'resistance to change'],
    balance: 'Stir the water: introduce novelty and gentle stimulation, and start before motivation arrives.',
    oppositeAction: 'Initiate and activate where you would usually wait, defer, or keep the peace at your own expense.',
    historical:
      'The lethargic phlegmatic was “awakened” by sensory shock — loud, stimulating music and pungent herbal incense (early aromatherapy). (Historical context.)',
  },
];

export const getTemperament = (id: HumorId) => TEMPERAMENTS.find((t) => t.id === id)!;

/** The guiding principles of humoral behaviour. */
export const GUIDING_PRINCIPLES = [
  {
    title: 'Natural Inclinations',
    body: 'Temperament was seen as the foundation of character — dictating reflexes and emotional reactions, whether one was naturally introverted or extraverted, and how quickly or intensely one reacted. Mind and body were held to be deeply intertwined (a view expanded by scholars like Avicenna).',
  },
  {
    title: 'Balance and Virtue',
    body: 'The ideal was a balanced temperament. Imbalance was thought to cause both sickness and moral flaw, so growth meant mastering your inherent temperamental weakness — a choleric learning patience, a melancholic learning to act.',
  },
  {
    title: 'The Doctrine of Opposites',
    body: 'Rather than following their natural excess, people were instructed to cultivate the exact opposite behaviour to rebalance. This anticipates the modern practice of “opposite action”: repeatedly, deliberately doing the counter-behaviour reshapes a habitual response over time (neuroplasticity).',
  },
];

/** Historical balancing practices — grouped, for the educational section. */
export const HISTORICAL_PRACTICES = [
  {
    title: 'Dietary & Herbal Remedies',
    body: 'Cooling, moist foods for the “hot” choleric; warming spices and rich fare for the “cold” melancholic. Food was thought to shift the humoral balance directly.',
  },
  {
    title: 'Sensory & Environmental Rituals',
    body: 'Aromatherapy and music to shock a mood loose — loud performance and pungent incense to rouse the phlegmatic. Mystics like Hildegard of Bingen used contemplation, fasting, and silent meditation to re-centre an imbalanced mind.',
  },
  {
    title: 'Medical Interventions',
    body: 'Bloodletting for excess blood (the sanguine), and purgatives or emetics for the melancholic and choleric. Timed by lunar and seasonal calendars. These are explored — as history — in the bedchamber game.',
  },
  {
    title: 'Behavioural Modulation',
    body: 'The Doctrine of Opposites: cultivating the opposite of one’s natural tendency (a wrathful choleric practising daily humility) to rebalance the inner “fire.”',
  },
];

/** Interactive exercises + journal prompts for the pillar. */
export type HumorExercise = { id: string; title: string; exercise: string; journalPrompt: string };

export const HUMOR_EXERCISES: HumorExercise[] = [
  {
    id: 'identify',
    title: 'Know Your Humor',
    exercise: 'Which temperament fits you best right now, and which is your secondary? Name the strengths of your primary that you recognise in yourself.',
    journalPrompt: 'Where has this temperament served you well?',
  },
  {
    id: 'excess',
    title: 'Name the Excess',
    exercise: 'Every strength has a shadow. Describe a recent moment when your temperament’s excess (impulsivity, wrath, rumination, or passivity) cost you something.',
    journalPrompt: 'What did the excess protect you from feeling or doing?',
  },
  {
    id: 'opposite',
    title: 'The Doctrine of Opposites',
    exercise: 'Design one small opposite-action ritual — the deliberate counter to your excess — that you can perform daily this week (e.g. a choleric pausing three breaths before responding).',
    journalPrompt: 'What felt difficult or unnatural about acting against the grain? That difficulty is the work.',
  },
  {
    id: 'sensory',
    title: 'Sensory Rebalancing',
    exercise: 'Borrowing the medieval sense-therapy idea (grounded, not medical): choose a sound, a scent, and an environment that shift you toward balance. A phlegmatic might pick brisk music; a choleric, cool quiet.',
    journalPrompt: 'Which sensory shift most reliably changes your state, and when could you use it on purpose?',
  },
];

/** Neuroplasticity activity — the week-long opposite-action rep. */
export const NEUROPLASTICITY_ACTIVITY = {
  title: 'Rewiring the Temperament',
  body: 'Neuroplastic change comes from repetition. Pick your temperament’s single most costly excess. Each day for seven days, perform the deliberate opposite once, and log it. You are not erasing your nature — you are widening its range.',
  fields: ['The excess I’m rebalancing', 'My daily opposite action', 'Day-by-day log (what I did, how it felt)'],
};

/** Educational stations inside the 15th-century bedchamber mini-game. */
export type GameStation = { id: string; name: string; glyph: string; blurb: string; disclaimer?: string };

export const GAME_STATIONS: GameStation[] = [
  {
    id: 'chart',
    name: 'The Humoral Chart',
    glyph: '☰',
    blurb:
      'A vellum chart on the wall maps the four humors to elements, seasons, and qualities: blood/air/spring/warm-moist, yellow bile/fire/summer/warm-dry, black bile/earth/autumn/cold-dry, phlegm/water/winter/cold-moist. Physicians read a patient’s balance from pulse, urine, and complexion.',
  },
  {
    id: 'herbs',
    name: 'The Apothecary Table',
    glyph: '❦',
    blurb:
      'Cucumber and barley water to cool the choleric; cinnamon and nutmeg to warm the melancholic. Diet was believed to move the humors directly.',
  },
  {
    id: 'basin',
    name: 'The Bleeding Basin & Lancet',
    glyph: '🜋',
    blurb:
      'For excess blood, physicians opened a vein, timing the cut by lunar and seasonal calendars. Choose the “auspicious” hour on the astrological clock to see how the practice was scheduled.',
    disclaimer:
      'Historical recreation only. Bloodletting is medically discredited and dangerous. This is history — never health advice, and never something to do.',
  },
  {
    id: 'incense',
    name: 'The Censer & Lute',
    glyph: '♪',
    blurb:
      'Pungent incense and loud music to “awaken” a lethargic phlegmatic — early sensory therapy. The grounded kernel survives today as deliberate sensory regulation of mood.',
  },
  {
    id: 'window',
    name: 'The Nightingale at the Window',
    glyph: '✧',
    blurb:
      'The nightingale — sung of by mystics like Hildegard of Bingen — stands for contemplation: prayer, fasting, and silence used to re-centre an imbalanced mind. Read today as meditation and reflective practice.',
  },
];
