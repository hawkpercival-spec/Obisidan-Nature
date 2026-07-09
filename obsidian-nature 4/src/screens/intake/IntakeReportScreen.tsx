import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ScreenBackground, SectionHeader, Body, Caption, PrimaryButton, GlassCard } from '@/components/ui';
import { Sigil } from '@/components/Sigil';
import { ReportView } from '@/components/ReportView';
import { useAppStore, analysisTone } from '@/store/useAppStore';
import { detectArchetypes } from '@/analysis/lacanian';
import { generateIntakeReport, generateArchetypeReport } from '@/analysis/remote';
import { LacanianReport } from '@/types';
import { PILLARS } from '@/data/pillars';
import { scheduleNightlyInventory } from '@/services/notifications';
import { useAuth } from '@/auth/AuthProvider';
import { spacing, palette } from '@/theme/theme';

/**
 * Generates and displays the intake Lacanian analysis report + the curriculum
 * outline for the Seven Pillars, then completes intake and unlocks the app.
 *
 * The report is produced by the backend LLM endpoint (with a local fallback), so
 * generation is async — we show a loading state while the codex "assembles".
 */
export function IntakeReportScreen() {
  const { user } = useAuth();
  const store = useAppStore();
  const tone = useAppStore(analysisTone);
  const [report, setReport] = useState<LacanianReport | null>(null);

  // Generate + persist the reports once, asynchronously.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const archetypes = detectArchetypes(store.archetypalInput);
      const [intake, arche] = await Promise.all([
        generateIntakeReport({
          tone,
          name: user?.name,
          age: store.profile.age,
          answers: store.intakeAnswers,
          enneagram: store.enneagram,
          cognition: store.cognition,
          temperament: store.temperament,
          archetypes,
        }),
        generateArchetypeReport(tone, store.archetypalInput),
      ]);
      if (cancelled) return;
      setReport(intake);
      store.setIntakeReport(intake);
      store.setArchetypeReport(arche);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Completing intake flips the root gate to the main tabs, so it only fires on
  // the explicit button press (after the user has read the formulation).
  const enterCodex = () => {
    const age = store.profile.age ?? 30;
    scheduleNightlyInventory(age, store.profile.elderInventoryTime).catch(() => {});
    store.completeIntake();
  };

  if (!report) {
    return (
      <ScreenBackground scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
          <Sigil name="lack" size={110} />
          <SectionHeader title="Assembling Your Formulation" sigil="threshold" />
          <ActivityIndicator color={palette.emberRed} style={{ marginTop: spacing.md }} />
          <Caption style={{ textAlign: 'center', marginTop: spacing.md, maxWidth: 300 }}>
            The codex reads your speech as a structure…
          </Caption>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <SectionHeader title="Your Formulation" sigil="lack" />
      <ReportView report={report} />

      <GlassCard glow>
        <SectionHeader title="Curriculum — The Percivalian Way" sigil="seal" />
        <Caption style={{ marginBottom: spacing.sm }}>
          Your Seven Pillars, sequenced and personalised. The full arc spans 365 days.
        </Caption>
        {PILLARS.map((p) => (
          <Body key={p.id} style={{ color: palette.parchment, marginBottom: 6 }}>
            {roman(p.id)}. {p.name} — {p.subtitle}
          </Body>
        ))}
      </GlassCard>

      <PrimaryButton label="Enter the Codex" onPress={enterCodex} variant="ritual" />
    </ScreenBackground>
  );
}

function roman(n: number) {
  return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][n - 1] ?? String(n);
}
