import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenBackground, Title, Body, Caption, GlassCard } from '@/components/ui';
import { Sigil } from '@/components/Sigil';
import { useTransition } from '@/components/TransitionProvider';
import { PILLARS, DAYS_PER_PILLAR } from '@/data/pillars';
import { useAppStore } from '@/store/useAppStore';
import { palette, radius, spacing } from '@/theme/theme';

/**
 * The Codex — home. Displays The Percivalian Way (The Seven Pillars) as a
 * sequential codex; each pillar unlocks when the prior one is complete.
 */
export function CodexScreen() {
  const nav = useNavigation<any>();
  const { transition } = useTransition();
  const pillars = useAppStore((s) => s.pillars);

  const completed = pillars.filter((p) => p.completedAt).length;
  const dayTotal = pillars.reduce((n, p) => n + p.currentDay, 0);

  const firstIncomplete = pillars.find((p) => !p.completedAt)?.id ?? 7;

  return (
    <ScreenBackground>
      <View style={{ alignItems: 'center', marginBottom: spacing.md }}>
        <Sigil name="seal" size={72} />
        <Title style={{ marginTop: spacing.sm }}>The Codex</Title>
        <Caption>The Percivalian Way — The Seven Pillars</Caption>
      </View>

      <GlassCard>
        <Caption>YEAR-LONG ARC</Caption>
        <Body style={{ marginTop: 4 }}>
          {completed}/7 pillars sealed · Day {dayTotal} of ~365
        </Body>
        <View style={styles.bar}>
          <View style={[styles.fill, { width: `${Math.min((dayTotal / 365) * 100, 100)}%` }]} />
        </View>
      </GlassCard>

      {PILLARS.map((p) => {
        const prog = pillars.find((x) => x.id === p.id)!;
        const locked = p.id > firstIncomplete && !prog.startedAt;
        const sealed = !!prog.completedAt;
        return (
          <Pressable
            key={p.id}
            disabled={locked}
            onPress={() =>
              transition(() => {
                // Pillars I and II have dedicated screens; the rest share PillarDetail.
                if (p.id === 1) nav.navigate('SelfPillar');
                else if (p.id === 2) nav.navigate('ArchetypalPillar');
                else if (p.id === 3) nav.navigate('TemperamentPillar');
                else nav.navigate('PillarDetail', { id: p.id });
              }, p.summary)
            }
          >
            <GlassCard glow={p.id === firstIncomplete} style={locked ? { opacity: 0.45 } : undefined}>
              <View style={styles.row}>
                <Sigil name={p.sigil} size={52} color={sealed ? palette.candleGold : palette.emberRed} />
                <View style={{ flex: 1 }}>
                  <Title style={{ marginBottom: 2 }}>
                    {roman(p.id)}. {p.name}
                  </Title>
                  <Caption>{p.subtitle}</Caption>
                  <Caption style={{ marginTop: 4, color: sealed ? palette.success : palette.textMuted }}>
                    {sealed
                      ? '✦ Sealed'
                      : locked
                        ? 'Locked'
                        : prog.startedAt
                          ? `In progress · day ${prog.currentDay}/${DAYS_PER_PILLAR}`
                          : 'Ready to begin'}
                  </Caption>
                </View>
              </View>
            </GlassCard>
          </Pressable>
        );
      })}
    </ScreenBackground>
  );
}

function roman(n: number) {
  return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][n - 1] ?? String(n);
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  bar: { height: 6, backgroundColor: palette.ash, borderRadius: radius.pill, marginTop: spacing.sm, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: palette.daggerRed, borderRadius: radius.pill },
});
