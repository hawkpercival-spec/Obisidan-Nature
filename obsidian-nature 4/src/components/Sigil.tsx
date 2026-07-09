import React from 'react';
import Svg, { Circle, G, Line, Path, Polygon } from 'react-native-svg';
import { palette } from '@/theme/theme';

export type SigilName =
  | 'threshold' // intake
  | 'mirror' // Lacanian mirror / imaginary
  | 'lack' // the barred subject
  | 'archetype'
  | 'dream'
  | 'seal' // module complete
  | 'dagger';

/**
 * Cyber-sigilism line marks. Angular, spiky, tattoo-flash geometry over a thin
 * ring — used as module glyphs, section headers, and the "seal" that appears
 * after a pillar/module is completed.
 */
export function Sigil({
  name = 'seal',
  size = 96,
  color = palette.emberRed,
  glow = palette.daggerRed,
}: {
  name?: SigilName;
  size?: number;
  color?: string;
  glow?: string;
}) {
  const s = 100;
  const stroke = { stroke: color, strokeWidth: 1.6, fill: 'none' as const };
  const spike = { stroke: color, strokeWidth: 1.1, fill: 'none' as const };

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${s} ${s}`}>
      {/* outer ritual ring */}
      <Circle cx={50} cy={50} r={46} {...stroke} opacity={0.5} />
      <Circle cx={50} cy={50} r={38} {...spike} opacity={0.3} />

      {/* radiating cyber-spikes */}
      <G opacity={0.85}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 50 + Math.cos(a) * 38;
          const y1 = 50 + Math.sin(a) * 38;
          const x2 = 50 + Math.cos(a) * 46;
          const y2 = 50 + Math.sin(a) * 46;
          return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...spike} />;
        })}
      </G>

      {glyph(name, color, glow)}
    </Svg>
  );
}

function glyph(name: SigilName, color: string, glow: string) {
  const p = { stroke: color, strokeWidth: 2, fill: 'none' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'mirror':
      return (
        <G>
          <Polygon points="50,20 68,50 50,80 32,50" {...p} />
          <Line x1={32} y1={50} x2={68} y2={50} {...p} />
        </G>
      );
    case 'lack': // barred subject $
      return (
        <G>
          <Path d="M62 34 C40 34 40 50 62 50 C40 50 40 66 62 66" {...p} />
          <Line x1={50} y1={26} x2={50} y2={74} {...p} />
        </G>
      );
    case 'archetype':
      return (
        <G>
          <Circle cx={50} cy={44} r={12} {...p} />
          <Path d="M30 74 C30 58 70 58 70 74" {...p} />
        </G>
      );
    case 'dream':
      return (
        <G>
          <Path d="M34 50 C34 34 66 34 66 50 C66 66 34 66 34 50" {...p} />
          <Circle cx={50} cy={50} r={4} fill={glow} />
        </G>
      );
    case 'threshold':
      return (
        <G>
          <Line x1={38} y1={30} x2={38} y2={72} {...p} />
          <Line x1={62} y1={30} x2={62} y2={72} {...p} />
          <Line x1={38} y1={30} x2={62} y2={30} {...p} />
        </G>
      );
    case 'dagger':
      return daggerPath(color, glow);
    case 'seal':
    default:
      return (
        <G>
          <Polygon points="50,26 60,44 50,74 40,44" {...p} />
          <Line x1={40} y1={44} x2={60} y2={44} {...p} />
          <Circle cx={50} cy={38} r={3} fill={glow} />
        </G>
      );
  }
}

/** Flat 2D dagger used inside sigils; the loading screen uses a 3D Skia version. */
function daggerPath(color: string, glow: string) {
  const p = { stroke: color, strokeWidth: 2, fill: glow, strokeLinejoin: 'round' as const };
  return (
    <G>
      <Polygon points="50,18 55,54 50,64 45,54" {...p} />
      <Line x1={38} y1={54} x2={62} y2={54} stroke={color} strokeWidth={3} />
      <Line x1={50} y1={64} x2={50} y2={82} stroke={color} strokeWidth={3} />
    </G>
  );
}
