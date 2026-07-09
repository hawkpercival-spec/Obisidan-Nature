import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenBackground, SectionHeader, Body, PrimaryButton } from '@/components/ui';
import { TextField, QuestionCard } from '@/components/Questionnaire';
import { PaywallGate } from '@/screens/paywall/PaywallGate';
import { INTAKE_JUNGIAN } from '@/data/intake';
import { ArchetypalInput } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { useTransition } from '@/components/TransitionProvider';

/**
 * Jungian archetypal-material intake (favourite media). Feeds the Archetypal
 * Explorations report and Pillar II (The Archetypal) exercises.
 */
export function JungianScreen() {
  const nav = useNavigation<any>();
  const { transition } = useTransition();
  const setArchetypalInput = useAppStore((s) => s.setArchetypalInput);
  const [v, setV] = useState<Record<string, string>>({});

  const done = INTAKE_JUNGIAN.every((q) => (v[q.id] ?? '').length > 0);
  const onNext = () => {
    const input: ArchetypalInput = {
      movies: v.j_movies ?? '',
      books: v.j_books ?? '',
      fairytales: v.j_fairytales ?? '',
      characters: v.j_characters ?? '',
    };
    setArchetypalInput(input);
    transition(() => nav.navigate('IntakeReport'), 'The codex assembles your formulation.');
  };

  return (
    <PaywallGate>
      <ScreenBackground>
        <SectionHeader title="Archetypal Material" sigil="archetype" />
        <Body>
          The stories you love reveal the figures that move through you. Name them; we’ll surface the
          archetypes to work in Pillar II and in your Archetypal Explorations report.
        </Body>
        {INTAKE_JUNGIAN.map((q) => (
          <QuestionCard key={q.id} prompt={q.prompt} helper={q.helper}>
            <TextField value={v[q.id]} onChange={(t) => setV((s) => ({ ...s, [q.id]: t }))} placeholder="Separate with commas…" />
          </QuestionCard>
        ))}
        <PrimaryButton label="Generate my analysis report" onPress={onNext} disabled={!done} />
      </ScreenBackground>
    </PaywallGate>
  );
}
