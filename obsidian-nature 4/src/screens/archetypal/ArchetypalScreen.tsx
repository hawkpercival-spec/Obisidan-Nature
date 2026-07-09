import React from 'react';
import { ScreenBackground, SectionHeader, Body, Caption, GlassCard } from '@/components/ui';
import { ReportView } from '@/components/ReportView';
import { CodexSealed } from '@/components/LockedScreen';
import { useAppStore } from '@/store/useAppStore';
import { palette, spacing } from '@/theme/theme';

/**
 * Archetypal Explorations.
 *
 * Two sources of material, both live:
 *   - the archetype report generated from the Jungian intake (favourite media), and
 *   - the ongoing work in Pillar II (The Archetypal): every "Analyze through
 *     Jungian Lens" report and the archetypes it surfaces.
 *
 * Because these read straight from the zustand store, the tab updates itself as
 * the user works in Pillar II — no manual refresh.
 */
export function ArchetypalScreen() {
  const intakeReport = useAppStore((s) => s.archetypeReport);
  const pillar2 = useAppStore((s) => s.pillars.find((p) => p.id === 2));
  const pillarReports = [...(pillar2?.reports ?? [])].reverse(); // newest first

  // Union of archetypes surfaced by intake + all Pillar II analyses.
  const surfaced = Array.from(
    new Set([
      ...(intakeReport?.archetypes ?? []),
      ...pillarReports.flatMap((r) => r.archetypes ?? []),
    ]),
  );

  const status = pillar2?.completedAt ? 'Sealed' : pillar2?.startedAt ? 'In progress' : 'Not yet begun';

  if (!intakeReport && pillarReports.length === 0) {
    return (
      <CodexSealed
        title="Archetypal Explorations"
        message="Complete the Jungian section of your intake, or begin Pillar II (The Archetypal), to surface your archetypal field."
      />
    );
  }

  return (
    <ScreenBackground>
      <SectionHeader title="Archetypal Explorations" sigil="archetype" />

      {/* Pillar II live status */}
      <GlassCard glow>
        <Caption style={{ color: palette.candleGold }}>PILLAR II · THE ARCHETYPAL</Caption>
        <Body style={{ marginTop: 4 }}>
          {status}
          {pillarReports.length > 0 ? ` · ${pillarReports.length} analysis${pillarReports.length > 1 ? 'es' : ''} recorded` : ''}
        </Body>
      </GlassCard>

      {/* Consolidated archetypes to take to an analyst */}
      {surfaced.length > 0 && (
        <GlassCard>
          <Caption style={{ color: palette.candleGold, marginBottom: spacing.sm }}>
            ARCHETYPES TO TAKE TO YOUR ANALYST
          </Caption>
          {surfaced.map((a) => (
            <Body key={a} style={{ color: palette.parchment, marginBottom: 4 }}>
              ✶ {a}
            </Body>
          ))}
        </GlassCard>
      )}

      {/* Intake-derived report */}
      {intakeReport && (
        <>
          <SectionHeader title="From Your Intake" sigil="lack" />
          <ReportView report={intakeReport} />
        </>
      )}

      {/* Live Pillar II analyses (newest first) */}
      {pillarReports.length > 0 && (
        <>
          <SectionHeader title="From Pillar II" sigil="mirror" />
          {pillarReports.map((r) => (
            <ReportView key={r.id} report={r} />
          ))}
        </>
      )}
    </ScreenBackground>
  );
}
