/** Shared domain types for Obsidian Nature. */

export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CognitionType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type Temperament = 'sanguine' | 'choleric' | 'melancholic' | 'phlegmatic';

/** Free-text/scaled answers from the Lacanian intake questionnaire. */
export type IntakeAnswers = Record<string, string | number>;

/** Jungian archetypal-material intake (favorite media). */
export type ArchetypalInput = {
  movies: string;
  books: string;
  fairytales: string;
  characters: string;
};

export type EnneagramResult = {
  type: EnneagramType;
  wing?: EnneagramType;
  scores: Record<EnneagramType, number>;
};

export type CognitionResult = {
  type: CognitionType;
  functionStack: string[]; // e.g. ['Ni','Te','Fi','Se']
  axes: { EI: number; SN: number; TF: number; JP: number };
};

export type TemperamentResult = {
  primary: Temperament;
  secondary: Temperament;
  scores: Record<Temperament, number>;
};

export type AnalysisTone = 'patient' | 'clinician'; // clinician = working-with-analyst mode

export type LacanianReport = {
  id: string;
  createdAt: number;
  tone: AnalysisTone;
  title: string;
  narrative: string; // Lacanian prose
  focusAreas: string[]; // what to cultivate / strengthen
  archetypes?: string[];
  grade?: PillarGrade; // present on per-pillar formulation reports
  pillarId?: number;
};

/** Grading against a (self-)Lacanian rubric. */
export type PillarGrade = {
  letter: 'A' | 'B' | 'C' | 'D' | 'Incomplete';
  registers: { imaginary: number; symbolic: number; real: number }; // 0-100
  commentary: string;
};

export type PillarProgress = {
  id: number;
  startedAt?: number;
  completedAt?: number;
  currentDay: number; // 1..(365/7 slice) across the year-long arc
  reports: LacanianReport[];
  homework: HomeworkAssignment[];
};

export type HomeworkAssignment = {
  id: string;
  pillarId: number;
  assignedAt: number; // a Friday
  dueAt: number; // next Friday
  prompt: string;
  submission?: string;
  submittedAt?: number;
  gradeReport?: LacanianReport;
};

export type DreamEntry = {
  id: string;
  createdAt: number;
  updatedAt: number;
  title: string;
  raw: string;
  // Jungian dream-structure sections
  exposition: string;
  peripeteia: string; // development
  lysis: string; // resolution
  analysis?: DreamAnalysis;
};

export type DreamAnalysis = {
  tone: AnalysisTone;
  highlights: { fragment: string; note: string }[];
  symbols: { symbol: string; amplification: string }[];
  stageMap: { exposition: string; development: string; lysis: string };
  summary: string;
};

export type NightlyInventory = {
  id: string;
  date: string; // YYYY-MM-DD
  journalPrompt: string;
  analysisPrompt: string;
  journalResponse?: string;
  analysisResponse?: string;
  elderGuidance?: string; // 70-100 end-of-life integration content
};

export type LifeStageContext = {
  loved_one_age_range: string;
  loved_one_stage: string;
  background: string;
  updates: string;
  feelings: string;
  fears: string;
};

/** Outcome of the Pillar III bedchamber game — a projective instrument. */
export type BedchamberResult = {
  role: 'physic' | 'plague';
  roleName: string;
  choices: Record<string, string>; // decisionId -> chosen option label
  /** The Shakespeare line the player found resonant for each tool. */
  resonantQuotes: { tool: string; quote: string; play: string }[];
  top: string[]; // dominant psyche dimensions
  profile: string; // narrative summary of tendencies
  playedAt: number;
};

export type UserProfile = {
  birthYear?: number;
  age?: number;
  workingWithAnalyst?: boolean;
  elderInventoryTime?: { hour: number; minute: number }; // 67-100 chosen time
  lifeStageContexts: LifeStageContext[];
};
