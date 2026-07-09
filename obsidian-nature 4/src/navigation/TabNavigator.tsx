import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { palette, fonts } from '@/theme/theme';

import { CodexScreen } from '@/screens/pillars/CodexScreen';
import { NightlyInventoryScreen } from '@/screens/nightly/NightlyInventoryScreen';
import { DreamJournalScreen } from '@/screens/dreams/DreamJournalScreen';
import { ArchetypalScreen } from '@/screens/archetypal/ArchetypalScreen';
import { DailyRitualScreen } from '@/screens/rituals/DailyRitualScreen';
import { ProgressScreen } from '@/screens/progress/ProgressScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const glyphs: Record<keyof MainTabParamList, string> = {
  Codex: '⛧',
  Nightly: '☾',
  Dreams: '❈',
  Archetypal: '✶',
  Rituals: '†',
  Progress: '◈',
};

function icon(name: keyof MainTabParamList, color: string) {
  return <Text style={{ color, fontSize: 18, fontFamily: fonts.display }}>{glyphs[name]}</Text>;
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: palette.obsidian, borderTopColor: palette.ash, height: 84, paddingTop: 6 },
        tabBarActiveTintColor: palette.emberRed,
        tabBarInactiveTintColor: palette.textFaint,
        tabBarLabelStyle: { fontSize: 10, letterSpacing: 0.5 },
        tabBarIcon: ({ color }) => icon(route.name, color),
      })}
    >
      <Tab.Screen name="Codex" component={CodexScreen} options={{ title: 'Codex' }} />
      <Tab.Screen name="Nightly" component={NightlyInventoryScreen} options={{ title: 'Nightly' }} />
      <Tab.Screen name="Dreams" component={DreamJournalScreen} options={{ title: 'Dreams' }} />
      <Tab.Screen name="Archetypal" component={ArchetypalScreen} options={{ title: 'Archetypes' }} />
      <Tab.Screen name="Rituals" component={DailyRitualScreen} options={{ title: 'Rituals' }} />
      <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progress' }} />
    </Tab.Navigator>
  );
}
