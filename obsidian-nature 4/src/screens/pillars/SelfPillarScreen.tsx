import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ScreenBackground,
  SectionHeader,
  Title,
  Body,
  Caption,
  PrimaryButton,
  GlassCard,
} from '@/components/ui';
import { Sigil } from '@/components/Sigil';
import { TextField } from '@/components/Questionnaire';
import { ReportView } from '@/components/ReportView';
import { SELF_MODULES, SELF_GROUP_LABEL, SelfGroup } from '@/data/theSelf';
import { analyzeSelfPillar } from '@/analysis/remote';
import { SelfEntry } from '@/analysis/self';
import { useAppStore, analysisTone } from '@/store/useAppStore';
import { LacanianReport } from '@/types';
import { palette, spacing } from '@/theme/theme';

/**
 * Pillar I — The Self (Jungian training).
 *
 * Reached from the Codex (Seven Pillars / home). Teaching modules, each with an
 * interactive exercise and a journal entry. When the user has worked the
 * modules they press Submit, which runs the comprehensive Jungian analysis over
 * everything, archives the resulting progress report on the pillar, and marks
 * the pillar complete. When all modules are worked, that archive forms the full
 * pillar report.
 */
type Draft = Record<string, { exercise: string; journal: string }>;

export function SelfPillarScreen() {
  const nav = useNavigation<any>();
  const tone = useAppStore(analysisTone);
  const store = useAppStore();
  const prog = store.pillars.find((p) => p.id === 1)!;

  const [draft, setDraft] = useState<Draft>({});
  const [submitting, setSubmitting] = useState(false);
  const [report, setReport] = useState<LacanianReport | null>(prog.reports.at(-1) ?? null);

  const setField = (id: string, key: 'exercise' | 'journal', v: string) =>
    setDraft((d) => ({ ...d, [id]: { exercise: d[id]?.exercise ?? '', journal: d[id]?.journal ?? '', [key]: v } }));

  // Enough worked to submit: at least half the modules have any content.
  const workedCount = useMemo(
    () => SELF_MODULES.filter((m) => `${draft[m.id]?.exercise ?? ''}${draft[m.id]?.journal ?? ''}`.trim().length > 0).length,
    [draft],
  );
  const canSubmit = workedCount >= Math.ceil(SELF_MODULES.length / 2);

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const entries: SelfEntry[] = SELF_MODULES.map((m) => ({
        moduleId: m.id,
        title: m.title,
        exercise: draft[m.id]?.exercise ?? '',
        journal: draft[m.id]?.journal ?? '',
      }));
      const r = await analyzeSelfPillar(tone, entries);
      store.addPillarReport(1, r); // archive
      setReport(r);
      if (!prog.startedAt) store.startPillar(1);
      if (r.grade && r.grade.letter !== 'Incomplete') store.completePillar(1);
    } finally {
      setSubmitting(false);
    }
  };

  const groups: SelfGroup[] = ['psyche', 'technique', 'goal'];

  return (
    <ScreenBackground>
      <View style={{ alignItems: 'center', marginBottom: spacing.md }}>
        <Sigil name="seal" size={84} color={palette.emberRed} />
        <Title style={{ marginTop: spacing.sm, textAlign: 'center' }}>I · The Self</Title>
        <Caption style={{ textAlign: 'center', maxWidth: 330 }}>
          Jungian training. The Self is the psyche’s totality and the goal of wholeness, reached through
          individuation — integrating the conscious and unconscious.
        </Caption>
      </View>

      <GlassCard>
        <Caption>PROGRESS</Caption>
        <Body style={{ marginTop: 4 }}>
          {workedCount}/{SELF_MODULES.length} modules worked
          {prog.completedAt ? ' · Sealed' : prog.startedAt ? ' · In progress' : ''}
        </Body>
      </GlassCard>

      {groups.map((g) => (
        <View key={g}>
          <SectionHeader title={SELF_GROUP_LABEL[g]} sigil={g === 'goal' ? 'seal' : g === 'technique' ? 'dream' : 'archetype'} />
          {SELF_MODULES.filter((m) => m.group === g).map((m) => (
            <GlassCard key={m.id}>
              <Body style={{ color: palette.bone, marginBottom: 4 }}>{m.title}</Body>
              <Caption style={{ color: palette.parchment, marginBottom: spacing.sm }}>{m.concept}</Caption>

              <Caption style={{ color: palette.candleGold, marginBottom: 4 }}>EXERCISE</Caption>
              <Caption style={{ marginBottom: 4 }}>{m.exercise}</Caption>
              <TextField
                value={draft[m.id]?.exercise}
                onChange={(v) => setField(m.id, 'exercise', v)}
                placeholder="Work the exercise here…"
              />

              <Caption style={{ color: palette.candleGold, marginTop: spacing.sm, marginBottom: 4 }}>JOURNAL</Caption>
              <Caption style={{ marginBottom: 4 }}>{m.journalPrompt}</Caption>
              <TextField
                value={draft[m.id]?.journal}
                onChange={(v) => setField(m.id, 'journal', v)}
                placeholder="Journal entry…"
              />
            </GlassCard>
          ))}
        </View>
      ))}

      <View style={styles.submitWrap}>
        <PrimaryButton
          label={submitting ? 'Running Jungian analysis…' : 'Submit for Jungian analysis'}
          onPress={submit}
          loading={submitting}
          disabled={!canSubmit}
        />
        {!canSubmit && (
          <Caption style={{ textAlign: 'center', marginTop: spacing.sm }}>
            Work at least {Math.ceil(SELF_MODULES.length / 2)} modules to submit.
          </Caption>
        )}
      </View>

      {report && (
        <>
          <SectionHeader title="Your Analysis (archived)" sigil="lack" />
          <ReportView report={report} />
          <Caption style={{ textAlign: 'center', marginVertical: spacing.sm }}>
            Saved to your archive. When all modules are complete, these records form your full Pillar I report.
          </Caption>
          <PrimaryButton label="Return to the Codex" variant="ritual" onPress={() => nav.goBack()} />
        </>
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  submitWrap: { marginTop: spacing.md },
});
