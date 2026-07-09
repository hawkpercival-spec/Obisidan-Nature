import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { ScreenBackground, Title, Body, Caption, PrimaryButton, GlassCard } from '@/components/ui';
import { TextField } from '@/components/Questionnaire';
import { useAppStore, usesElderInventoryWindow, isElderTrack } from '@/store/useAppStore';
import { scheduleNightlyInventory, clampElderTime } from '@/services/notifications';
import { palette, radius, spacing } from '@/theme/theme';

/**
 * Birth YEAR only (never full birth date). We compute an age band and flag:
 *   - 67–100: nightly inventory moves to a chosen time in the 7:00–8:30pm window
 *   - 70–100: elder track (end-of-life integration content) + no paywall
 */
export function BirthYearScreen() {
  const setBirthYear = useAppStore((s) => s.setBirthYear);
  const setElderInventoryTime = useAppStore((s) => s.setElderInventoryTime);
  const [year, setYear] = useState('');

  const age = useMemo(() => {
    const y = parseInt(year, 10);
    if (!y || y < 1900 || y > new Date().getFullYear()) return undefined;
    return new Date().getFullYear() - y;
  }, [year]);

  // Elder time picker (19:00–20:30) shown only for the 67–100 band.
  const [hour, setHour] = useState(19);
  const [minute, setMinute] = useState(30);
  const showElderTime = usesElderInventoryWindow(age);

  const onContinue = async () => {
    const y = parseInt(year, 10);
    setBirthYear(y);
    if (showElderTime) {
      const t = clampElderTime(hour, minute);
      setElderInventoryTime(t);
      await scheduleNightlyInventory(age!, t);
    }
    // Root navigator advances to Intake automatically once birthYear is set.
  };

  return (
    <ScreenBackground>
      <Title>Before the codex opens</Title>
      <Body>
        Enter your year of birth only. We record the year to place you in the right track — never your full
        date of birth.
      </Body>

      <GlassCard>
        <Caption style={{ marginBottom: spacing.sm }}>YEAR OF BIRTH</Caption>
        <TextField value={year} onChange={(t) => setYear(t.replace(/[^0-9]/g, '').slice(0, 4))} placeholder="e.g. 1958" multiline={false} />
        {age !== undefined && <Caption style={{ marginTop: spacing.sm }}>Age band: {age} years</Caption>}
      </GlassCard>

      {isElderTrack(age) && (
        <GlassCard glow>
          <Body>
            You’ll be placed on the elder track: alongside the pillars you’ll receive end-of-life
            integration work drawn from Jungian, Freudian, Lacanian and relevant Eriksonian frames — and
            the app is free for you.
          </Body>
        </GlassCard>
      )}

      {showElderTime && (
        <GlassCard>
          <Caption style={{ marginBottom: spacing.sm }}>NIGHTLY INVENTORY TIME (7:00–8:30 PM)</Caption>
          <View style={styles.timeRow}>
            {[
              { h: 19, m: 0 },
              { h: 19, m: 30 },
              { h: 20, m: 0 },
              { h: 20, m: 30 },
            ].map(({ h, m }) => {
              const active = hour === h && minute === m;
              return (
                <Pressable
                  key={`${h}:${m}`}
                  onPress={() => {
                    setHour(h);
                    setMinute(m);
                  }}
                  style={[styles.timeChip, active && styles.timeChipActive]}
                >
                  <Body style={{ marginBottom: 0, color: active ? palette.voidBlack : palette.textPrimary }}>
                    {fmt(h, m)}
                  </Body>
                </Pressable>
              );
            })}
          </View>
        </GlassCard>
      )}

      <PrimaryButton label="Enter" onPress={onContinue} disabled={age === undefined} />
    </ScreenBackground>
  );
}

function fmt(h: number, m: number) {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${m.toString().padStart(2, '0')} ${suffix}`;
}

const styles = StyleSheet.create({
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  timeChip: {
    borderWidth: 1,
    borderColor: palette.glassStroke,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  timeChipActive: { backgroundColor: palette.aero, borderColor: palette.aero },
});
