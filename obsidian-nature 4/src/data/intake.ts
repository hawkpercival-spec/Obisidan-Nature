/**
 * Lacanian + Freudian intake module.
 *
 * Built from psychoanalytic self-analysis structures. Freud's self-analysis
 * relies on FREE ASSOCIATION rather than a fixed Q&A, so these prompts are
 * open-ended invitations to honest self-observation — not a checklist with
 * "correct" answers. The Lacanian sections pose the fundamental questions the
 * subject's life implicitly asks, oriented toward desire and the subject's
 * responsibility for their own speech.
 *
 * FLOW (under-70):
 *   1. This Freudian + Lacanian intake  (FREE — the "first portion")
 *   2. [PAYWALL — $5.99/month]
 *   3. Enneagram (RHETI) · Jungian cognition · Medieval temperament · Jungian archetypal
 *   4. Lacanian analysis report + curriculum
 * 70+ users skip the paywall and get all sections free.
 */

export type IntakeKind = 'text' | 'freeAssociation' | 'scale';

export type IntakeQuestion = {
  id: string;
  prompt: string;
  kind: IntakeKind;
  helper?: string;
};

export type IntakeSection = {
  id: string;
  framework: 'freudian' | 'lacanian' | 'orientation';
  title: string;
  /** Short guidance shown at the top of the section. */
  intro: string;
  questions: IntakeQuestion[];
};

/**
 * The full intake, sectioned. Presented one section at a time (see
 * IntakeFreeScreen), so the user works through it as a guided module rather
 * than one overwhelming scroll.
 */
export const INTAKE_SECTIONS: IntakeSection[] = [
  {
    id: 'orientation',
    framework: 'orientation',
    title: 'Before You Begin',
    intro:
      'This is not a test. There are no correct answers. Write freely and honestly — the aim is to produce speech you can take responsibility for, and to let what is usually unsaid come to the surface. Say more than feels comfortable.',
    questions: [
      {
        id: 'free_association',
        kind: 'freeAssociation',
        prompt:
          'Free association. Without censoring or tidying, write whatever comes — thoughts, images, feelings, fragments. Don’t make it make sense.',
        helper: 'Let it flow. Contradiction, mess, and half-thoughts are welcome — they are the material.',
      },
    ],
  },

  // ---------------------------------------------------------------- Freudian
  {
    id: 'presenting',
    framework: 'freudian',
    title: 'Presenting Concerns',
    intro: 'Begin with what is troubling you now — the pressure that brought you here.',
    questions: [
      {
        id: 'f_presenting',
        kind: 'text',
        prompt: 'What is currently troubling you? What led you to consider this work?',
      },
      {
        id: 'f_symptoms',
        kind: 'text',
        prompt:
          'What specific symptoms or behavioural patterns do you notice — for example anxiety, anger, despair, avoidance, compulsions?',
      },
    ],
  },
  {
    id: 'affect',
    framework: 'freudian',
    title: 'Affect & Emotion',
    intro: 'How you feel things, and what you do with feeling.',
    questions: [
      {
        id: 'f_affect_response',
        kind: 'text',
        prompt: 'What do you feel, think, and do when you feel anger — and when you feel despair or sadness?',
      },
      {
        id: 'f_coping',
        kind: 'text',
        prompt: 'How do you typically cope with stress or difficult emotions?',
      },
      {
        id: 'f_emotion_manage',
        kind: 'text',
        prompt: 'How do you experience and manage your emotions overall? Where do they go?',
      },
    ],
  },
  {
    id: 'history',
    framework: 'freudian',
    title: 'History & Origins',
    intro:
      'Connect the present to the past, especially early life and family. Follow the associations even if the link seems illogical.',
    questions: [
      {
        id: 'f_childhood_echo',
        kind: 'text',
        prompt:
          'When you sit with a current troubling feeling, what similar childhood experiences come to mind?',
      },
      { id: 'f_family', kind: 'text', prompt: 'What was it like growing up in your family?' },
      {
        id: 'f_parents',
        kind: 'text',
        prompt: 'What is (or was) your relationship like with your mother and with your father?',
      },
      {
        id: 'f_earliest',
        kind: 'text',
        prompt: 'What is the earliest thing you can remember about your life?',
      },
    ],
  },
  {
    id: 'conflict',
    framework: 'freudian',
    title: 'Inner Conflict & Defenses',
    intro:
      'Psychoanalysis treats inner conflict as a primary source of distress. Notice how you keep painful things at bay.',
    questions: [
      {
        id: 'f_conflict',
        kind: 'text',
        prompt: 'What inner conflicts, or opposing values, are you trying to reconcile?',
      },
      {
        id: 'f_avoidance',
        kind: 'text',
        prompt: 'How do you avoid, minimise, or disavow what is distressing in your life?',
      },
      {
        id: 'f_patterns',
        kind: 'text',
        prompt: 'What patterns are you becoming more aware of in your thoughts, feelings, and actions?',
      },
    ],
  },
  {
    id: 'relationships',
    framework: 'freudian',
    title: 'Relationships & Transference',
    intro:
      'How you relate to others often re-stages early relationships. Be candid — especially where it’s unflattering.',
    questions: [
      { id: 'f_support', kind: 'text', prompt: 'Who are the people you turn to when you need support?' },
      {
        id: 'f_power',
        kind: 'text',
        prompt: 'How do you treat people in different positions of power — those below you, and those above you?',
      },
      { id: 'f_gossip', kind: 'text', prompt: 'How do you talk about others when they are not around?' },
    ],
  },

  // ---------------------------------------------------------------- Lacanian
  {
    id: 'l_origins',
    framework: 'lacanian',
    title: 'The Question of Origins',
    intro: '“Where do I come from?” — your relationship to parents, lineage, and how you took your place in the world.',
    questions: [
      {
        id: 'l_origins',
        kind: 'text',
        prompt: 'Where do you come from? How did you come to occupy the place you hold in your family and the world?',
      },
    ],
  },
  {
    id: 'l_death',
    framework: 'lacanian',
    title: 'The Question of Death',
    intro: '“Am I alive or dead?” — your relationship to vitality, deadness, and mortality.',
    questions: [
      {
        id: 'l_death',
        kind: 'text',
        prompt: 'Where in your life do you feel most alive — and where do you feel deadened or merely going through the motions?',
      },
    ],
  },
  {
    id: 'l_meaning',
    framework: 'lacanian',
    title: 'The Question of Meaning',
    intro: '“What is the truth of my experience? What does this symptom mean?”',
    questions: [
      {
        id: 'l_meaning',
        kind: 'text',
        prompt: 'If your main symptom or recurring trouble were trying to say something, what truth might it be pointing at?',
      },
    ],
  },
  {
    id: 'l_body',
    framework: 'lacanian',
    title: 'The Question of the Body',
    intro: '“How do I experience my body — as a unified whole, or a fragmented collection of experiences?”',
    questions: [
      {
        id: 'l_body',
        kind: 'text',
        prompt: 'How do you experience your body? Whole and yours, or fragmented, at a distance, or against you?',
      },
    ],
  },
  {
    id: 'l_desire',
    framework: 'lacanian',
    title: 'The Question of Desire',
    intro: '“What do I want most?” — beneath the surface wishes, the desire that drives the rest.',
    questions: [
      {
        id: 'l_desire',
        kind: 'text',
        prompt: 'What do you want most? Look past what you should want, or what others want for you.',
      },
      {
        id: 'l_desire_scale',
        kind: 'scale',
        prompt: 'How clearly can you name your own desire, apart from the desire of others? (1 not at all – 5 very clearly)',
      },
    ],
  },
  {
    id: 'l_good',
    framework: 'lacanian',
    title: 'The Question of the Good',
    intro: '“What is my singular idea of a good life, independent of societal pressure?”',
    questions: [
      {
        id: 'l_good',
        kind: 'text',
        prompt: 'What is your own, singular idea of a good life — stripped of what you’re supposed to say?',
      },
    ],
  },
  {
    id: 'l_repetition',
    framework: 'lacanian',
    title: 'The Self as Symptom',
    intro:
      'The pivotal question. The “self” is partly a fiction assembled from images; the aim is not to defend it but to grow curious about your own part in what repeats.',
    questions: [
      {
        id: 'l_repetition',
        kind: 'freeAssociation',
        prompt:
          'Why does this — the symptom, pattern, or event — keep happening to you? What part of yourself are you involved in, beyond bad luck? Move from “why me?” to “what is my hand in this?”',
        helper: 'This is the heart of the intake. Take your time.',
      },
    ],
  },
];

/** Part 2 — Jungian archetypal-material section (favourite media), gated with the assessments. */
export const INTAKE_JUNGIAN: IntakeQuestion[] = [
  { id: 'j_movies', kind: 'text', prompt: 'Your favourite films.', helper: 'List a few — separated by commas.' },
  { id: 'j_books', kind: 'text', prompt: 'Your favourite books.' },
  { id: 'j_fairytales', kind: 'text', prompt: 'Fairytales or myths that stayed with you.' },
  { id: 'j_characters', kind: 'text', prompt: 'Characters you love — and, separately, ones you cannot stand.' },
];

/** Every question id in the Freudian/Lacanian intake, for completeness checks. */
export const ALL_INTAKE_QUESTION_IDS = INTAKE_SECTIONS.flatMap((s) => s.questions.map((q) => q.id));
