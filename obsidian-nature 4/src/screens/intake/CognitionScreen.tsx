import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenBackground, SectionHeader, Body, PrimaryButton } from '@/components/ui';
import { Likert, QuestionCard } from '@/components/Questionnaire';
import { PaywallGate } from '@/screens/paywall/PaywallGate';
import { COGNITION_ITEMS, scoreCognition } from '@/data/cognition';
import { useAppStore } from '@/store/useAppStore';
import { useTransition } from '@/components/TransitionProvider';

/** Jungian cognition-type test (paid section for under-70). */
export function CognitionScreen() {
  const nav = useNavigation<any>();
  const { transition } = useTransition();
  const setCognition = useAppStore((s) => s.setCognition);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const done = Object.keys(answers).length === COGNITION_ITEMS.length;
  const onNext = () => {
    const r = scoreCognition(answers);
    setCognition(r);
    transition(() => nav.navigate('Temperament'), `Your dominant function has been read.`);
  };

  return (
    <PaywallGate>
      <ScreenBackground>
        <SectionHeader title="Jungian Cognition Type" sigil="mirror" />
        <Body>Rate each statement: 1 = strongly agree, 5 = strongly disagree.</Body>
        {COGNITION_ITEMS.map((item) => (
          <QuestionCard key={item.id} prompt={item.text}>
            <Likert value={answers[item.id]} onChange={(v) => setAnswers((a) => ({ ...a, [item.id]: v }))} />
          </QuestionCard>
        ))}
        <PrimaryButton label="Score & continue" onPress={onNext} disabled={!done} />
      </ScreenBackground>
    </PaywallGate>
  );
}
