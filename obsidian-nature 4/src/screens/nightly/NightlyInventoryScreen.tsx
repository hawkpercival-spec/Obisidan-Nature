import React, { useEffect } from 'react';
import { ScreenBackground, SectionHeader, Body, Caption, PrimaryButton, GlassCard } from '@/components/ui';
import { TextField } from '@/components/Questionnaire';
import { CodexSealed } from '@/components/LockedScreen';
import { useAppStore, analysisTone, canAccessNightly } from '@/store/useAppStore';
import { generateNightly } from '@/analysis/remote';
import { palette, spacing } from '@/theme/theme';

/**
 * Nightly Inventory — a Freudian/Lacanian before-bed inventory. A fresh journal
 * prompt + analysis prompt are generated each night (delivered by notification
 * at 9pm, or the chosen 7:00–8:30pm time for 67–100). This tab is SEPARATE from
 * the Dream Journal and from Daily Rituals — nothing is shared between them.
 *
 * Unlocks after the intake module is complete.
 */
export function NightlyInventoryScreen() {
  const unlocked = useAppStore(canAccessNightly);
  const store = useAppStore();
  const tone = useAppStore(analysisTone);
  const today = new Date().toISOString().slice(0, 10);
  const existing = store.nightly.find((n) => n.date === today);

  // Create tonight's inventory once, in an effect (never during render).
  useEffect(() => {
    let cancelled = false;
    if (unlocked && !existing) {
      generateNightly(today, { age: store.profile.age, tone }).then((n) => {
        if (!cancelled) store.addNightly(n);
      });
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, unlocked]);

  const tonight = existing;

  if (!unlocked) {
    return (
      <CodexSealed
        title="Nightly Inventory Is Sealed"
        message="Complete your intake module to unlock the Nightly Inventory."
      />
    );
  }

  if (!tonight) {
    return (
      <ScreenBackground scroll={false}>
        <SectionHeader title="Nightly Inventory" sigil="dream" />
        <Caption>Preparing tonight’s inventory…</Caption>
      </ScreenBackground>
    );
  }

  const patch = (p: Partial<NonNullable<typeof tonight>>) => store.updateNightly(tonight.id, p);

  return (
    <ScreenBackground>
      <SectionHeader title="Nightly Inventory" sigil="dream" />
      <Caption>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Caption>

      {tonight.elderGuidance && (
        <GlassCard glow>
          <Caption style={{ color: palette.candleGold }}>END-OF-LIFE INTEGRATION</Caption>
          <Body style={{ marginTop: 4 }}>{tonight.elderGuidance}</Body>
        </GlassCard>
      )}

      <GlassCard>
        <Caption style={{ color: palette.candleGold, marginBottom: 4 }}>JOURNAL</Caption>
        <Body>{tonight.journalPrompt}</Body>
        <TextField
          value={tonight.journalResponse}
          onChange={(t) => patch({ journalResponse: t })}
          placeholder="Tonight’s entry…"
        />
      </GlassCard>

      <GlassCard>
        <Caption style={{ color: palette.candleGold, marginBottom: 4 }}>ANALYSIS</Caption>
        <Body>{tonight.analysisPrompt}</Body>
        <TextField
          value={tonight.analysisResponse}
          onChange={(t) => patch({ analysisResponse: t })}
          placeholder="Your analysis…"
        />
      </GlassCard>

      <PrimaryButton label="Seal tonight’s inventory" onPress={() => {}} variant="ritual" />

      {store.nightly.length > 1 && (
        <>
          <SectionHeader title="Past Nights" sigil="lack" />
          {store.nightly.slice(1, 8).map((n) => (
            <GlassCard key={n.id}>
              <Caption>{n.date}</Caption>
              <Body style={{ color: palette.parchment }} numberOfLines={2}>
                {n.journalResponse || n.journalPrompt}
              </Body>
            </GlassCard>
          ))}
        </>
      )}

      <Caption style={{ textAlign: 'center', marginTop: spacing.md }}>
        A new inventory arrives each night. This feature is not connected to the Dream Journal or Daily Rituals.
      </Caption>
    </ScreenBackground>
  );
}
