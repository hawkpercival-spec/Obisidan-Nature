import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gradients, palette, radius, spacing, type } from '@/theme/theme';
import { Sigil, SigilName } from './Sigil';

/** Full-bleed obsidian gradient background used by every screen. */
export function ScreenBackground({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const Inner = scroll ? ScrollView : View;
  return (
    <View style={{ flex: 1, backgroundColor: palette.voidBlack }}>
      <LinearGradient colors={gradients.aeroGlass} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <Inner
          style={{ flex: 1 }}
          contentContainerStyle={scroll ? { padding: spacing.lg, paddingBottom: spacing.xxl } : undefined}
        >
          {children}
        </Inner>
      </SafeAreaView>
    </View>
  );
}

/** Frutiger-Aero frosted glass card with a faint aqua stroke. */
export function GlassCard({
  children,
  style,
  glow = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
}) {
  return (
    <BlurView intensity={22} tint="dark" style={[styles.card, glow && styles.cardGlow, style]}>
      {children}
    </BlurView>
  );
}

export function SectionHeader({ title, sigil }: { title: string; sigil?: SigilName }) {
  return (
    <View style={styles.header}>
      {sigil && <Sigil name={sigil} size={40} />}
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}

export function Title({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Body({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Caption({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.caption, style]}>{children}</Text>;
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  variant = 'ritual',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'ritual' | 'aero' | 'ghost';
}) {
  const colors =
    variant === 'aero' ? gradients.aquaBloom : variant === 'ghost' ? (['#111725', '#111725'] as const) : gradients.ritual;
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={{ opacity: disabled ? 0.5 : 1 }}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btn}>
        {loading ? (
          <ActivityIndicator color={palette.bone} />
        ) : (
          <Text style={styles.btnText}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.glassStroke,
    backgroundColor: palette.glassLight,
  },
  cardGlow: {
    borderColor: palette.daggerRed,
    shadowColor: palette.daggerRed,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  headerText: { ...type.title, color: palette.bone },
  title: { ...type.title, color: palette.bone, marginBottom: spacing.sm },
  body: { ...type.body, color: palette.textPrimary, marginBottom: spacing.sm },
  caption: { ...type.caption, color: palette.textMuted },
  btn: {
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: palette.glassStroke,
  },
  btnText: { ...type.section, color: palette.bone, fontSize: 15 },
});
