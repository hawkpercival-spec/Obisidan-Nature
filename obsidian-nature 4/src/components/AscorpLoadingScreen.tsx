import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Polygon,
  Rect,
  Line,
  G,
} from 'react-native-svg';
import { palette, type } from '@/theme/theme';

const { width } = Dimensions.get('window');
const DAGGER_W = Math.min(width * 0.6, 240);

/**
 * ASCORP transition / loading screen.
 *
 * Techno-horror interstitial in the spirit of the "Red Rose" bloom loader:
 * a 3D-morphic red dagger blooms open on the void, "ASCORP" set in a medieval
 * blackletter face above it (this replaced the earlier rune ring), an ominous
 * quote beneath, and "LOVES YOU" tucked just under the quote — close to it,
 * clear of the very bottom of the screen.
 *
 * Displays for a full `duration` (default 10s) so the graphics resolve, then
 * calls `onDone`.
 */
export function AscorpLoadingScreen({
  duration = 10000,
  onDone,
  quote = 'What you bury does not die. It waits in your obsidian nature.',
}: {
  duration?: number;
  onDone?: () => void;
  quote?: string;
}) {
  const bloom = useSharedValue(0); // 0 -> 1 morph/open
  const pulse = useSharedValue(0);
  const glitch = useSharedValue(0);

  useEffect(() => {
    bloom.value = withTiming(1, { duration: 2200, easing: Easing.out(Easing.cubic) });
    pulse.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }), -1, true);
    glitch.value = withRepeat(
      withSequence(withTiming(1, { duration: 90 }), withTiming(0, { duration: 900 })),
      -1,
      false,
    );

    const t = setTimeout(() => onDone && runOnJS(onDone)(), duration);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const daggerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(bloom.value, [0, 0.4, 1], [0, 0.7, 1]),
    transform: [
      { perspective: 700 },
      { scale: interpolate(bloom.value, [0, 1], [0.55, 1]) },
      { rotateX: `${interpolate(bloom.value, [0, 1], [70, 0])}deg` },
      { rotateZ: `${interpolate(pulse.value, [0, 1], [-1.5, 1.5])}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.25, 0.6]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.9, 1.15]) }],
  }));

  const glitchStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(glitch.value, [0, 1], [0, 2]) }],
    opacity: interpolate(glitch.value, [0, 1], [1, 0.82]),
  }));

  return (
    <View style={styles.root}>
      {/* radial bloom behind the blade */}
      <Animated.View style={[styles.glow, glowStyle]}>
        <Svg width={DAGGER_W * 2.2} height={DAGGER_W * 2.2}>
          <Defs>
            <RadialGradient id="bloom" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={palette.emberRed} stopOpacity={0.9} />
              <Stop offset="45%" stopColor={palette.daggerRed} stopOpacity={0.35} />
              <Stop offset="100%" stopColor={palette.voidBlack} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#bloom)" />
        </Svg>
      </Animated.View>

      {/* ASCORP — medieval display, above the dagger */}
      <Animated.Text style={[styles.ascorp, glitchStyle]}>ASCORP</Animated.Text>

      {/* 3D-morphic dagger */}
      <Animated.View style={daggerStyle}>
        <Dagger />
      </Animated.View>

      {/* ominous quote */}
      <Text style={styles.quote}>{quote}</Text>

      {/* LOVES YOU — under the dagger + quote, close to the quote, off the bottom */}
      <Text style={styles.lovesYou}>LOVES  YOU</Text>
    </View>
  );
}

/** Pseudo-3D beveled dagger built from layered gradient polygons. */
function Dagger() {
  const w = DAGGER_W;
  const h = w * 1.9;
  return (
    <Svg width={w} height={h} viewBox="0 0 100 190">
      <Defs>
        <LinearGradient id="bladeL" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#3A0207" />
          <Stop offset="50%" stopColor={palette.emberRed} />
          <Stop offset="100%" stopColor="#5A0308" />
        </LinearGradient>
        <LinearGradient id="bladeSheen" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.65} />
          <Stop offset="30%" stopColor="#FFFFFF" stopOpacity={0.05} />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id="hilt" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#4A0206" />
          <Stop offset="50%" stopColor={palette.daggerRed} />
          <Stop offset="100%" stopColor="#2A0104" />
        </LinearGradient>
      </Defs>

      {/* blade back face (offset -> depth) */}
      <Polygon points="52,8 62,96 52,120 44,96" fill="#2A0104" opacity={0.9} />
      {/* blade front face */}
      <Polygon points="50,4 60,96 50,118 40,96" fill="url(#bladeL)" />
      {/* fuller / center ridge */}
      <Line x1="50" y1="10" x2="50" y2="112" stroke="#1A0002" strokeWidth={1.4} opacity={0.7} />
      {/* moving-light sheen */}
      <Polygon points="50,6 54,60 50,96 47,60" fill="url(#bladeSheen)" />

      {/* guard */}
      <Rect x="30" y="118" width="40" height="8" rx="3" fill="url(#hilt)" />
      <Rect x="30" y="118" width="40" height="3" rx="2" fill="#FFFFFF" opacity={0.18} />

      {/* grip */}
      <Rect x="45" y="126" width="10" height="46" rx="3" fill="url(#hilt)" />
      <G opacity={0.35} stroke="#1A0002" strokeWidth={1}>
        <Line x1="45" y1="134" x2="55" y2="138" />
        <Line x1="45" y1="142" x2="55" y2="146" />
        <Line x1="45" y1="150" x2="55" y2="154" />
        <Line x1="45" y1="158" x2="55" y2="162" />
      </G>

      {/* pommel */}
      <Polygon points="50,172 58,180 50,188 42,180" fill="url(#hilt)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.voidBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: { position: 'absolute' },
  ascorp: {
    ...type.hero,
    color: palette.emberRed,
    fontSize: 40,
    letterSpacing: 12,
    marginBottom: 8,
    textShadowColor: palette.daggerRed,
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 0 },
  },
  quote: {
    ...type.body,
    color: palette.parchment,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: '78%',
    marginTop: 18,
    opacity: 0.85,
  },
  lovesYou: {
    ...type.hero,
    color: palette.bone,
    fontSize: 22,
    letterSpacing: 10,
    marginTop: 14,
    marginBottom: 40,
    textShadowColor: palette.daggerRed,
    textShadowRadius: 10,
  },
});
