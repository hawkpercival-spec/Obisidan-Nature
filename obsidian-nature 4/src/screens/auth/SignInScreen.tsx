import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { ScreenBackground, Title, Body, Caption, PrimaryButton } from '@/components/ui';
import { Sigil } from '@/components/Sigil';
import { useAuth } from '@/auth/AuthProvider';
import { palette, spacing, type } from '@/theme/theme';
import { Text } from 'react-native';

/**
 * Login. Sign in with Apple (better-auth Apple provider, email + profile scopes).
 * The ambient soundscape and any paywall only begin AFTER a successful login.
 */
export function SignInScreen() {
  const { signInApple } = useAuth();
  const [loading, setLoading] = useState(false);

  const onApple = async () => {
    setLoading(true);
    try {
      await signInApple();
    } catch (e) {
      console.warn('[signin]', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground scroll={false}>
      <View style={styles.wrap}>
        <Sigil name="lack" size={110} />
        <Text style={styles.title}>OBSIDIAN{'\n'}NATURE</Text>
        <Caption style={styles.tag}>Shed The Psycho and Embrace The Psyche</Caption>

        <Body style={styles.blurb}>
          A private codex for self-analysis — The Percivalian Way, The Seven Pillars — for the work you
          do between sessions, or as you train to become an analyst.
        </Body>

        <View style={{ width: '100%', marginTop: spacing.xl }}>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
            cornerRadius={999}
            style={styles.appleBtn}
            onPress={onApple}
          />
          <PrimaryButton label={loading ? 'Opening the codex…' : 'Continue'} onPress={onApple} loading={loading} />
        </View>

        <Caption style={styles.legal}>
          By continuing you agree that Obsidian Nature is a self-reflection tool and not a substitute for
          professional mental-health care.
        </Caption>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { ...type.hero, color: palette.bone, textAlign: 'center', marginTop: spacing.lg, lineHeight: 40 },
  tag: { color: palette.emberRed, marginTop: spacing.sm, letterSpacing: 1, textAlign: 'center' },
  blurb: { textAlign: 'center', color: palette.parchment, marginTop: spacing.lg, maxWidth: 320 },
  appleBtn: { height: 50, marginBottom: spacing.sm },
  legal: { textAlign: 'center', marginTop: spacing.lg, maxWidth: 300, color: palette.textFaint },
});
