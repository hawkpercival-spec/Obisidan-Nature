import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AnalysisTone,
  ArchetypalInput,
  BedchamberResult,
  CognitionResult,
  DreamEntry,
  EnneagramResult,
  HomeworkAssignment,
  IntakeAnswers,
  LacanianReport,
  NightlyInventory,
  PillarProgress,
  TemperamentResult,
  UserProfile,
} from '@/types';

const TOTAL_PILLARS = 7;

type AppState = {
  // profile
  profile: UserProfile;
  setBirthYear: (year: number) => void;
  setWorkingWithAnalyst: (v: boolean) => void;
  setElderInventoryTime: (t: { hour: number; minute: number }) => void;
  addLifeStageContext: (c: UserProfile['lifeStageContexts'][number]) => void;

  // access / gating
  hasFullAccess: boolean;
  setFullAccess: (v: boolean) => void;

  // intake
  intakeAnswers: IntakeAnswers;
  setIntakeAnswers: (a: IntakeAnswers) => void;
  archetypalInput?: ArchetypalInput;
  setArchetypalInput: (a: ArchetypalInput) => void;
  enneagram?: EnneagramResult;
  cognition?: CognitionResult;
  temperament?: TemperamentResult;
  setEnneagram: (r: EnneagramResult) => void;
  setCognition: (r: CognitionResult) => void;
  setTemperament: (r: TemperamentResult) => void;

  intakeReport?: LacanianReport;
  archetypeReport?: LacanianReport;
  setIntakeReport: (r: LacanianReport) => void;
  setArchetypeReport: (r: LacanianReport) => void;
  intakeComplete: boolean;
  completeIntake: () => void;

  // pillars
  pillars: PillarProgress[];
  advancePillarDay: (id: number) => void;
  addPillarReport: (id: number, r: LacanianReport) => void;
  completePillar: (id: number) => void;
  startPillar: (id: number) => void;
  addHomework: (h: HomeworkAssignment) => void;
  submitHomework: (id: string, submission: string, grade: LacanianReport) => void;

  // features
  dreams: DreamEntry[];
  addDream: (d: DreamEntry) => void;
  updateDream: (id: string, patch: Partial<DreamEntry>) => void;
  nightly: NightlyInventory[];
  addNightly: (n: NightlyInventory) => void;
  updateNightly: (id: string, patch: Partial<NightlyInventory>) => void;

  // Pillar III bedchamber game result (projective instrument)
  bedchamberResult?: BedchamberResult;
  setBedchamberResult: (r: BedchamberResult) => void;

  reset: () => void;
};

function freshPillars(): PillarProgress[] {
  return Array.from({ length: TOTAL_PILLARS }, (_, i) => ({
    id: i + 1,
    currentDay: 0,
    reports: [],
    homework: [],
  }));
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: { lifeStageContexts: [] },
      setBirthYear: (year) => {
        const age = new Date().getFullYear() - year;
        set((s) => ({ profile: { ...s.profile, birthYear: year, age } }));
      },
      setWorkingWithAnalyst: (v) => set((s) => ({ profile: { ...s.profile, workingWithAnalyst: v } })),
      setElderInventoryTime: (t) => set((s) => ({ profile: { ...s.profile, elderInventoryTime: t } })),
      addLifeStageContext: (c) =>
        set((s) => ({ profile: { ...s.profile, lifeStageContexts: [...s.profile.lifeStageContexts, c] } })),

      hasFullAccess: false,
      setFullAccess: (v) => set({ hasFullAccess: v }),

      intakeAnswers: {},
      setIntakeAnswers: (a) => set((s) => ({ intakeAnswers: { ...s.intakeAnswers, ...a } })),
      setArchetypalInput: (a) => set({ archetypalInput: a }),
      setEnneagram: (r) => set({ enneagram: r }),
      setCognition: (r) => set({ cognition: r }),
      setTemperament: (r) => set({ temperament: r }),
      setIntakeReport: (r) => set({ intakeReport: r }),
      setArchetypeReport: (r) => set({ archetypeReport: r }),
      intakeComplete: false,
      completeIntake: () => set({ intakeComplete: true }),

      pillars: freshPillars(),
      startPillar: (id) =>
        set((s) => ({
          pillars: s.pillars.map((p) =>
            p.id === id && !p.startedAt ? { ...p, startedAt: Date.now(), currentDay: 1 } : p,
          ),
        })),
      advancePillarDay: (id) =>
        set((s) => ({
          pillars: s.pillars.map((p) => (p.id === id ? { ...p, currentDay: p.currentDay + 1 } : p)),
        })),
      addPillarReport: (id, r) =>
        set((s) => ({
          pillars: s.pillars.map((p) => (p.id === id ? { ...p, reports: [...p.reports, r] } : p)),
        })),
      completePillar: (id) =>
        set((s) => ({
          pillars: s.pillars.map((p) => (p.id === id ? { ...p, completedAt: Date.now() } : p)),
        })),
      addHomework: (h) =>
        set((s) => ({
          pillars: s.pillars.map((p) => (p.id === h.pillarId ? { ...p, homework: [...p.homework, h] } : p)),
        })),
      submitHomework: (id, submission, grade) =>
        set((s) => ({
          pillars: s.pillars.map((p) => ({
            ...p,
            homework: p.homework.map((h) =>
              h.id === id ? { ...h, submission, submittedAt: Date.now(), gradeReport: grade } : h,
            ),
          })),
        })),

      dreams: [],
      addDream: (d) => set((s) => ({ dreams: [d, ...s.dreams] })),
      updateDream: (id, patch) =>
        set((s) => ({ dreams: s.dreams.map((d) => (d.id === id ? { ...d, ...patch, updatedAt: Date.now() } : d)) })),
      nightly: [],
      addNightly: (n) => set((s) => ({ nightly: [n, ...s.nightly] })),
      updateNightly: (id, patch) =>
        set((s) => ({ nightly: s.nightly.map((n) => (n.id === id ? { ...n, ...patch } : n)) })),

      setBedchamberResult: (r) => set({ bedchamberResult: r }),

      reset: () =>
        set({
          profile: { lifeStageContexts: [] },
          hasFullAccess: false,
          intakeAnswers: {},
          intakeComplete: false,
          enneagram: undefined,
          cognition: undefined,
          temperament: undefined,
          archetypalInput: undefined,
          intakeReport: undefined,
          archetypeReport: undefined,
          pillars: freshPillars(),
          dreams: [],
          nightly: [],
          bedchamberResult: undefined,
        }),
    }),
    {
      name: 'obsidian-nature-state',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// ---- Derived selectors (gating rules live here) ----

/** Elderly track: 70–100 receive end-of-life integration content. */
export const isElderTrack = (age?: number) => !!age && age >= 70 && age <= 100;

/** 67–100 choose a nightly time inside the 7:00–8:30pm window. */
export const usesElderInventoryWindow = (age?: number) => !!age && age >= 67 && age <= 100;

/** Paywall applies ONLY to users under 70 who have not purchased. */
export const isPaywalled = (s: AppState) => (s.profile.age ?? 0) < 70 && !s.hasFullAccess;

export const allPillarsComplete = (s: AppState) => s.pillars.every((p) => !!p.completedAt);

/** Dream journal unlocks after intake (independent of pillars). */
export const canAccessDreamJournal = (s: AppState) => s.intakeComplete;

/** Nightly Inventory unlocks after intake. Separate from Daily Ritual. */
export const canAccessNightly = (s: AppState) => s.intakeComplete;

/** Daily Ritual unlocks ONLY after all seven pillars are complete. */
export const canAccessDailyRitual = (s: AppState) => allPillarsComplete(s);

/** Narrative tone: clinician-facing when the user works with an analyst. */
export const analysisTone = (s: AppState): AnalysisTone =>
  s.profile.workingWithAnalyst ? 'clinician' : 'patient';
