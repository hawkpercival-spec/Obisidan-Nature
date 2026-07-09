import React, { createContext, useContext, useMemo } from 'react';
import { authClient, signInWithApple, signOut } from './auth';

export type AppUser = { id: string; email?: string | null; name?: string | null } | null;

type AuthCtx = {
  user: AppUser;
  isLoading: boolean;
  signInApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  isLoading: true,
  signInApple: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // better-auth exposes a reactive session hook.
  const { data: session, isPending } = authClient.useSession();

  const value = useMemo<AuthCtx>(
    () => ({
      user: session?.user
        ? { id: session.user.id, email: session.user.email, name: session.user.name }
        : null,
      isLoading: isPending,
      signInApple: async () => {
        await signInWithApple();
      },
      signOut: async () => {
        await signOut();
      },
    }),
    [session, isPending],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
