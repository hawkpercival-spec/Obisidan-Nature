import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';

/**
 * Reference better-auth server instance.
 *
 * This is the counterpart to src/auth/auth.ts in the app. The Apple provider is
 * configured HERE (the client only points at this server). Wire your real
 * database adapter in place of the in-memory note below.
 */
export const auth = betterAuth({
  // database: <your adapter>,  // e.g. drizzleAdapter(db) / prismaAdapter(db)
  trustedOrigins: ['obsidiannature://'],
  plugins: [expo()],
  socialProviders: {
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!, // Services ID
      clientSecret: process.env.APPLE_CLIENT_SECRET!, // signed JWT
      appBundleIdentifier: 'org.asphodelpress.obsidiannature',
      scope: ['email', 'name'], // profile + email
    },
  },
});
