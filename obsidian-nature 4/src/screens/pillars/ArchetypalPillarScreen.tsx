import React, { useState } from 'react';
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
import { ARCHETYPES, Archetype, INDIVIDUATION } from '@/data/archetypes';
import { getPillar } from '@/data/pillars';
import { analyzeArchetypalPattern } from '@/analysis/remote';
import { useAppStore, analysisTone } from '@/store/useAppStore';
import { LacanianReport } from '@/types';
import { palette, radius, spacing } from '@/theme/theme';

/**
 * Pillar II — The Archetypal.
 *
 * Reached by tapping Pillar 2 in the Codex (the Seven Pillars / home view);
 * PillarDetailScreen delegates id === 2 here. Three sections:
 *   1. Archetypal Pattern Recognition — free-text + "Analyze through Jungian
 *      Lens" → generated Jungian pattern-analysis report.
 *   2. Major Jungian Archetypes — a gallery, each with a description (and its
 *      shadow form) in the card.
 *   3. The Process of Individuation — the four movements toward the Self.
 */
export function ArchetypalPillarScreen() {
  const nav = useNavigation<any>();
  const pillar = getPillar(2);
  const tone = useAppStore(analysisTone);
  const store = useAppStore();
  const prog = store.pillars.find((p) => p.id === 2)!;

  const [reflection, setReflection] = useState('');
  const [analysing, setAnalysing] = useState(false);
  const [report, setReport] = useState<LacanianReport | null>(prog.reports.at(-1) ?? null);
  const [openId, setOpenId] = useState<string | null>(null);

  const analyze = async () => {
    if (!reflection.trim() || analysing) return;
    setAnalysing(true);
    try {
      const r = await analyzeArchetypalPattern(tone, reflection);
      setReport(r);
      store.addPillarReport(2, r); // folds into the Progress Report
      if (!prog.startedAt) store.startPillar(2);
    } finally {
      setAnalysing(false);
    }
  };

  const structural = ARCHETYPES.filter((a) => a.group === 'structural');
  const figures = ARCHETYPES.filter((a) => a.group === 'figure');

  return (
    <ScreenBackground>
      {/* header */}
      <View style={{ alignItems: 'center', marginBottom: spacing.md }}>
        <Sigil name="archetype" size={84} color={palette.emberRed} />
        <Title style={{ marginTop: spacing.sm, textAlign: 'center' }}>II · The Archetypal</Title>
        <Caption style={{ textAlign: 'center', maxWidth: 320 }}>
          Discover universal patterns in the collective unconscious. Engage with Jungian archetypes,
          individuation, and the journey toward wholeness.
        </Caption>
      </View>

      {/* 1 — Archetypal Pattern Recognition */}
      <SectionHeader title="Archetypal Pattern Recognition" sigil="mirror" />
      <GlassCard>
        <Body>
          Reflect on your experiences, dreams, or life patterns. Discover which archetypes are active in
          your psyche.
        </Body>
        <TextField
          value={reflection}
          onChange={setReflection}
          placeholder="Describe a pattern, dream, or experience — uncensored…"
        />
        <PrimaryButton
          label={analysing ? 'Reading the pattern…' : 'Analyze through Jungian Lens'}
          onPress={analyze}
          loading={analysing}
          disabled={!reflection.trim()}
        />
      </GlassCard>

      {report && (
        <>
          <Caption style={{ color: palette.candleGold, marginBottom: spacing.sm }}>YOUR ANALYSIS</Caption>
          <ReportView report={report} />
        </>
      )}

      {/* 2 — Major Jungian Archetypes */}
      <SectionHeader title="Major Jungian Archetypes" sigil="archetype" />
      <Caption style={{ marginBottom: spacing.sm }}>
        Universal patterns and images from the collective unconscious that shape human experience. Tap a
        card to read its shadow form.
      </Caption>

      <Caption style={{ color: palette.aero, letterSpacing: 2, marginBottom: spacing.sm }}>
        STRUCTURAL ARCHETYPES
      </Caption>
      {structural.map((a) => (
        <ArchetypeCard key={a.id} a={a} open={openId === a.id} onToggle={() => setOpenId(openId === a.id ? null : a.id)} />
      ))}

      <Caption style={{ color: palette.aero, letterSpacing: 2, marginTop: spacing.sm, marginBottom: spacing.sm }}>
        ARCHETYPAL FIGURES & IMAGES
      </Caption>
      {figures.map((a) => (
        <ArchetypeCard key={a.id} a={a} open={openId === a.id} onToggle={() => setOpenId(openId === a.id ? null : a.id)} />
      ))}

      {/* 3 — The Process of Individuation */}
      <SectionHeader title="The Process of Individuation" sigil="seal" />
      <GlassCard>
        <Body>
          Individuation is Jung’s term for the lifelong process of becoming one’s true self. It involves:
        </Body>
      </GlassCard>
      {INDIVIDUATION.map((stage) => (
        <GlassCard key={stage.n}>
          <View style={styles.stageRow}>
            <View style={styles.num}>
              <Title style={{ marginBottom: 0, color: palette.emberRed }}>{stage.n}</Title>
            </View>
            <View style={{ flex: 1 }}>
              <Body style={{ color: palette.bone, marginBottom: 4 }}>{stage.title}</Body>
              <Caption style={{ color: palette.parchment }}>{stage.body}</Caption>
            </View>
          </View>
        </GlassCard>
      ))}

      {/* completion / return */}
      <View style={{ marginTop: spacing.md }}>
        {report ? (
          <PrimaryButton
            label={prog.completedAt ? 'Return to the Codex' : 'Seal Pillar II'}
            variant="ritual"
            onPress={() => {
              if (!prog.completedAt) store.completePillar(2);
              nav.goBack();
            }}
          />
        ) : (
          <PrimaryButton label="Return to the Codex" variant="ghost" onPress={() => nav.goBack()} />
        )}
      </View>
    </ScreenBackground>
  );
}

function ArchetypeCard({ a, open, onToggle }: { a: Archetype; open: boolean; onToggle: () => void }) {
  return (
    <Pressable onPress={onToggle}>
      <GlassCard glow={open}>
        <View style={styles.archRow}>
          <Title style={{ marginBottom: 0, color: palette.candleGold }}>{a.glyph}</Title>
          <View style={{ flex: 1 }}>
            <Body style={{ color: palette.bone, marginBottom: 4 }}>{a.name}</Body>
            <Caption style={{ color: palette.parchment }}>{a.description}</Caption>
            {open && (
              <Caption style={{ color: palette.emberRed, marginTop: spacing.sm }}>
                Shadow form: {a.shadow}
              </Caption>
            )}
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  archRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stageRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  num: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.daggerRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
