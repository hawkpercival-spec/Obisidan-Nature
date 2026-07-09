import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenBackground, SectionHeader, Body, PrimaryButton } from '@/components/ui';
import { Likert, QuestionCard } from '@/components/Questionnaire';
import { PaywallGate } from '@/screens/paywall/PaywallGate';
import { TEMPERAMENT_ITEMS, scoreTemperament } from '@/data/temperament';
import { useAppStore } from '@/store/useAppStore';
import { useTransition } from '@/components/TransitionProvider';

/** Medieval four-temperament section (paid section for under-70). */
export function TemperamentScreen() {
  const nav = useNavigation<any>();
  const { transition } = useTransition();
  const setTemperament = useAppStore((s) => s.setTemperament);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const done = Object.keys(answers).length === TEMPERAMENT_ITEMS.length;
  const onNext = () => {
    const r = scoreTemperament(answers);
    setTemperament(r);
    transition(() => nav.navigate('Jungian'), `Your humoral temperament is set.`);
  };

  return (
    <PaywallGate>
      <ScreenBackground>
        <SectionHeader title="Medieval Temperament" sigil="archetype" />
        <Body>The four humours as a personality lens. 1 = strongly agree, 5 = strongly disagree.</Body>
        {TEMPERAMENT_ITEMS.map((item) => (
          <QuestionCard key={item.id} prompt={item.text}>
            <Likert value={answers[item.id]} onChange={(v) => setAnswers((a) => ({ ...a, [item.id]: v }))} />
          </QuestionCard>
        ))}
        <PrimaryButton label="Score & continue" onPress={onNext} disabled={!done} />
      </ScreenBackground>
    </PaywallGate>
  );
}
