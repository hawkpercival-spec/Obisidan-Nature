/**
 * Obsidian Nature theme.
 *
 * Aesthetic brief: medieval nigromancy (obsidian black, oxblood/dagger red, bone,
 * candle gold) fused with Frutiger Aero (glassy translucency, aqua glow, soft
 * gradients, wet-glass highlights) and cyber-sigilism line work. Techno-horror
 * accents borrow the "Red Rose" ominous-symbol palette.
 */

export const palette = {
  // Nigromancy base
  voidBlack: '#05070B',
  obsidian: '#0B0F17',
  obsidianRaised: '#111725',
  ash: '#1A2230',

  // Dagger / oxblood
  daggerRed: '#B3121E',
  oxblood: '#7A0A12',
  emberRed: '#FF2A3A',

  // Bone / candle
  bone: '#E9E4D6',
  parchment: '#C8C2B0',
  candleGold: '#D9A741',

  // Frutiger Aero glass + aqua
  aero: '#33D6E0',
  aeroDeep: '#0E8FA6',
  glassLight: 'rgba(210, 235, 240, 0.10)',
  glassStroke: 'rgba(180, 220, 230, 0.22)',

  // Semantic
  success: '#3FB96B',
  warning: '#D9A741',
  danger: '#B3121E',

  textPrimary: '#EDE9DD',
  textMuted: '#8B93A3',
  textFaint: '#5A6272',
} as const;

export const gradients = {
  // Frutiger-aero glassy vertical wash over obsidian
  aeroGlass: ['#111725', '#0B0F17', '#05070B'] as const,
  // Ritual accent behind headers
  ritual: ['#7A0A12', '#B3121E', '#3A0207'] as const,
  // Aqua bloom used on active/complete states
  aquaBloom: ['#33D6E0', '#0E8FA6', '#0B0F17'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
} as const;

export const fonts = {
  // Medieval / blackletter display (used for "ASCORP", titles, pillar seals)
  display: 'Cinzel',
  displayBold: 'CinzelDecorative',
  // Clean Frutiger-Aero body
  body: 'System',
  mono: 'Menlo',
} as const;

export const type = {
  hero: { fontFamily: fonts.displayBold, fontSize: 34, letterSpacing: 2 },
  title: { fontFamily: fonts.display, fontSize: 24, letterSpacing: 1.5 },
  section: { fontFamily: fonts.display, fontSize: 18, letterSpacing: 1 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23 },
  caption: { fontFamily: fonts.body, fontSize: 12, letterSpacing: 0.5 },
  sigil: { fontFamily: fonts.displayBold, fontSize: 20, letterSpacing: 6 },
} as const;

export const theme = { palette, gradients, spacing, radius, fonts, type };
export type Theme = typeof theme;
