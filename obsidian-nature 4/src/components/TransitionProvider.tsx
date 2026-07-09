import React, { createContext, useCallback, useContext, useState } from 'react';
import { View } from 'react-native';
import { AscorpLoadingScreen } from './AscorpLoadingScreen';

/**
 * Global ASCORP loading overlay shown between page transitions.
 *
 * Usage inside any screen:
 *   const { transition } = useTransition();
 *   transition(() => navigation.navigate('PillarDetail', { id }));
 *
 * The overlay covers the screen for a full 10s (the dagger bloom) and then
 * runs the queued navigation action.
 */
type TransitionCtx = { transition: (action: () => void, quote?: string) => void };
const Ctx = createContext<TransitionCtx>({ transition: (a) => a() });
export const useTransition = () => useContext(Ctx);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [pending, setPending] = useState<{ action: () => void; quote?: string } | null>(null);

  const transition = useCallback((action: () => void, quote?: string) => {
    setPending({ action, quote });
    setActive(true);
  }, []);

  const onDone = useCallback(() => {
    setActive(false);
    pending?.action();
    setPending(null);
  }, [pending]);

  return (
    <Ctx.Provider value={{ transition }}>
      <View style={{ flex: 1 }}>{children}</View>
      {active && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}>
          <AscorpLoadingScreen duration={10000} onDone={onDone} quote={pending?.quote} />
        </View>
      )}
    </Ctx.Provider>
  );
}
