import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenBackground, SectionHeader, Title, Body, Caption, PrimaryButton, GlassCard } from '@/components/ui';
import { Likert, TextField, QuestionCard } from '@/components/Questionnaire';
import { INTAKE_SECTIONS, IntakeSection } from '@/data/intake';
import { useAppStore } from '@/store/useAppStore';
import { useTransition } from '@/components/TransitionProvider';
import { palette, radius, spacing } from '@/theme/theme';

/**
 * The Freudian + Lacanian intake, presented as a guided module — one section at
 * a time, with a free-association opener and the Lacanian fundamental questions.
 * A final step captures whether the user works with an analyst (sets report tone).
 *
 * This is the FREE first portion; the assessments that follow sit behind the
 * paywall for under-70 users.
 */
const FRAMEWORK_LABEL: Record<IntakeSection['framework'], string> = {
  orientation: 'ORIENTATION',
  freudian: 'FREUDIAN',
  lacanian: 'LACANIAN',
};

export function IntakeFreeScreen() {
  const nav = useNavigation<any>();
  const { transition } = useTransition();
  const setIntakeAnswers = useAppStore((s) => s.setIntakeAnswers);
  const setWorkingWithAnalyst = useAppStore((s) => s.setWorkingWithAnalyst);
  const existing = useAppStore((s) => s.intakeAnswers);

  const [answers, setAnswers] = useState<Record<string, string | number>>(existing ?? {});
  const [analyst, setAnalyst] = useState<boolean | null>(null);
  // step 0..sections-1 = sections; last step = the analyst question.
  const [step, setStep] = useState(0);

  const total = INTAKE_SECTIONS.length + 1; // +1 for the analyst step
  const isAnalystStep = step === INTAKE_SECTIONS.length;
  const section = INTAKE_SECTIONS[step];

  const set = (id: string, v: string | number) => setAnswers((a) => ({ ...a, [id]: v }));

  const sectionComplete = useMemo(() => {
    if (isAnalystStep) return analyst !== null;
    return section.questions.every((q) => `${answers[q.id] ?? ''}`.toString().length > 0);
  }, [section, answers, isAnalystStep, analyst]);

  const goNext = () => {
    // Persist progress as we go so nothing is lost.
    setIntakeAnswers(answers);
    if (!isAnalystStep) {
      setStep((s) => s + 1);
      return;
    }
    // Final step → finish intake, move to the (paid) assessments.
    setWorkingWithAnalyst(!!analyst);
    transition(() => nav.navigate('Enneagram'), 'The Threshold approaches.');
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <ScreenBackground>
      {/* progress */}
      <Caption>
        Step {step + 1} of {total}
      </Caption>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${((step + 1) / total) * 100}%` }]} />
      </View>

      {isAnalystStep ? (
        <>
          <SectionHeader title="One Last Thing" sigil="threshold" />
          <GlassCard>
            <Body>Are you working with an analyst, psychotherapist or psychologist?</Body>
            <Caption style={{ marginBottom: spacing.sm }}>
              If yes, your reports are written as case material your clinician can use in their work with you.
            </Caption>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {[
                { label: 'Yes', v: true },
                { label: 'No', v: false },
              ].map(({ label, v }) => (
                <Pressable
                  key={label}
                  onPress={() => setAnalyst(v)}
                  style={[styles.yn, analyst === v && styles.ynActive]}
                >
                  <Body style={{ marginBottom: 0, color: analyst === v ? palette.voidBlack : palette.textPrimary }}>
                    {label}
                  </Body>
                </Pressable>
              ))}
            </View>
          </GlassCard>
        </>
      ) : (
        <>
          <Caption style={{ color: palette.candleGold, letterSpacing: 2 }}>{FRAMEWORK_LABEL[section.framework]}</Caption>
          <Title style={{ marginTop: 2 }}>{section.title}</Title>
          <Body style={{ color: palette.parchment }}>{section.intro}</Body>

          {section.questions.map((q) => (
            <QuestionCard key={q.id} prompt={q.prompt} helper={q.helper}>
              {q.kind === 'scale' ? (
                <Likert value={answers[q.id] as number} onChange={(v) => set(q.id, v)} />
              ) : (
                <TextField
                  value={answers[q.id] as string}
                  onChange={(v) => set(q.id, v)}
                  placeholder={q.kind === 'freeAssociation' ? 'Let it flow, uncensored…' : 'Write here…'}
                />
              )}
            </QuestionCard>
          ))}
        </>
      )}

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        {step > 0 && (
          <View style={{ flex: 1 }}>
            <PrimaryButton label="Back" variant="ghost" onPress={goBack} />
          </View>
        )}
        <View style={{ flex: 2 }}>
          <PrimaryButton
            label={isAnalystStep ? 'Continue to the assessments' : 'Continue'}
            onPress={goNext}
            disabled={!sectionComplete}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  bar: { height: 6, backgroundColor: palette.ash, borderRadius: radius.pill, marginTop: spacing.sm, marginBottom: spacing.md, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: palette.daggerRed, borderRadius: radius.pill },
  yn: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.glassStroke,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  ynActive: { backgroundColor: palette.aero, borderColor: palette.aero },
});
