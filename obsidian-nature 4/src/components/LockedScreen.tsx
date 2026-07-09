import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenBackground, Title, Body, Caption } from './ui';
import { Sigil } from './Sigil';
import { palette, spacing } from '@/theme/theme';

/** The "Codex Sealed" gate used by locked features (e.g. Daily Ritual before pillars complete). */
export function CodexSealed({
  title = 'The Codex Is Sealed',
  message,
  disclaimer,
}: {
  title?: string;
  message: string;
  disclaimer?: string;
}) {
  return (
    <ScreenBackground scroll={false}>
      <View style={styles.center}>
        <Sigil name="seal" size={120} color={palette.oxblood} glow={palette.daggerRed} />
        <Title style={{ marginTop: spacing.lg, textAlign: 'center' }}>{title}</Title>
        <Body style={{ textAlign: 'center', marginTop: spacing.sm }}>{message}</Body>
        {disclaimer ? (
          <Caption style={{ textAlign: 'center', marginTop: spacing.md, maxWidth: 300 }}>{disclaimer}</Caption>
        ) : null}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
});
