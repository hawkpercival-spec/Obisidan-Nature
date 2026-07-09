import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

/**
 * better-auth client (Expo).
 *
 * The Apple provider is configured on the SERVER with better-auth's
 * `socialProviders.apple` block. For reference, the server config looks like:
 *
 *   // server/auth.ts
 *   import { betterAuth } from 'better-auth';
 *   export const auth = betterAuth({
 *     socialProviders: {
 *       apple: {
 *         clientId: process.env.APPLE_CLIENT_ID!,     // Services ID
 *         clientSecret: process.env.APPLE_CLIENT_SECRET!,
 *         appBundleIdentifier: 'org.asphodelpress.obsidiannature',
 *         scope: ['email', 'name'],                    // profile + email
 *       },
 *     },
 *     trustedOrigins: ['obsidiannature://'],
 *   });
 *
 * On the client we only point at that server and let the Expo plugin handle
 * the native Sign in with Apple handoff + secure session storage.
 */
const baseURL = (Constants.expoConfig?.extra?.authBaseUrl as string) ?? 'http://localhost:3000';

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    expoClient({
      scheme: 'obsidiannature',
      storagePrefix: 'obsidian_nature',
      storage: SecureStore,
    }),
  ],
});

export async function signInWithApple() {
  // Triggers the native Apple sheet, requesting email + profile (name) scopes.
  return authClient.signIn.social({
    provider: 'apple',
    scopes: ['email', 'name'],
    callbackURL: 'obsidiannature://',
  });
}

export async function signOut() {
  return authClient.signOut();
}
