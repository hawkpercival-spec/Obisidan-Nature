import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

/**
 * Nightly Inventory scheduling.
 *
 * Expo's daily trigger fires at a wall-clock hour/minute in the DEVICE's local
 * timezone, so "9pm every night in every timezone" is satisfied automatically —
 * we just schedule 21:00 local and it re-fires at 21:00 wherever the user is.
 *
 * Age rules:
 *   - Under 67:            21:00 (9:00pm) fixed.
 *   - 67 through 100:      a user-chosen time inside the 19:00–20:30 window
 *                          (7:00–8:30pm), gentler for older users.
 */
export const NIGHTLY_CATEGORY = 'nightly-inventory';
const NIGHTLY_ID_KEY = 'nightly-inventory';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export async function initNotifications() {
  if (!Device.isDevice) return;
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NIGHTLY_CATEGORY, {
      name: 'Nightly Inventory',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return status;
}

/** Whether the user must be offered a custom time (67–100). */
export function usesElderWindow(age: number): boolean {
  return age >= 67 && age <= 100;
}

/** Clamp a chosen (hour, minute) into the 19:00–20:30 elder window. */
export function clampElderTime(hour: number, minute: number): { hour: number; minute: number } {
  const total = Math.min(Math.max(hour * 60 + minute, 19 * 60), 20 * 60 + 30);
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

/**
 * Schedule (or reschedule) the recurring nightly inventory notification.
 * @param age              user age (from birth year only)
 * @param elderTime        chosen {hour,minute} for 67–100 users
 */
export async function scheduleNightlyInventory(
  age: number,
  elderTime?: { hour: number; minute: number },
) {
  await cancelNightlyInventory();

  let hour = 21;
  let minute = 0;
  if (usesElderWindow(age)) {
    const t = clampElderTime(elderTime?.hour ?? 19, elderTime?.minute ?? 30);
    hour = t.hour;
    minute = t.minute;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: NIGHTLY_ID_KEY,
    content: {
      title: 'Nightly Inventory',
      body: 'Your before-bed Freudian/Lacanian inventory is ready. Sit with your obsidian nature.',
      categoryIdentifier: NIGHTLY_CATEGORY,
      data: { route: 'NightlyInventory' },
    },
    trigger: { hour, minute, repeats: true },
  });

  return { hour, minute };
}

export async function cancelNightlyInventory() {
  try {
    await Notifications.cancelScheduledNotificationAsync(NIGHTLY_ID_KEY);
  } catch {
    /* not scheduled */
  }
}
