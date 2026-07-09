/**
 * Pillar I — The Self (Jungian training).
 *
 * Carl Jung viewed the Self as the central archetype — the psyche's totality and
 * the goal of wholeness, reached through Individuation: the lifelong integration
 * of conscious aspects (Ego, Persona) and unconscious aspects (Shadow,
 * Anima/Animus, the Collective Unconscious).
 *
 * Each module pairs a teaching (the concept) with an interactive exercise
 * (often Active Imagination) and a journal entry. The user works all modules and
 * then presses Submit, which runs a Jungian analysis over everything and archives
 * a comprehensive progress + analysis report (analysis/self.ts).
 *
 * Content is grounded psychology; symbols are treated as psychological, not
 * supernatural.
 */

export type SelfGroup = 'psyche' | 'technique' | 'goal';

export type SelfModule = {
  id: string;
  group: SelfGroup;
  title: string;
  /** Teaching text shown in the module card. */
  concept: string;
  /** Interactive exercise prompt (Active Imagination, mapping, dialogue…). */
  exercise: string;
  /** Journal-entry prompt. */
  journalPrompt: string;
};

export const SELF_GROUP_LABEL: Record<SelfGroup, string> = {
  psyche: 'The Self & the Psyche',
  technique: 'Methods & Techniques',
  goal: 'Goal & Approach',
};

export const SELF_MODULES: SelfModule[] = [
  // ---- Jung's views on the Self & psyche ----
  {
    id: 'self', group: 'psyche', title: 'The Self',
    concept: 'The Self is the ultimate goal — the archetype of wholeness and the regulating centre of the whole psyche, encompassing both conscious and unconscious. It is often imaged as a mandala, a circle, or a union of opposites.',
    exercise: 'Active Imagination: close your eyes and let an image of “wholeness” arise on its own. Describe it in detail — shape, colour, movement — without forcing or interpreting it.',
    journalPrompt: 'When in your life have you felt most whole — most yourself? What conditions made it possible?',
  },
  {
    id: 'ego', group: 'psyche', title: 'The Ego',
    concept: 'The Ego is the conscious centre — your sense of identity and the seat of waking will. It is essential, but only a small part of the total psyche; mistaking it for the whole is the root of one-sidedness.',
    exercise: 'List the identities you carry — complete “I am ___” ten times, quickly, without editing.',
    journalPrompt: 'Where does your sense of “I” feel too small for the whole of who you are?',
  },
  {
    id: 'persona', group: 'psyche', title: 'The Persona',
    concept: 'The Persona is the social mask — the role you play to meet the world’s expectations. It is necessary, but when you identify with it completely, the true Self is hidden even from yourself.',
    exercise: 'Name the different masks you wear — at work, with family, with strangers, online. Describe how each one behaves.',
    journalPrompt: 'Which mask is hardest to take off? What would it cost to be seen without it?',
  },
  {
    id: 'shadow', group: 'psyche', title: 'The Shadow',
    concept: 'The Shadow holds the disowned, darker, or unlived aspects — desires and flaws you refuse to see. What is not integrated is projected onto others. Wholeness requires meeting the Shadow, not defeating it.',
    exercise: 'Active Imagination: picture a figure who embodies a trait you most despise in others. Let them speak. Write the dialogue between you and them, unplanned.',
    journalPrompt: 'What did the figure want? Where does that same trait, in some form, live in you?',
  },
  {
    id: 'anima_animus', group: 'psyche', title: 'The Anima / Animus',
    concept: 'The Anima (unconscious feminine in men) and Animus (unconscious masculine in women) are the contrasexual inner figures — carriers of soul, feeling, meaning, and relatedness. Relating to them consciously brings balance.',
    exercise: 'Describe your inner contrasexual figure as an image — appearance, voice, mood. If none comes, describe the kind of person you are repeatedly drawn to.',
    journalPrompt: 'How does this figure show up in who you fall for, admire, or resent? What is it asking of you?',
  },
  {
    id: 'collective', group: 'psyche', title: 'The Collective Unconscious',
    concept: 'Beneath the personal unconscious lies a shared reservoir of universal patterns — archetypes — that shape all human experience, appearing in myth, religion, dream, and art across every culture.',
    exercise: 'Recall a myth, fairytale, or story that grips you more than it should. Retell its core in a few lines.',
    journalPrompt: 'Which universal pattern does your own life seem to repeat? Where have you lived this story?',
  },

  // ---- Methods & techniques ----
  {
    id: 'individuation', group: 'technique', title: 'Individuation',
    concept: 'Individuation is the central process — becoming a unique, whole individual by integrating all parts of the psyche and bringing unconscious elements into consciousness. It is a lifelong movement, not an achievement.',
    exercise: 'Draw a simple map (in words): which parts of you are lived consciously, and which stay in the dark? Place Ego, Persona, Shadow, and the inner figure on it.',
    journalPrompt: 'What part of yourself is asking to be brought into consciousness now?',
  },
  {
    id: 'dream_analysis', group: 'technique', title: 'Dream Analysis',
    concept: 'Jung called dreams a bridge to the unconscious. Interpreting their images, emotions, and archetypal messages uncovers conflicts and compensations the waking ego overlooks.',
    exercise: 'Record a recent dream as plainly as you can. Then list its three most charged images or symbols.',
    journalPrompt: 'What waking conflict or one-sidedness might this dream be compensating for?',
  },
  {
    id: 'active_imagination', group: 'technique', title: 'Active Imagination',
    concept: 'Active Imagination is conscious, creative engagement with unconscious imagery — through writing, art, or visualization — allowing a real dialogue with inner figures such as the Shadow, without the ego steering the outcome.',
    exercise: 'Let an inner figure appear and write a spontaneous conversation with it. Do not plan the replies — let them surprise you.',
    journalPrompt: 'What surprised you in what the figure said? What did you learn that you did not already know?',
  },
  {
    id: 'symbol_interpretation', group: 'technique', title: 'Symbol Interpretation',
    concept: 'Symbols carry meaning that concepts cannot. Reading the universal symbols and metaphors in life and dreams — not reducing them to fixed “codes” — opens their deeper significance.',
    exercise: 'Choose a symbol that keeps recurring for you (an object, animal, place). Free-associate: write every word and memory it calls up.',
    journalPrompt: 'What deeper meaning begins to emerge from those associations?',
  },
  {
    id: 'confronting_archetypes', group: 'technique', title: 'Confronting Archetypes',
    concept: 'Recognizing and integrating universal figures — the Hero, the Mother, the Trickster, the Wise Old Man — lets you relate to their energy consciously rather than being unknowingly driven by it.',
    exercise: 'Name the archetype most active in your life right now. Describe a recent situation it shaped.',
    journalPrompt: 'How does this archetype help you — and where does it possess or mislead you?',
  },
  {
    id: 'balancing_opposites', group: 'technique', title: 'Balancing Opposites',
    concept: 'Psychological health comes from holding opposites together — introversion/extraversion, thinking/feeling, light/shadow — rather than amputating one side. The tension of opposites is where the Self forms.',
    exercise: 'Name a pair of opposites alive in you (e.g. thinking vs feeling). Describe how each side behaves when it takes over.',
    journalPrompt: 'What would it look like to honour both sides at once, rather than choosing?',
  },

  // ---- Goal & approach ----
  {
    id: 'self_realization', group: 'goal', title: 'Self-Realization',
    concept: 'The goal is self-realization — a fulfilled life in which the Ego aligns with the Self, moving beyond mere habit or fear. The approach is holistic: valuing personal experience and universal pattern alike, treating life as a journey of deep self-discovery.',
    exercise: 'Describe a version of your life in which your Ego serves the Self — what you would do, refuse, and release, beyond habit and fear.',
    journalPrompt: 'One concrete move toward that alignment you can make this week.',
  },
];

export const getSelfModule = (id: string) => SELF_MODULES.find((m) => m.id === id);
