import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { ScreenBackground, SectionHeader, Body, Caption, GlassCard, PrimaryButton } from '@/components/ui';
import { TextField } from '@/components/Questionnaire';
import { CodexSealed } from '@/components/LockedScreen';
import { useAppStore, analysisTone, canAccessDailyRitual } from '@/store/useAppStore';
import { generateDailyRitual } from '@/analysis/remote';
import { palette, spacing } from '@/theme/theme';

/**
 * Daily Ritual — the customised daily check-in + exercise, built from ALL of the
 * user's results, analysis, and progress reports.
 *
 * SEALED until every one of the Seven Pillars is complete. This tab is entirely
 * separate from the Nightly Inventory; when locked it shows the Codex Sealed
 * screen with the disclaimer below.
 */
export function DailyRitualScreen() {
  const unlocked = useAppStore(canAccessDailyRitual);
  const store = useAppStore();
  const tone = useAppStore(analysisTone);
  const [checkIn, setCheckIn] = useState('');
  const [response, setResponse] = useState('');
  const [ritual, setRitual] = useState<{ checkIn: string; exercise: string } | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!unlocked) return;
    let cancelled = false;
    const focusAreas = store.intakeReport?.focusAreas ?? ['your desire'];
    generateDailyRitual({
      tone,
      enneagram: store.enneagram,
      cognition: store.cognition,
      temperament: store.temperament,
      age: store.profile.age,
      focusAreas,
      date: today,
    }).then((r) => {
      if (!cancelled) setRitual(r);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, unlocked]);

  if (!unlocked) {
    return (
      <CodexSealed
        title="The Codex Is Sealed"
        message="The Daily Ritual awaits the completion of all Seven Pillars."
        disclaimer="Daily Rituals will not unlock until every pillar of The Percivalian Way is sealed. This is separate from your Nightly Inventory, which is already open to you."
      />
    );
  }

  if (!ritual) {
    return (
      <ScreenBackground scroll={false}>
        <SectionHeader title="Daily Ritual" sigil="seal" />
        <ActivityIndicator color={palette.emberRed} style={{ marginTop: spacing.lg }} />
        <Caption style={{ marginTop: spacing.md }}>Composing today’s ritual…</Caption>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <SectionHeader title="Daily Ritual" sigil="seal" />
      <Caption>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Caption>

      <GlassCard>
        <Caption style={{ color: palette.candleGold, marginBottom: 4 }}>CHECK-IN</Caption>
        <Body>{ritual.checkIn}</Body>
        <TextField value={checkIn} onChange={setCheckIn} placeholder="Mood · body · desire · defence…" />
      </GlassCard>

      <GlassCard glow>
        <Caption style={{ color: palette.candleGold, marginBottom: 4 }}>TODAY’S RITUAL</Caption>
        <Body>{ritual.exercise}</Body>
        <TextField value={response} onChange={setResponse} placeholder="Work it here…" />
      </GlassCard>

      <PrimaryButton label="Complete today’s ritual" variant="ritual" onPress={() => {}} />
    </ScreenBackground>
  );
}
