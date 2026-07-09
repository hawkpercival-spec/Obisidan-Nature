import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenBackground, Title, Body, Caption, PrimaryButton, GlassCard } from '@/components/ui';
import { Sigil } from '@/components/Sigil';
import { useAppStore, isPaywalled } from '@/store/useAppStore';
import { purchaseSubscription, restorePurchases, iapPlatformNote, SUBSCRIPTION_PRICE } from '@/services/iap';
import { palette, spacing } from '@/theme/theme';

/**
 * Wraps paid content. Under-70 users who are not subscribed see the $5.99/month
 * subscription. 70+ users always pass through free.
 *
 * The free opening intake inventory is NOT wrapped by this gate — only the
 * Enneagram / Cognition / Temperament / Jungian sections and the rest of the app.
 */
export function PaywallGate({ children }: { children: React.ReactNode }) {
  const paywalled = useAppStore(isPaywalled);
  const setFullAccess = useAppStore((s) => s.setFullAccess);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!paywalled) return <>{children}</>;

  const buy = async () => {
    setBusy(true);
    setError(null);
    try {
      const ok = await purchaseSubscription();
      if (ok) setFullAccess(true);
      else setError('Subscription did not complete.');
    } catch (e: any) {
      if (!e?.userCancelled) setError('Something went wrong starting the subscription.');
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    setBusy(true);
    try {
      const ok = await restorePurchases();
      if (ok) setFullAccess(true);
      else setError('No previous purchase found to restore.');
    } catch {
      setError('Restore failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.center}>
        <Sigil name="threshold" size={100} />
        <Title style={{ marginTop: spacing.lg, textAlign: 'center' }}>The Threshold</Title>
        <Body style={{ textAlign: 'center' }}>
          You’ve completed the opening inventory. Unlock the full codex — the assessments, your Lacanian
          analysis report, and The Seven Pillars.
        </Body>

        <GlassCard glow style={{ width: '100%', marginTop: spacing.md }}>
          <Title style={{ textAlign: 'center' }}>{SUBSCRIPTION_PRICE}</Title>
          <Caption style={{ textAlign: 'center', marginBottom: spacing.md }}>
            Monthly subscription · {iapPlatformNote}
          </Caption>
          <PrimaryButton label={busy ? 'Processing…' : 'Subscribe'} onPress={buy} loading={busy} />
          <PrimaryButton label="Restore Subscription" variant="ghost" onPress={restore} />
          {error && <Caption style={{ color: palette.danger, textAlign: 'center', marginTop: spacing.sm }}>{error}</Caption>}
        </GlassCard>

        <Caption style={{ textAlign: 'center', marginTop: spacing.md, maxWidth: 320 }}>
          Members aged 70+ receive full access at no charge.
        </Caption>
        <Caption style={{ textAlign: 'center', marginTop: spacing.sm, maxWidth: 320, color: palette.textFaint }}>
          Payment is charged to your {iapPlatformNote} account at confirmation. The subscription
          auto-renews at {SUBSCRIPTION_PRICE} unless cancelled at least 24 hours before the end of the
          current period. Manage or cancel anytime in your account settings.
        </Caption>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', paddingTop: spacing.xl },
});
