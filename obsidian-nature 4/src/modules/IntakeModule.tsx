/**
 * Obsidian Nature — Intake Module (self-contained, single file).
 *
 * A portable version of the whole intake flow, dependency-light (react +
 * react-native only) so it can be dropped into any screen or reused/reviewed as
 * one unit. The app also ships a navigation-wired version split across
 * src/data/intake.ts and src/screens/intake/*; this file consolidates the same
 * flow behind one component:
 *
 *   <IntakeModule
 *     paid={hasAccess}                 // under-70 unlock (assessments gated)
 *     age={userAge}                    // elder branching happens upstream
 *     onRequirePayment={() => ...}     // called when a locked section is reached
 *     generateReport={remoteFn}        // optional async LLM report; falls back to local
 *     onComplete={(result) => ...}     // full intake payload + generated report
 *   />
 *
 * Flow: Freudian + Lacanian sections (free) → [paywall for under-70] →
 * Enneagram (RHETI) → Jungian cognition → Medieval temperament → Jungian
 * archetypal material → Freudian & Lacanian analysis report.
 *
 * Content is grounded psychology; the occult framing is metaphor only.
 */
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

/* ------------------------------------------------------------------ theme */
const C = {
  void: '#05070B',
  obsidian: '#0B0F17',
  ash: '#1A2230',
  ember: '#FF2A3A',
  dagger: '#B3121E',
  gold: '#D9A741',
  aero: '#33D6E0',
  bone: '#EDE9DD',
  parch: '#C8C2B0',
  muted: '#8B93A3',
  faint: '#5A6272',
  stroke: 'rgba(180,220,230,0.22)',
  glass: 'rgba(210,235,240,0.06)',
};

/* ------------------------------------------------------------------ types */
export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CognitionType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';
export type Temperament = 'sanguine' | 'choleric' | 'melancholic' | 'phlegmatic';

export type IntakeResult = {
  answers: Record<string, string | number>;
  workingWithAnalyst: boolean;
  enneagram?: { type: EnneagramType; wing: EnneagramType; scores: Record<EnneagramType, number> };
  cognition?: { type: CognitionType; functionStack: string[] };
  temperament?: { primary: Temperament; secondary: Temperament; scores: Record<Temperament, number> };
  archetypal?: { movies: string; books: string; fairytales: string; characters: string };
  report: string;
};

type QKind = 'text' | 'freeAssociation' | 'scale';
type Question = { id: string; prompt: string; kind: QKind; helper?: string };
type Section = { id: string; framework: 'orientation' | 'freudian' | 'lacanian'; title: string; intro: string; questions: Question[] };

/* --------------------------------------------- data: Freudian + Lacanian */
const SECTIONS: Section[] = [
  {
    id: 'orientation', framework: 'orientation', title: 'Before You Begin',
    intro: 'This is not a test — there are no correct answers. Write freely and honestly. The aim is to produce speech you can take responsibility for, and to let what is usually unsaid surface.',
    questions: [
      { id: 'free_association', kind: 'freeAssociation', prompt: 'Free association. Without censoring or tidying, write whatever comes — thoughts, images, feelings, fragments. Don’t make it make sense.', helper: 'Contradiction and half-thoughts are welcome — they are the material.' },
    ],
  },
  {
    id: 'presenting', framework: 'freudian', title: 'Presenting Concerns',
    intro: 'Begin with what is troubling you now — the pressure that brought you here.',
    questions: [
      { id: 'f_presenting', kind: 'text', prompt: 'What is currently troubling you? What led you to consider this work?' },
      { id: 'f_symptoms', kind: 'text', prompt: 'What specific symptoms or behavioural patterns do you notice — anxiety, anger, despair, avoidance, compulsions?' },
    ],
  },
  {
    id: 'affect', framework: 'freudian', title: 'Affect & Emotion',
    intro: 'How you feel things, and what you do with feeling.',
    questions: [
      { id: 'f_affect_response', kind: 'text', prompt: 'What do you feel, think, and do when you feel anger — and when you feel despair or sadness?' },
      { id: 'f_coping', kind: 'text', prompt: 'How do you typically cope with stress or difficult emotions?' },
      { id: 'f_emotion_manage', kind: 'text', prompt: 'How do you experience and manage your emotions overall? Where do they go?' },
    ],
  },
  {
    id: 'history', framework: 'freudian', title: 'History & Origins',
    intro: 'Connect the present to the past, especially early life and family. Follow associations even if the link seems illogical.',
    questions: [
      { id: 'f_childhood_echo', kind: 'text', prompt: 'When you sit with a current troubling feeling, what similar childhood experiences come to mind?' },
      { id: 'f_family', kind: 'text', prompt: 'What was it like growing up in your family?' },
      { id: 'f_parents', kind: 'text', prompt: 'What is (or was) your relationship like with your mother and with your father?' },
      { id: 'f_earliest', kind: 'text', prompt: 'What is the earliest thing you can remember about your life?' },
    ],
  },
  {
    id: 'conflict', framework: 'freudian', title: 'Inner Conflict & Defenses',
    intro: 'Inner conflict is treated as a primary source of distress. Notice how you keep painful things at bay.',
    questions: [
      { id: 'f_conflict', kind: 'text', prompt: 'What inner conflicts, or opposing values, are you trying to reconcile?' },
      { id: 'f_avoidance', kind: 'text', prompt: 'How do you avoid, minimise, or disavow what is distressing in your life?' },
      { id: 'f_patterns', kind: 'text', prompt: 'What patterns are you becoming more aware of in your thoughts, feelings, and actions?' },
    ],
  },
  {
    id: 'relationships', framework: 'freudian', title: 'Relationships & Transference',
    intro: 'How you relate to others often re-stages early relationships. Be candid — especially where it’s unflattering.',
    questions: [
      { id: 'f_support', kind: 'text', prompt: 'Who are the people you turn to when you need support?' },
      { id: 'f_power', kind: 'text', prompt: 'How do you treat people in different positions of power — those below you, and those above you?' },
      { id: 'f_gossip', kind: 'text', prompt: 'How do you talk about others when they are not around?' },
    ],
  },
  { id: 'l_origins', framework: 'lacanian', title: 'The Question of Origins', intro: '“Where do I come from?” — your relationship to parents, lineage, and how you took your place in the world.', questions: [{ id: 'l_origins', kind: 'text', prompt: 'Where do you come from? How did you come to occupy the place you hold in your family and the world?' }] },
  { id: 'l_death', framework: 'lacanian', title: 'The Question of Death', intro: '“Am I alive or dead?” — your relationship to vitality, deadness, and mortality.', questions: [{ id: 'l_death', kind: 'text', prompt: 'Where in your life do you feel most alive — and where do you feel deadened, or merely going through the motions?' }] },
  { id: 'l_meaning', framework: 'lacanian', title: 'The Question of Meaning', intro: '“What is the truth of my experience? What does this symptom mean?”', questions: [{ id: 'l_meaning', kind: 'text', prompt: 'If your main symptom or recurring trouble were trying to say something, what truth might it be pointing at?' }] },
  { id: 'l_body', framework: 'lacanian', title: 'The Question of the Body', intro: '“How do I experience my body — as a unified whole, or a fragmented collection of experiences?”', questions: [{ id: 'l_body', kind: 'text', prompt: 'How do you experience your body? Whole and yours, or fragmented, at a distance, or against you?' }] },
  {
    id: 'l_desire', framework: 'lacanian', title: 'The Question of Desire', intro: '“What do I want most?” — beneath the surface wishes, the desire that drives the rest.',
    questions: [
      { id: 'l_desire', kind: 'text', prompt: 'What do you want most? Look past what you should want, or what others want for you.' },
      { id: 'l_desire_scale', kind: 'scale', prompt: 'How clearly can you name your own desire, apart from the desire of others? (1 not at all – 5 very clearly)' },
    ],
  },
  { id: 'l_good', framework: 'lacanian', title: 'The Question of the Good', intro: '“What is my singular idea of a good life, independent of societal pressure?”', questions: [{ id: 'l_good', kind: 'text', prompt: 'What is your own, singular idea of a good life — stripped of what you’re supposed to say?' }] },
  {
    id: 'l_repetition', framework: 'lacanian', title: 'The Self as Symptom',
    intro: 'The pivotal question. The “self” is partly a fiction assembled from images; the aim is not to defend it but to grow curious about your own part in what repeats.',
    questions: [{ id: 'l_repetition', kind: 'freeAssociation', prompt: 'Why does this — the symptom, pattern, or event — keep happening to you? What part of yourself are you involved in, beyond bad luck? Move from “why me?” to “what is my hand in this?”', helper: 'This is the heart of the intake. Take your time.' }],
  },
];

/* --------------------------------------------- data: assessments (abridged) */
type Rheti = { id: string; a: { text: string; type: EnneagramType }; b: { text: string; type: EnneagramType } };
const RHETI: Rheti[] = [
  { id: 'q1', a: { text: 'I’ve been more of an idealist who wants things to be right.', type: 1 }, b: { text: 'I’ve been more of a helper who wants to be needed.', type: 2 } },
  { id: 'q2', a: { text: 'I push to achieve and be seen as successful.', type: 3 }, b: { text: 'I retreat inward to feel my feelings deeply.', type: 4 } },
  { id: 'q3', a: { text: 'I conserve energy and observe before engaging.', type: 5 }, b: { text: 'I look for reassurance and test whether things are safe.', type: 6 } },
  { id: 'q4', a: { text: 'I keep my options open and chase what excites me.', type: 7 }, b: { text: 'I take charge and resist being controlled.', type: 8 } },
  { id: 'q5', a: { text: 'I keep the peace and avoid conflict.', type: 9 }, b: { text: 'I hold myself and others to high standards.', type: 1 } },
  { id: 'q6', a: { text: 'I give to others, sometimes at my own expense.', type: 2 }, b: { text: 'I adapt my image to win approval.', type: 3 } },
  { id: 'q7', a: { text: 'I feel uniquely different from others.', type: 4 }, b: { text: 'I need privacy and time alone to recharge.', type: 5 } },
  { id: 'q8', a: { text: 'I scan for danger and plan for what could go wrong.', type: 6 }, b: { text: 'I reframe pain quickly and stay upbeat.', type: 7 } },
  { id: 'q9', a: { text: 'I confront directly and protect the vulnerable.', type: 8 }, b: { text: 'I merge with others and lose track of my own wants.', type: 9 } },
  { id: 'q10', a: { text: 'A strong inner critic polices my behaviour.', type: 1 }, b: { text: 'I read what others need before they say it.', type: 2 } },
  { id: 'q11', a: { text: 'I measure my worth by accomplishment.', type: 3 }, b: { text: 'I’m drawn to beauty, melancholy, and depth.', type: 4 } },
  { id: 'q12', a: { text: 'I feel safest as an expert who has mastered a domain.', type: 5 }, b: { text: 'I’m loyal but wrestle with doubt about who to trust.', type: 6 } },
  { id: 'q13', a: { text: 'I avoid limitation and fear missing out.', type: 7 }, b: { text: 'I assert my will and dislike appearing weak.', type: 8 } },
  { id: 'q14', a: { text: 'I go along to get along.', type: 9 }, b: { text: 'I try to improve myself and everything around me.', type: 1 } },
];
const ENNEA_NAME: Record<EnneagramType, string> = { 1: 'The Reformer', 2: 'The Helper', 3: 'The Achiever', 4: 'The Individualist', 5: 'The Investigator', 6: 'The Loyalist', 7: 'The Enthusiast', 8: 'The Challenger', 9: 'The Peacemaker' };

type Axis = 'EI' | 'SN' | 'TF' | 'JP';
type CogItem = { id: string; text: string; axis: Axis; poleA: string };
const COG: CogItem[] = [
  { id: 'e1', text: 'Being around people energises me more than it drains me.', axis: 'EI', poleA: 'E' },
  { id: 'e2', text: 'I do my best thinking out loud, in conversation.', axis: 'EI', poleA: 'E' },
  { id: 'e3', text: 'After a long social day I need solitude to recover.', axis: 'EI', poleA: 'I' },
  { id: 's1', text: 'I trust concrete facts more than hunches about patterns.', axis: 'SN', poleA: 'S' },
  { id: 's2', text: 'I’m drawn to future possibilities and hidden meanings.', axis: 'SN', poleA: 'N' },
  { id: 's3', text: 'I notice sensory detail in the present moment.', axis: 'SN', poleA: 'S' },
  { id: 't1', text: 'I decide by logic even when it upsets people.', axis: 'TF', poleA: 'T' },
  { id: 't2', text: 'I weigh how choices affect people’s feelings first.', axis: 'TF', poleA: 'F' },
  { id: 'j1', text: 'I like plans settled and dislike loose ends.', axis: 'JP', poleA: 'J' },
  { id: 'j2', text: 'I prefer to keep options open and improvise.', axis: 'JP', poleA: 'P' },
];
const STACKS: Record<CognitionType, string[]> = {
  INTJ: ['Ni', 'Te', 'Fi', 'Se'], INTP: ['Ti', 'Ne', 'Si', 'Fe'], ENTJ: ['Te', 'Ni', 'Se', 'Fi'], ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'], INFP: ['Fi', 'Ne', 'Si', 'Te'], ENFJ: ['Fe', 'Ni', 'Se', 'Ti'], ENFP: ['Ne', 'Fi', 'Te', 'Si'],
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'], ISFJ: ['Si', 'Fe', 'Ti', 'Ne'], ESTJ: ['Te', 'Si', 'Ne', 'Fi'], ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'], ISFP: ['Fi', 'Se', 'Ni', 'Te'], ESTP: ['Se', 'Ti', 'Fe', 'Ni'], ESFP: ['Se', 'Fi', 'Te', 'Ni'],
};
const FN: Record<string, string> = { Ni: 'Introverted Intuition', Ne: 'Extraverted Intuition', Si: 'Introverted Sensing', Se: 'Extraverted Sensing', Ti: 'Introverted Thinking', Te: 'Extraverted Thinking', Fi: 'Introverted Feeling', Fe: 'Extraverted Feeling' };

type TempItem = { id: string; text: string; t: Temperament };
const TEMP: TempItem[] = [
  { id: 'p1', text: 'I’m lively, sociable, and quick to enthusiasm.', t: 'sanguine' },
  { id: 'p2', text: 'I bounce back fast and rarely brood for long.', t: 'sanguine' },
  { id: 'p3', text: 'I’m driven, decisive, and impatient with obstacles.', t: 'choleric' },
  { id: 'p4', text: 'I take command naturally and dislike indecision.', t: 'choleric' },
  { id: 'p5', text: 'I feel deeply and reflect on meaning and loss.', t: 'melancholic' },
  { id: 'p6', text: 'I hold high standards and notice imperfection keenly.', t: 'melancholic' },
  { id: 'p7', text: 'I’m calm, steady, and slow to anger.', t: 'phlegmatic' },
  { id: 'p8', text: 'I prefer harmony and avoid unnecessary conflict.', t: 'phlegmatic' },
];
const TEMP_DESC: Record<Temperament, string> = {
  sanguine: 'air/blood — warm, expressive, sociable', choleric: 'fire/yellow bile — driven, assertive, goal-forging',
  melancholic: 'earth/black bile — deep, exacting, reflective', phlegmatic: 'water/phlegm — steady, calm, conciliatory',
};

const JUNGIAN: Question[] = [
  { id: 'j_movies', kind: 'text', prompt: 'Your favourite films.', helper: 'List a few — separated by commas.' },
  { id: 'j_books', kind: 'text', prompt: 'Your favourite books.' },
  { id: 'j_fairytales', kind: 'text', prompt: 'Fairytales or myths that stayed with you.' },
  { id: 'j_characters', kind: 'text', prompt: 'Characters you love — and, separately, ones you cannot stand.' },
];

/* ------------------------------------------------------------ scoring */
function scoreEnneagram(choices: Record<string, 'a' | 'b'>) {
  const scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 } as Record<EnneagramType, number>;
  for (const it of RHETI) {
    const p = choices[it.id];
    if (p === 'a') scores[it.a.type]++; else if (p === 'b') scores[it.b.type]++;
  }
  const type = (Object.keys(scores) as unknown as EnneagramType[]).reduce((b, t) => (scores[t] > scores[b] ? t : b), 1 as EnneagramType);
  const left = (((type + 7) % 9) + 1) as EnneagramType;
  const right = ((type % 9) + 1) as EnneagramType;
  const wing = scores[left] >= scores[right] ? left : right;
  return { type, wing, scores };
}
function scoreCognition(a: Record<string, number>) {
  const axis: Record<Axis, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const ref: Record<Axis, string> = { EI: 'E', SN: 'S', TF: 'T', JP: 'J' };
  for (const it of COG) {
    const agree = 3 - (a[it.id] ?? 3);
    axis[it.axis] += it.poleA === ref[it.axis] ? agree : -agree;
  }
  const type = ((axis.EI >= 0 ? 'E' : 'I') + (axis.SN >= 0 ? 'S' : 'N') + (axis.TF >= 0 ? 'T' : 'F') + (axis.JP >= 0 ? 'J' : 'P')) as CognitionType;
  return { type, functionStack: STACKS[type] };
}
function scoreTemperament(a: Record<string, number>) {
  const scores: Record<Temperament, number> = { sanguine: 0, choleric: 0, melancholic: 0, phlegmatic: 0 };
  for (const it of TEMP) scores[it.t] += 3 - (a[it.id] ?? 3);
  const ranked = (Object.keys(scores) as Temperament[]).sort((x, y) => scores[y] - scores[x]);
  return { primary: ranked[0], secondary: ranked[1], scores };
}

/* --------------------------------------- compact local report (fallback) */
function buildLocalReport(r: Omit<IntakeResult, 'report'>): string {
  const you = r.workingWithAnalyst ? 'the analysand' : 'you';
  const es = r.workingWithAnalyst ? 's' : '';
  const q = (id: string) => (r.answers[id] ? String(r.answers[id]) : '—');
  const parts = [
    r.workingWithAnalyst
      ? 'Case note for the treating analyst — offered as material to verify in session, not as diagnosis.'
      : 'Read this not as a verdict but as a map of where your speech has been circling.',
    `\nThe presenting knot. ${cap(you)} name${es} what troubles ${r.workingWithAnalyst ? 'them' : 'you'}: “${q('f_presenting')}”, appearing as ${q('f_symptoms')}. In a Lacanian reading this is a signifier ${you} circle${es} — a place where speech snags on desire.`,
    `\nHistory & origins. The bond with mother and father — “${q('f_parents')}” — lays a template the present re-stages; the earliest remembered scene, “${q('f_earliest')}”, was chosen by the psyche for a reason.`,
    `\nDefense & repetition. ${cap(you)} keep${es} distress at bay by “${q('f_avoidance')}”, and the pattern coming into view is “${q('f_patterns')}” — the compulsion to repeat, and the jouissance hidden inside it.`,
    `\nDesire & the Good. Beneath surface wishes, ${you} want${es} most “${q('l_desire')}”; the singular idea of a good life is “${q('l_good')}”. The task is to separate this desire from the desire of the Other.`,
    `\nThe self as symptom. On why this repeats and ${r.workingWithAnalyst ? 'their' : 'your'} part in it: “${q('l_repetition')}”. This move from “why me?” to “what is my hand in this?” is where the obsidian nature is met rather than merely suffered.`,
  ];
  if (r.enneagram) parts.push(`\nEnneagram ${r.enneagram.type} — ${ENNEA_NAME[r.enneagram.type]} (wing ${r.enneagram.wing}): the strategy by which ${you} manage${es} anxiety.`);
  if (r.cognition) parts.push(`\nJungian cognition ${r.cognition.type}: dominant ${FN[r.cognition.functionStack[0]]}, inferior ${FN[r.cognition.functionStack[3]]} — where the shadow most often erupts.`);
  if (r.temperament) parts.push(`\nTemperament: ${r.temperament.primary} / ${r.temperament.secondary} (${TEMP_DESC[r.temperament.primary]}).`);
  return parts.join('\n');
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* --------------------------------------------------------------- UI atoms */
function Progress({ value }: { value: number }) {
  return (
    <View style={s.bar}>
      <View style={[s.fill, { width: `${Math.min(value * 100, 100)}%` }]} />
    </View>
  );
}
function Field({ value, onChange, placeholder }: { value?: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={C.faint} multiline style={s.input} />
  );
}
function Likert({ value, onChange }: { value?: number; onChange: (v: number) => void }) {
  return (
    <View style={s.row}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onChange(n)} style={[s.dot, value === n && s.dotOn]}>
          <Text style={{ color: value === n ? C.void : C.muted }}>{n}</Text>
        </Pressable>
      ))}
    </View>
  );
}
function Forced({ a, b, value, onChange }: { a: string; b: string; value?: 'a' | 'b'; onChange: (v: 'a' | 'b') => void }) {
  return (
    <View style={{ gap: 8 }}>
      {(['a', 'b'] as const).map((k) => (
        <Pressable key={k} onPress={() => onChange(k)} style={[s.choice, value === k && s.choiceOn]}>
          <Text style={{ color: C.bone }}>{k === 'a' ? a : b}</Text>
        </Pressable>
      ))}
    </View>
  );
}
function QCard({ prompt, helper, children }: { prompt: string; helper?: string; children: React.ReactNode }) {
  return (
    <View style={s.card}>
      <Text style={s.qtext}>{prompt}</Text>
      {helper ? <Text style={s.helper}>{helper}</Text> : null}
      {children}
    </View>
  );
}
function Btn({ label, onPress, disabled, ghost }: { label: string; onPress: () => void; disabled?: boolean; ghost?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[s.btn, ghost && s.btnGhost, disabled && { opacity: 0.4 }]}>
      <Text style={[s.btnText, ghost && { color: C.bone }]}>{label}</Text>
    </Pressable>
  );
}

/* --------------------------------------------------------------- module */
type Phase = 'sections' | 'paygate' | 'enneagram' | 'cognition' | 'temperament' | 'jungian' | 'building' | 'report';

export function IntakeModule({
  paid = true,
  age,
  onRequirePayment,
  generateReport,
  onComplete,
}: {
  paid?: boolean;
  age?: number;
  onRequirePayment?: () => void;
  /** Optional async report generator (e.g. LLM). Falls back to a local template. */
  generateReport?: (r: Omit<IntakeResult, 'report'>) => Promise<string>;
  onComplete: (result: IntakeResult) => void;
}) {
  const [phase, setPhase] = useState<Phase>('sections');
  const [sectionIdx, setSectionIdx] = useState(0); // last index = analyst question
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [analyst, setAnalyst] = useState<boolean | null>(null);
  const [ennea, setEnnea] = useState<Record<string, 'a' | 'b'>>({});
  const [cog, setCog] = useState<Record<string, number>>({});
  const [temp, setTemp] = useState<Record<string, number>>({});
  const [arche, setArche] = useState<Record<string, string>>({});
  const [report, setReport] = useState('');

  const set = (id: string, v: string | number) => setAnswers((a) => ({ ...a, [id]: v }));
  const totalSteps = SECTIONS.length + 1; // + analyst step

  // Under-70 gate: assessments require `paid`.
  const gateThenGo = (next: Phase) => {
    if (!paid && (age ?? 0) < 70) {
      setPhase('paygate');
      onRequirePayment?.();
    } else setPhase(next);
  };

  const finish = async () => {
    setPhase('building');
    const base: Omit<IntakeResult, 'report'> = {
      answers,
      workingWithAnalyst: !!analyst,
      enneagram: scoreEnneagram(ennea),
      cognition: scoreCognition(cog),
      temperament: scoreTemperament(temp),
      archetypal: { movies: arche.j_movies ?? '', books: arche.j_books ?? '', fairytales: arche.j_fairytales ?? '', characters: arche.j_characters ?? '' },
    };
    let narrative: string;
    try {
      narrative = generateReport ? await generateReport(base) : buildLocalReport(base);
    } catch {
      narrative = buildLocalReport(base);
    }
    setReport(narrative);
    setPhase('report');
    onComplete({ ...base, report: narrative });
  };

  /* -------- sections phase (free) -------- */
  if (phase === 'sections') {
    const isAnalyst = sectionIdx === SECTIONS.length;
    const sec = SECTIONS[sectionIdx];
    const complete = isAnalyst ? analyst !== null : sec.questions.every((q) => `${answers[q.id] ?? ''}`.length > 0);
    return (
      <Screen>
        <Text style={s.caption}>Step {sectionIdx + 1} of {totalSteps}</Text>
        <Progress value={(sectionIdx + 1) / totalSteps} />
        {isAnalyst ? (
          <>
            <Text style={s.h2}>One Last Thing</Text>
            <View style={s.card}>
              <Text style={s.qtext}>Are you working with an analyst, psychotherapist or psychologist?</Text>
              <Text style={s.helper}>If yes, your reports are written as case material your clinician can use.</Text>
              <View style={s.row}>
                {[{ l: 'Yes', v: true }, { l: 'No', v: false }].map(({ l, v }) => (
                  <Pressable key={l} onPress={() => setAnalyst(v)} style={[s.yn, analyst === v && s.dotOn]}>
                    <Text style={{ color: analyst === v ? C.void : C.bone }}>{l}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={s.frame}>{sec.framework.toUpperCase()}</Text>
            <Text style={s.h1}>{sec.title}</Text>
            <Text style={s.intro}>{sec.intro}</Text>
            {sec.questions.map((q) => (
              <QCard key={q.id} prompt={q.prompt} helper={q.helper}>
                {q.kind === 'scale' ? (
                  <Likert value={answers[q.id] as number} onChange={(v) => set(q.id, v)} />
                ) : (
                  <Field value={answers[q.id] as string} onChange={(v) => set(q.id, v)} placeholder={q.kind === 'freeAssociation' ? 'Let it flow, uncensored…' : 'Write here…'} />
                )}
              </QCard>
            ))}
          </>
        )}
        <View style={s.navRow}>
          {sectionIdx > 0 && <View style={{ flex: 1 }}><Btn ghost label="Back" onPress={() => setSectionIdx((i) => i - 1)} /></View>}
          <View style={{ flex: 2 }}>
            <Btn
              label={isAnalyst ? 'Continue to the assessments' : 'Continue'}
              disabled={!complete}
              onPress={() => (isAnalyst ? gateThenGo('enneagram') : setSectionIdx((i) => i + 1))}
            />
          </View>
        </View>
      </Screen>
    );
  }

  /* -------- paywall gate (under-70) -------- */
  if (phase === 'paygate') {
    return (
      <Screen>
        <Text style={s.h1}>The Threshold</Text>
        <Text style={s.intro}>You’ve completed the opening intake. Unlock the assessments and your analysis report with the $5.99/month subscription.</Text>
        <Btn label="I’ve unlocked — continue" onPress={() => setPhase('enneagram')} />
        <Text style={s.caption}>Members aged 70+ receive full access free.</Text>
      </Screen>
    );
  }

  /* -------- enneagram -------- */
  if (phase === 'enneagram') {
    const done = Object.keys(ennea).length === RHETI.length;
    return (
      <Screen>
        <Text style={s.h1}>Enneagram — RHETI</Text>
        <Text style={s.intro}>Choose the statement that fits you better, even if neither is perfect.</Text>
        {RHETI.map((it, i) => (
          <QCard key={it.id} prompt={`${i + 1}.`}>
            <Forced a={it.a.text} b={it.b.text} value={ennea[it.id]} onChange={(v) => setEnnea((c) => ({ ...c, [it.id]: v }))} />
          </QCard>
        ))}
        <Btn label="Score & continue" disabled={!done} onPress={() => setPhase('cognition')} />
      </Screen>
    );
  }

  /* -------- cognition -------- */
  if (phase === 'cognition') {
    const done = Object.keys(cog).length === COG.length;
    return (
      <Screen>
        <Text style={s.h1}>Jungian Cognition Type</Text>
        <Text style={s.intro}>1 = strongly agree, 5 = strongly disagree.</Text>
        {COG.map((it) => (
          <QCard key={it.id} prompt={it.text}><Likert value={cog[it.id]} onChange={(v) => setCog((c) => ({ ...c, [it.id]: v }))} /></QCard>
        ))}
        <Btn label="Score & continue" disabled={!done} onPress={() => setPhase('temperament')} />
      </Screen>
    );
  }

  /* -------- temperament -------- */
  if (phase === 'temperament') {
    const done = Object.keys(temp).length === TEMP.length;
    return (
      <Screen>
        <Text style={s.h1}>Medieval Temperament</Text>
        <Text style={s.intro}>The four humours as a personality lens. 1 = strongly agree, 5 = strongly disagree.</Text>
        {TEMP.map((it) => (
          <QCard key={it.id} prompt={it.text}><Likert value={temp[it.id]} onChange={(v) => setTemp((c) => ({ ...c, [it.id]: v }))} /></QCard>
        ))}
        <Btn label="Score & continue" disabled={!done} onPress={() => setPhase('jungian')} />
      </Screen>
    );
  }

  /* -------- jungian archetypal -------- */
  if (phase === 'jungian') {
    const done = JUNGIAN.every((q) => (arche[q.id] ?? '').length > 0);
    return (
      <Screen>
        <Text style={s.h1}>Archetypal Material</Text>
        <Text style={s.intro}>The stories you love reveal the figures that move through you.</Text>
        {JUNGIAN.map((q) => (
          <QCard key={q.id} prompt={q.prompt} helper={q.helper}>
            <Field value={arche[q.id]} onChange={(v) => setArche((c) => ({ ...c, [q.id]: v }))} placeholder="Separate with commas…" />
          </QCard>
        ))}
        <Btn label="Generate my analysis report" disabled={!done} onPress={finish} />
      </Screen>
    );
  }

  /* -------- building / report -------- */
  if (phase === 'building') {
    return (
      <Screen>
        <Text style={s.h1}>Assembling Your Formulation</Text>
        <ActivityIndicator color={C.ember} style={{ marginTop: 24 }} />
        <Text style={s.caption}>The codex reads your speech as a structure…</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={s.h1}>Your Formulation</Text>
      <View style={[s.card, { borderColor: C.dagger }]}>
        <Text style={s.report}>{report}</Text>
      </View>
    </Screen>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: C.void }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>{children}</ScrollView>
    </View>
  );
}

/* --------------------------------------------------------------- styles */
const s = StyleSheet.create({
  caption: { color: C.muted, fontSize: 12, marginTop: 8 },
  frame: { color: C.gold, letterSpacing: 2, fontSize: 12, marginTop: 8 },
  h1: { color: C.bone, fontSize: 24, marginTop: 4, marginBottom: 8 },
  h2: { color: C.bone, fontSize: 20, marginTop: 12, marginBottom: 8 },
  intro: { color: C.parch, fontSize: 15, lineHeight: 22, marginBottom: 12 },
  card: { backgroundColor: C.glass, borderWidth: 1, borderColor: C.stroke, borderRadius: 16, padding: 16, marginBottom: 12 },
  qtext: { color: C.bone, fontSize: 15, lineHeight: 22, marginBottom: 6 },
  helper: { color: C.muted, fontSize: 12, marginBottom: 8 },
  report: { color: C.bone, fontSize: 15, lineHeight: 23 },
  input: { minHeight: 90, borderWidth: 1, borderColor: C.stroke, borderRadius: 12, padding: 12, color: C.bone, textAlignVertical: 'top', fontSize: 15 },
  row: { flexDirection: 'row', gap: 8 },
  dot: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, borderColor: C.stroke, alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: C.aero, borderColor: C.aero },
  choice: { borderWidth: 1, borderColor: C.stroke, borderRadius: 12, padding: 14 },
  choiceOn: { borderColor: C.dagger, backgroundColor: 'rgba(179,18,30,0.15)' },
  yn: { flex: 1, borderWidth: 1, borderColor: C.stroke, borderRadius: 12, padding: 14, alignItems: 'center' },
  bar: { height: 6, backgroundColor: C.ash, borderRadius: 999, marginTop: 8, marginBottom: 12, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: C.dagger, borderRadius: 999 },
  navRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btn: { backgroundColor: C.dagger, borderRadius: 999, paddingVertical: 15, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: C.stroke },
  btnGhost: { backgroundColor: C.obsidian },
  btnText: { color: C.bone, fontSize: 15 },
});

export default IntakeModule;
