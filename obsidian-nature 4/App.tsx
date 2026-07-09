import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/auth/AuthProvider';
import { SoundscapeProvider } from '@/components/SoundscapeProvider';
import { RootNavigator } from '@/navigation/RootNavigator';
import { loadFonts } from '@/theme/fonts';
import { initNotifications } from '@/services/notifications';
import { initPurchases } from '@/services/iap';

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Obsidian Nature — "Shed The Psycho and Embrace The Psyche"
 *
 * A patient-facing psychotraumatology / self-analysis companion built around a
 * nigromancy-codex structure and The Percivalian Way (The Seven Pillars).
 *
 * This is the application root. It wires together:
 *   - AuthProvider        (better-auth + Sign in with Apple)
 *   - SoundscapeProvider  (ambient cyber-goth bed, auto-starts on login)
 *   - RootNavigator       (gates: auth -> birth year -> paywall -> intake -> app)
 */
export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await loadFonts();
        await initPurchases();
        await initNotifications();
      } catch (e) {
        // Non-fatal: the app still renders with system fonts / stubbed services.
        console.warn('[bootstrap]', e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const onLayout = useCallback(async () => {
    if (ready) await SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
      <SafeAreaProvider>
        <AuthProvider>
          <SoundscapeProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </SoundscapeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
