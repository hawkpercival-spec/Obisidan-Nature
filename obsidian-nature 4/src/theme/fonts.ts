import * as Font from 'expo-font';

/**
 * Medieval display fonts for the nigromancy/ASCORP branding.
 * Drop the .ttf files into ./assets/fonts (Cinzel is SIL OFL, free for App Store use).
 * Grab them from Google Fonts: Cinzel + Cinzel Decorative.
 */
export async function loadFonts() {
  await Font.loadAsync({
    Cinzel: require('../../assets/fonts/Cinzel-Regular.ttf'),
    CinzelDecorative: require('../../assets/fonts/CinzelDecorative-Bold.ttf'),
  });
}
