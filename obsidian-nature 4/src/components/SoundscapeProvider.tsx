import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio, InterruptionModeIOS } from 'expo-av';
import { useAuth } from '@/auth/AuthProvider';

/**
 * Ambient cyber-goth soundscape.
 *
 * The bed starts automatically the moment a user is authenticated (no manual
 * play button) and loops continuously for the whole session. iOS "audio"
 * background mode is declared in app.json so it survives backgrounding.
 *
 * Drop a seamless loop at ./assets/audio/obsidian-soundscape.mp3
 * (dark drone + slow industrial pulse works well).
 */
type SoundscapeCtx = { muted: boolean; setMuted: (m: boolean) => void };
const Ctx = createContext<SoundscapeCtx>({ muted: false, setMuted: () => {} });
export const useSoundscape = () => useContext(Ctx);

export function SoundscapeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
      shouldDuckAndroid: true,
    }).catch(() => {});
  }, []);

  // Start on login, stop on logout.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (user && !soundRef.current) {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require('../../assets/audio/obsidian-soundscape.mp3'),
            { isLooping: true, volume: 0.35, shouldPlay: true },
          );
          if (cancelled) {
            await sound.unloadAsync();
            return;
          }
          soundRef.current = sound;
        } catch (e) {
          console.warn('[soundscape] failed to load audio bed', e);
        }
      }
      if (!user && soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    soundRef.current?.setStatusAsync({ volume: muted ? 0 : 0.35 }).catch(() => {});
  }, [muted]);

  useEffect(
    () => () => {
      soundRef.current?.unloadAsync().catch(() => {});
    },
    [],
  );

  return <Ctx.Provider value={{ muted, setMuted: setMutedState }}>{children}</Ctx.Provider>;
}
