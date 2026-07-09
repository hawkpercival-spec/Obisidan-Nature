import React, { useState } from 'react';
import { View } from 'react-native';
import { ScreenBackground, SectionHeader, Title, Body, Caption, PrimaryButton, GlassCard } from '@/components/ui';
import { TextField } from '@/components/Questionnaire';
import { CodexSealed } from '@/components/LockedScreen';
import { useAppStore, analysisTone, canAccessDreamJournal } from '@/store/useAppStore';
import { analyseDream } from '@/analysis/remote';
import { DreamEntry } from '@/types';
import { palette, spacing } from '@/theme/theme';

/**
 * Dream Journal — structured by the Jungian dream stages (exposition,
 * development/peripeteia, lysis). On save, the entry is analysed into working
 * material (highlights, symbol amplifications, stage map) for the analyst.
 *
 * Unlocks after the intake module (independent of the Seven Pillars). Enter
 * dreams each morning, update through the day. Separate from Nightly Inventory.
 */
export function DreamJournalScreen() {
  const unlocked = useAppStore(canAccessDreamJournal);
  const store = useAppStore();
  const tone = useAppStore(analysisTone);
  const [draft, setDraft] = useState({ title: '', raw: '', exposition: '', peripeteia: '', lysis: '' });
  const [saving, setSaving] = useState(false);

  if (!unlocked) {
    return (
      <CodexSealed
        title="The Dream Journal Is Sealed"
        message="Complete your intake module to begin recording and working your dreams."
      />
    );
  }

  const save = async () => {
    if (!draft.raw.trim() || saving) return;
    setSaving(true);
    try {
      const now = Date.now();
      const entry: DreamEntry = {
        id: Math.random().toString(36).slice(2),
        createdAt: now,
        updatedAt: now,
        title: draft.title || 'Untitled dream',
        raw: draft.raw,
        exposition: draft.exposition,
        peripeteia: draft.peripeteia,
        lysis: draft.lysis,
      };
      entry.analysis = await analyseDream(entry, tone);
      store.addDream(entry);
      setDraft({ title: '', raw: '', exposition: '', peripeteia: '', lysis: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenBackground>
      <SectionHeader title="Dream Journal" sigil="dream" />
      <Body>Record it while it’s fresh. Fill what you can; the analysis works from whatever you give it.</Body>

      <GlassCard>
        <Caption>TITLE</Caption>
        <TextField value={draft.title} onChange={(t) => setDraft({ ...draft, title: t })} placeholder="Name the dream…" multiline={false} />
        <Caption style={{ marginTop: spacing.sm }}>THE DREAM (raw)</Caption>
        <TextField value={draft.raw} onChange={(t) => setDraft({ ...draft, raw: t })} placeholder="Tell it as it happened…" />
        <Caption style={{ marginTop: spacing.sm }}>EXPOSITION — setting, cast, opening mood</Caption>
        <TextField value={draft.exposition} onChange={(t) => setDraft({ ...draft, exposition: t })} />
        <Caption style={{ marginTop: spacing.sm }}>DEVELOPMENT — the turn or complication</Caption>
        <TextField value={draft.peripeteia} onChange={(t) => setDraft({ ...draft, peripeteia: t })} />
        <Caption style={{ marginTop: spacing.sm }}>LYSIS — resolution, or where it broke off</Caption>
        <TextField value={draft.lysis} onChange={(t) => setDraft({ ...draft, lysis: t })} />
        <PrimaryButton label={saving ? 'Analysing…' : 'Record & analyse'} onPress={save} loading={saving} />
      </GlassCard>

      {store.dreams.length > 0 && <SectionHeader title="Your Dreams" sigil="lack" />}
      {store.dreams.map((d) => (
        <GlassCard key={d.id} glow>
          <Title style={{ marginBottom: 2 }}>{d.title}</Title>
          <Caption>{new Date(d.createdAt).toLocaleDateString()}</Caption>
          {d.analysis && (
            <View style={{ marginTop: spacing.sm }}>
              <Body>{d.analysis.summary}</Body>
              {d.analysis.highlights.map((h, i) => (
                <Body key={i} style={{ color: palette.parchment, marginTop: 6 }}>
                  “{h.fragment}” — {h.note}
                </Body>
              ))}
              {d.analysis.symbols.map((s, i) => (
                <Caption key={i} style={{ color: palette.candleGold, marginTop: 4 }}>
                  {s.symbol}: {s.amplification}
                </Caption>
              ))}
            </View>
          )}
        </GlassCard>
      ))}
    </ScreenBackground>
  );
}
