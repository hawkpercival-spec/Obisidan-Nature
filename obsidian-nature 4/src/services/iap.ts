import { Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import Purchases, { PurchasesOffering } from 'react-native-purchases';

/**
 * In-app subscription for the $5.99/month unlock (Apple / Google IAP).
 *
 * We use RevenueCat as a thin wrapper over StoreKit so the auto-renewing
 * entitlement survives reinstalls, renewals, and lapses, and so
 * "Restore Purchases" is trivial (App Store requirement).
 *
 * App Store Connect setup:
 *   - Product type: Auto-Renewable Subscription
 *   - Product ID:   org.asphodelpress.obsidiannature.monthly
 *   - Duration:     1 month
 *   - Price:        $5.99 / month
 *   - Subscription group: "Obsidian Nature Access"
 *   - RevenueCat entitlement id: "full_access" (active only while subscribed)
 *
 * IMPORTANT (App Review): the paywall only ever gates users UNDER 70. Age
 * gating happens in the store (see useAppStore.isPaywalled) — never charge a
 * user who reports an age of 70+.
 */
export const ENTITLEMENT_ID = 'full_access';
export const PRODUCT_ID = 'org.asphodelpress.obsidiannature.monthly';
export const SUBSCRIPTION_PRICE = '$5.99 / month';

let configured = false;

export async function initPurchases() {
  if (configured) return;
  const apiKey = Constants.expoConfig?.extra?.revenueCatApiKeyIos as string | undefined;
  if (!apiKey) {
    console.warn('[iap] no RevenueCat key configured — running in stub mode');
    return;
  }
  Purchases.configure({ apiKey });
  configured = true;
}

export async function getOffering(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (e) {
    console.warn('[iap] getOffering failed', e);
    return null;
  }
}

export async function hasFullAccess(): Promise<boolean> {
  try {
    const info = await Purchases.getCustomerInfo();
    return typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch {
    return false;
  }
}

/** Start the $5.99/month subscription. Returns true if the entitlement is now active. */
export async function purchaseSubscription(): Promise<boolean> {
  const offering = await getOffering();
  const pkg = offering?.availablePackages.find((p) => p.product.identifier === PRODUCT_ID)
    ?? offering?.monthly
    ?? offering?.availablePackages[0];
  if (!pkg) throw new Error('No purchasable subscription found in current offering.');
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
}

export async function restorePurchases(): Promise<boolean> {
  const info = await Purchases.restorePurchases();
  return typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
}

export const iapPlatformNote = Platform.select({
  ios: 'Apple in-app purchase',
  android: 'Google Play billing',
  default: 'in-app purchase',
});

/**
 * Opens the OS-native subscription management screen so the user can view,
 * change, or cancel their $5.99/month subscription. Apple/Google own the
 * cancel flow — apps cannot cancel on the user's behalf, only deep-link here.
 */
export async function openManageSubscriptions() {
  const url = Platform.select({
    ios: 'itms-apps://apps.apple.com/account/subscriptions',
    android: `https://play.google.com/store/account/subscriptions?sku=${PRODUCT_ID}&package=org.asphodelpress.obsidiannature`,
    default: 'https://apps.apple.com/account/subscriptions',
  })!;
  try {
    await Linking.openURL(url);
  } catch {
    // Fallback for simulators / when the store app is unavailable.
    await Linking.openURL('https://apps.apple.com/account/subscriptions').catch(() => {});
  }
}
