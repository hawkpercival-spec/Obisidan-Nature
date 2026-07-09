import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { GlassCard, Body, Caption } from './ui';
import { palette, radius, spacing } from '@/theme/theme';

/** 1–5 Likert selector. */
export function Likert({
  value,
  onChange,
}: {
  value?: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={styles.likert}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable
          key={n}
          onPress={() => onChange(n)}
          style={[styles.dot, value === n && styles.dotActive]}
        >
          <Body style={{ color: value === n ? palette.voidBlack : palette.textMuted, marginBottom: 0 }}>{n}</Body>
        </Pressable>
      ))}
    </View>
  );
}

/** Two-option forced choice (RHETI). */
export function ForcedChoice({
  a,
  b,
  value,
  onChange,
}: {
  a: string;
  b: string;
  value?: 'a' | 'b';
  onChange: (v: 'a' | 'b') => void;
}) {
  return (
    <View style={{ gap: spacing.sm }}>
      {(['a', 'b'] as const).map((k) => (
        <Pressable
          key={k}
          onPress={() => onChange(k)}
          style={[styles.choice, value === k && styles.choiceActive]}
        >
          <Body style={{ marginBottom: 0 }}>{k === 'a' ? a : b}</Body>
        </Pressable>
      ))}
    </View>
  );
}

export function TextField({
  value,
  onChange,
  placeholder,
  multiline = true,
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={palette.textFaint}
      multiline={multiline}
      style={styles.input}
    />
  );
}

export function QuestionCard({
  prompt,
  helper,
  children,
}: {
  prompt: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard>
      <Body style={{ marginBottom: helper ? 2 : spacing.sm }}>{prompt}</Body>
      {helper ? <Caption style={{ marginBottom: spacing.sm }}>{helper}</Caption> : null}
      {children}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  likert: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  dot: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.glassStroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: { backgroundColor: palette.aero, borderColor: palette.aero },
  choice: {
    borderWidth: 1,
    borderColor: palette.glassStroke,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  choiceActive: { borderColor: palette.daggerRed, backgroundColor: 'rgba(179,18,30,0.15)' },
  input: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: palette.glassStroke,
    borderRadius: radius.md,
    padding: spacing.md,
    color: palette.textPrimary,
    textAlignVertical: 'top',
    fontSize: 15,
  },
});
