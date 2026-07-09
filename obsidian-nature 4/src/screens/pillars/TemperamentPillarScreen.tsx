import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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
import {
  TEMPERAMENTS,
  Temperament,
  GUIDING_PRINCIPLES,
  HISTORICAL_PRACTICES,
  HUMOR_EXERCISES,
  NEUROPLASTICITY_ACTIVITY,
} from '@/data/fourHumors';
import { analyzeTemperamentPillar } from '@/analysis/remote';
import { HumorEntry } from '@/analysis/temperamentPillar';
import { useAppStore, analysisTone } from '@/store/useAppStore';
import { LacanianReport } from '@/types';
import { palette, spacing } from '@/theme/theme';

/**
 * Pillar III — The Blood, The Bile, & The Nightingale (the four temperaments).
 * Educational cards, guiding principles, opposite-action exercises + journals, a
 * neuroplasticity rep, the historical-practices reference, the bedchamber
 * mini-game, and a Submit that archives the analysis.
 */
type Draft = Record<string, { exercise: string; journal: string }>;

export function TemperamentPillarScreen() {
  const nav = useNavigation<any>();
  const tone = useAppStore(analysisTone);
  const store = useAppStore();
  const prog = store.pillars.find((p) => p.id === 3)!;

  const [draft, setDraft] = useState<Draft>({});
  const [neuro, setNeuro] = useState<string[]>(NEUROPLASTICITY_ACTIVITY.fields.map(() => ''));
  const [openId, setOpenId] = useState<string | null>(store.temperament?.primary ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [report, setReport] = useState<LacanianReport | null>(prog.reports.at(-1) ?? null);

  const setField = (id: string, key: 'exercise' | 'journal', v: string) =>
    setDraft((d) => ({ ...d, [id]: { exercise: d[id]?.exercise ?? '', journal: d[id]?.journal ?? '', [key]: v } }));

  const workedCount = useMemo(
    () => HUMOR_EXERCISES.filter((m) => `${draft[m.id]?.exercise ?? ''}${draft[m.id]?.journal ?? ''}`.trim().length > 0).length,
    [draft],
  );
  const canSubmit = workedCount >= Math.ceil(HUMOR_EXERCISES.length / 2);

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const entries: HumorEntry[] = HUMOR_EXERCISES.map((m) => ({
        id: m.id,
        title: m.title,
        exercise: draft[m.id]?.exercise ?? '',
        journal: draft[m.id]?.journal ?? '',
      }));
      // Fold the neuroplasticity log in as an entry too.
      entries.push({ id: 'neuroplasticity', title: NEUROPLASTICITY_ACTIVITY.title, exercise: neuro.join('\n'), journal: '' });
      const r = await analyzeTemperamentPillar(tone, entries, store.temperament, store.bedchamberResult);
      store.addPillarReport(3, r);
      setReport(r);
      if (!prog.startedAt) store.startPillar(3);
      if (r.grade && r.grade.letter !== 'Incomplete') store.completePillar(3);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenBackground>
      <View style={{ alignItems: 'center', marginBottom: spacing.md }}>
        <Sigil name="dagger" size={84} color={palette.emberRed} />
        <Title style={{ marginTop: spacing.sm, textAlign: 'center' }}>III · The Blood, The Bile, & The Nightingale</Title>
        <Caption style={{ textAlign: 'center', maxWidth: 330 }}>
          The four temperaments. Master your natural excess through the Doctrine of Opposites — and rewire
          the habit through practice.
        </Caption>
      </View>

      {/* 1 — The Four Temperaments */}
      <SectionHeader title="The Four Temperaments" sigil="archetype" />
      {TEMPERAMENTS.map((t) => (
        <TemperamentCard key={t.id} t={t} open={openId === t.id} onToggle={() => setOpenId(openId === t.id ? null : t.id)} />
      ))}

      {/* 2 — Guiding Principles */}
      <SectionHeader title="The Guiding Principles" sigil="threshold" />
      {GUIDING_PRINCIPLES.map((p) => (
        <GlassCard key={p.title}>
          <Body style={{ color: palette.bone, marginBottom: 4 }}>{p.title}</Body>
          <Caption style={{ color: palette.parchment }}>{p.body}</Caption>
        </GlassCard>
      ))}

      {/* 3 — Interactive exercises + journals */}
      <SectionHeader title="Exercises & Journal" sigil="mirror" />
      {HUMOR_EXERCISES.map((m) => (
        <GlassCard key={m.id}>
          <Body style={{ color: palette.bone, marginBottom: spacing.sm }}>{m.title}</Body>
          <Caption style={{ color: palette.candleGold, marginBottom: 4 }}>EXERCISE</Caption>
          <Caption style={{ marginBottom: 4 }}>{m.exercise}</Caption>
          <TextField value={draft[m.id]?.exercise} onChange={(v) => setField(m.id, 'exercise', v)} placeholder="Work it here…" />
          <Caption style={{ color: palette.candleGold, marginTop: spacing.sm, marginBottom: 4 }}>JOURNAL</Caption>
          <Caption style={{ marginBottom: 4 }}>{m.journalPrompt}</Caption>
          <TextField value={draft[m.id]?.journal} onChange={(v) => setField(m.id, 'journal', v)} placeholder="Journal entry…" />
        </GlassCard>
      ))}

      {/* 4 — Neuroplasticity activity */}
      <SectionHeader title="Neuroplasticity — Rewiring the Temperament" sigil="dream" />
      <GlassCard glow>
        <Caption style={{ color: palette.parchment, marginBottom: spacing.sm }}>{NEUROPLASTICITY_ACTIVITY.body}</Caption>
        {NEUROPLASTICITY_ACTIVITY.fields.map((label, i) => (
          <View key={label}>
            <Caption style={{ color: palette.candleGold, marginBottom: 4 }}>{label.toUpperCase()}</Caption>
            <TextField value={neuro[i]} onChange={(v) => setNeuro((n) => n.map((x, j) => (j === i ? v : x)))} placeholder="…" />
          </View>
        ))}
      </GlassCard>

      {/* 5 — Bedchamber mini-game */}
      <SectionHeader title="The Bedchamber" sigil="dagger" />
      <GlassCard glow={!!store.bedchamberResult}>
        <Body>
          Step into a 15th-century sick-chamber. Choose your calling — Doctor of Physic or Plague Doctor —
          and treat the patient. Your role and the tools you reach for are read as a projective test and
          folded into this pillar’s analysis.
        </Body>
        {store.bedchamberResult ? (
          <>
            <Caption style={{ color: palette.candleGold, marginTop: spacing.sm }}>
              Played as {store.bedchamberResult.roleName}
              {store.bedchamberResult.top.length ? ` · ${store.bedchamberResult.top.join(' · ')}` : ''}
            </Caption>
            <Caption style={{ color: palette.parchment, marginBottom: spacing.sm }}>
              {store.bedchamberResult.profile}
            </Caption>
            <PrimaryButton label="Re-enter the Bedchamber" variant="aero" onPress={() => nav.navigate('BloodlettingGame')} />
          </>
        ) : (
          <>
            <Caption style={{ color: palette.textFaint, marginVertical: spacing.sm }}>
              Historical recreation only. The practices depicted (bloodletting, bubo-lancing, purging) are
              medically discredited and dangerous — this is history, never health advice.
            </Caption>
            <PrimaryButton label="Enter the Bedchamber" variant="aero" onPress={() => nav.navigate('BloodlettingGame')} />
          </>
        )}
      </GlassCard>

      {/* 6 — Historical practices reference */}
      <SectionHeader title="Historical Balancing Practices" sigil="lack" />
      {HISTORICAL_PRACTICES.map((p) => (
        <GlassCard key={p.title}>
          <Body style={{ color: palette.bone, marginBottom: 4 }}>{p.title}</Body>
          <Caption style={{ color: palette.parchment }}>{p.body}</Caption>
        </GlassCard>
      ))}

      {/* 7 — Submit */}
      <View style={{ marginTop: spacing.md }}>
        <PrimaryButton
          label={submitting ? 'Weighing the humors…' : 'Submit for analysis'}
          onPress={submit}
          loading={submitting}
          disabled={!canSubmit}
        />
        {!canSubmit && (
          <Caption style={{ textAlign: 'center', marginTop: spacing.sm }}>
            Work at least {Math.ceil(HUMOR_EXERCISES.length / 2)} exercises to submit.
          </Caption>
        )}
      </View>

      {report && (
        <>
          <SectionHeader title="Your Analysis (archived)" sigil="seal" />
          <ReportView report={report} />
          <PrimaryButton label="Return to the Codex" variant="ritual" onPress={() => nav.goBack()} />
        </>
      )}
    </ScreenBackground>
  );
}

function TemperamentCard({ t, open, onToggle }: { t: Temperament; open: boolean; onToggle: () => void }) {
  return (
    <Pressable onPress={onToggle}>
      <GlassCard glow={open}>
        <View style={styles.row}>
          <Title style={{ marginBottom: 0, color: palette.candleGold }}>{t.glyph}</Title>
          <View style={{ flex: 1 }}>
            <Body style={{ color: palette.bone, marginBottom: 2 }}>
              {t.name} · {t.humor}
            </Body>
            <Caption>
              {t.element} · {t.season} · {t.qualities}
            </Caption>
            <Caption style={{ color: palette.parchment, marginTop: 4 }}>
              Strengths: {t.strengths.join(', ')}
            </Caption>
            {open && (
              <View style={{ marginTop: spacing.sm }}>
                <Caption style={{ color: palette.emberRed }}>Excess: {t.excess.join(', ')}</Caption>
                <Caption style={{ color: palette.parchment, marginTop: 4 }}>Balance: {t.balance}</Caption>
                <Caption style={{ color: palette.aero, marginTop: 4 }}>Opposite action: {t.oppositeAction}</Caption>
                <Caption style={{ color: palette.textFaint, marginTop: 4 }}>Historical: {t.historical}</Caption>
              </View>
            )}
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
});
