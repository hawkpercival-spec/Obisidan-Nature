import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenBackground, SectionHeader, Title, Body, Caption, PrimaryButton, GlassCard } from '@/components/ui';
import { Sigil } from '@/components/Sigil';
import { TextField } from '@/components/Questionnaire';
import { ReportView } from '@/components/ReportView';
import { RootStackParamList } from '@/navigation/types';
import { getPillar } from '@/data/pillars';
import { personaliseExercises, generateHomework } from '@/analysis/lacanian';
import { generatePillarReport } from '@/analysis/remote';
import { useAppStore, analysisTone } from '@/store/useAppStore';
import { LacanianReport } from '@/types';
import { palette, spacing } from '@/theme/theme';

/**
 * A single pillar: personalised exercises, a written response, grading against
 * the Lacanian rubric, a case-formulation report, and the completion seal.
 */
export function PillarDetailScreen() {
  const nav = useNavigation<any>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'PillarDetail'>>();
  const pillar = getPillar(params.id);
  const tone = useAppStore(analysisTone);
  const store = useAppStore();
  const prog = store.pillars.find((p) => p.id === pillar.id)!;

  const exercises = useMemo(
    () =>
      personaliseExercises(pillar, {
        enneagram: store.enneagram,
        cognition: store.cognition,
        temperament: store.temperament,
        age: store.profile.age,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pillar.id],
  );

  const [responses, setResponses] = useState<string[]>(exercises.map(() => ''));
  const [report, setReport] = useState<LacanianReport | null>(prog.reports.at(-1) ?? null);
  const [grading, setGrading] = useState(false);
  const sealed = !!prog.completedAt || (report?.grade && report.grade.letter !== 'Incomplete');

  const begin = () => store.startPillar(pillar.id);

  const submit = async () => {
    setGrading(true);
    try {
      const r = await generatePillarReport(pillar, tone, responses);
      store.addPillarReport(pillar.id, r);
      setReport(r);
      if (r.grade && r.grade.letter !== 'Incomplete') {
        store.completePillar(pillar.id);
        // Kick a weekly homework assignment tied to this pillar.
        const now = Date.now();
        store.addHomework(
          generateHomework(pillar, {
            enneagram: store.enneagram,
            cognition: store.cognition,
            assignedAt: now,
            dueAt: now + 7 * 24 * 3600 * 1000,
            hasDreams: store.dreams.length > 0,
            hasNightly: store.nightly.length > 0,
          }),
        );
      }
    } finally {
      setGrading(false);
    }
  };

  return (
    <ScreenBackground>
      <View style={{ alignItems: 'center', marginBottom: spacing.md }}>
        <Sigil name={pillar.sigil} size={80} color={sealed ? palette.candleGold : palette.emberRed} />
        <Title style={{ marginTop: spacing.sm, textAlign: 'center' }}>
          {roman(pillar.id)}. {pillar.name}
        </Title>
        <Caption style={{ textAlign: 'center' }}>{pillar.subtitle}</Caption>
      </View>

      <GlassCard>
        <Body>{pillar.summary}</Body>
        <Caption style={{ color: palette.candleGold, marginTop: spacing.sm }}>
          Core concepts: {pillar.coreConcepts.join(' · ')}
        </Caption>
      </GlassCard>

      {!prog.startedAt ? (
        <PrimaryButton label="Begin this pillar" onPress={begin} />
      ) : (
        <>
          <SectionHeader title="Your Exercises" sigil={pillar.sigil} />
          {exercises.map((ex, i) => (
            <GlassCard key={i}>
              <Body>{ex}</Body>
              <TextField
                value={responses[i]}
                onChange={(t) => setResponses((r) => r.map((x, j) => (j === i ? t : x)))}
                placeholder="Write your response…"
              />
            </GlassCard>
          ))}
          <PrimaryButton
            label={grading ? 'Reading your speech…' : 'Submit for Lacanian grading'}
            onPress={submit}
            loading={grading}
          />
        </>
      )}

      {report && (
        <>
          <SectionHeader title="Case Formulation" sigil="lack" />
          <ReportView report={report} />
          {sealed && (
            <View style={{ alignItems: 'center', marginVertical: spacing.lg }}>
              <Sigil name="seal" size={120} color={palette.candleGold} glow={palette.emberRed} />
              <Title style={{ marginTop: spacing.sm }}>Pillar Sealed</Title>
              <Caption>The sigil of {pillar.name} is now inscribed in your codex.</Caption>
              <View style={{ height: spacing.md }} />
              <PrimaryButton label="Return to the Codex" variant="ritual" onPress={() => nav.goBack()} />
            </View>
          )}
        </>
      )}
    </ScreenBackground>
  );
}

function roman(n: number) {
  return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][n - 1] ?? String(n);
}
