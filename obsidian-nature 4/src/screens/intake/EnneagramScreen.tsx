import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenBackground, SectionHeader, Body, PrimaryButton } from '@/components/ui';
import { ForcedChoice, QuestionCard } from '@/components/Questionnaire';
import { PaywallGate } from '@/screens/paywall/PaywallGate';
import { RHETI_ITEMS, scoreEnneagram, enneagramName } from '@/data/enneagram';
import { useAppStore } from '@/store/useAppStore';
import { useTransition } from '@/components/TransitionProvider';

/** RHETI-style enneagram assessment (paid section for under-70). */
export function EnneagramScreen() {
  const nav = useNavigation<any>();
  const { transition } = useTransition();
  const setEnneagram = useAppStore((s) => s.setEnneagram);
  const [choices, setChoices] = useState<Record<string, 'a' | 'b'>>({});

  const done = Object.keys(choices).length === RHETI_ITEMS.length;

  const onNext = () => {
    const result = scoreEnneagram(choices);
    setEnneagram(result);
    transition(() => nav.navigate('Cognition'), `You carry the fixation of the ${enneagramName(result.type)}.`);
  };

  return (
    <PaywallGate>
      <ScreenBackground>
        <SectionHeader title="Enneagram — RHETI" sigil="mirror" />
        <Body>Choose the statement that fits you better, even if neither is perfect.</Body>
        {RHETI_ITEMS.map((item, i) => (
          <QuestionCard key={item.id} prompt={`${i + 1}.`}>
            <ForcedChoice
              a={item.a.text}
              b={item.b.text}
              value={choices[item.id]}
              onChange={(v) => setChoices((c) => ({ ...c, [item.id]: v }))}
            />
          </QuestionCard>
        ))}
        <PrimaryButton label="Score & continue" onPress={onNext} disabled={!done} />
      </ScreenBackground>
    </PaywallGate>
  );
}
