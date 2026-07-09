import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LacanianReport } from '@/types';
import { GlassCard, Body, Caption, Title } from './ui';
import { Sigil } from './Sigil';
import { palette, spacing } from '@/theme/theme';

/** Renders any Lacanian report (intake, per-pillar formulation, archetype, homework grade). */
export function ReportView({ report }: { report: LacanianReport }) {
  return (
    <GlassCard glow>
      <View style={styles.head}>
        <Sigil name={report.grade ? 'seal' : 'lack'} size={44} />
        <View style={{ flex: 1 }}>
          <Title style={{ marginBottom: 2 }}>{report.title}</Title>
          <Caption>
            {report.tone === 'clinician' ? 'Clinician-facing formulation' : 'Self-analysis'} ·{' '}
            {new Date(report.createdAt).toLocaleDateString()}
          </Caption>
        </View>
      </View>

      {report.grade && (
        <View style={styles.gradeRow}>
          <GradeBadge letter={report.grade.letter} />
          <View style={{ flex: 1 }}>
            <Caption>Imaginary {report.grade.registers.imaginary} · Symbolic {report.grade.registers.symbolic} · Real {report.grade.registers.real}</Caption>
          </View>
        </View>
      )}

      <Body style={{ marginTop: spacing.sm }}>{report.narrative}</Body>

      {report.focusAreas?.length > 0 && (
        <View style={{ marginTop: spacing.md }}>
          <Caption style={{ color: palette.candleGold, marginBottom: 4 }}>FOCUS</Caption>
          {report.focusAreas.map((f, i) => (
            <Body key={i} style={styles.focus}>
              ▸ {f}
            </Body>
          ))}
        </View>
      )}
    </GlassCard>
  );
}

function GradeBadge({ letter }: { letter: string }) {
  const color =
    letter === 'A' ? palette.success : letter === 'Incomplete' || letter === 'D' ? palette.danger : palette.candleGold;
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Title style={{ color, marginBottom: 0 }}>{letter}</Title>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', marginBottom: spacing.sm },
  gradeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.sm },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focus: { marginBottom: 2, color: palette.parchment },
});
