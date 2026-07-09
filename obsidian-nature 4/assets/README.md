# Assets required

These files are referenced by the code but are binary and NOT included. Add them
before running `expo start`, or Metro bundling will fail on the `require()`s.

## Fonts (`assets/fonts/`)
- `Cinzel-Regular.ttf`
- `CinzelDecorative-Bold.ttf`
  → Download from Google Fonts (Cinzel + Cinzel Decorative, SIL OFL — free for App Store use).

## Audio (`assets/audio/`)
- `obsidian-soundscape.mp3` — a seamless-looping ambient cyber-goth bed
  (dark drone + slow industrial pulse). Used by `SoundscapeProvider`.
  License it or produce it royalty-free; keep the loop clean so it repeats without a seam.

## Images (`assets/`)
- `icon.png`            — 1024×1024 app icon
- `splash.png`          — splash image (dark, centered dagger works well)
- `notification-icon.png` — small monochrome notification icon (Android)

Until you add these, you can temporarily:
- comment out the `loadFonts()` call and the font families fall back to System,
- comment out the `require(...soundscape.mp3...)` in `SoundscapeProvider`,
- point `icon`/`splash` in `app.json` at any placeholder PNG.
