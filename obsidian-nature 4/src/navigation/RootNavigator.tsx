import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import { useAuth } from '@/auth/AuthProvider';
import { useAppStore } from '@/store/useAppStore';
import { TransitionProvider } from '@/components/TransitionProvider';
import { palette } from '@/theme/theme';

import { SignInScreen } from '@/screens/auth/SignInScreen';
import { BirthYearScreen } from '@/screens/onboarding/BirthYearScreen';
import { IntakeNavigator } from './IntakeNavigator';
import { TabNavigator } from './TabNavigator';
import { PillarDetailScreen } from '@/screens/pillars/PillarDetailScreen';
import { SelfPillarScreen } from '@/screens/pillars/SelfPillarScreen';
import { ArchetypalPillarScreen } from '@/screens/pillars/ArchetypalPillarScreen';
import { TemperamentPillarScreen } from '@/screens/pillars/TemperamentPillarScreen';
import { BloodlettingGame } from '@/screens/pillars/BloodlettingGame';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: palette.voidBlack, card: palette.obsidian, text: palette.bone, border: palette.ash, primary: palette.daggerRed },
};

/**
 * Gating order:
 *   1. Not authenticated            -> SignIn (soundscape + paywall wait for login)
 *   2. Authenticated, no birth year -> BirthYear (year only, elder flagging)
 *   3. Intake not complete          -> Intake stack (free portion is open; the
 *                                       $5.99 paywall is enforced WITHIN the intake
 *                                       flow, before the paid assessment sections,
 *                                       for under-70 users only)
 *   4. Otherwise                    -> Main tabs
 */
export function RootNavigator() {
  const { user } = useAuth();
  const birthYear = useAppStore((s) => s.profile.birthYear);
  const intakeComplete = useAppStore((s) => s.intakeComplete);

  return (
    <NavigationContainer theme={navTheme}>
      <TransitionProvider>
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.voidBlack } }}>
          {!user ? (
            <Stack.Screen name="SignIn" component={SignInScreen} />
          ) : !birthYear ? (
            <Stack.Screen name="BirthYear" component={BirthYearScreen} />
          ) : !intakeComplete ? (
            <Stack.Screen name="Intake" component={IntakeNavigator} />
          ) : (
            <>
              <Stack.Screen name="Main" component={TabNavigator} />
              <Stack.Screen name="PillarDetail" component={PillarDetailScreen} />
              <Stack.Screen name="SelfPillar" component={SelfPillarScreen} />
              <Stack.Screen name="ArchetypalPillar" component={ArchetypalPillarScreen} />
              <Stack.Screen name="TemperamentPillar" component={TemperamentPillarScreen} />
              <Stack.Screen name="BloodlettingGame" component={BloodlettingGame} />
            </>
          )}
        </Stack.Navigator>
      </TransitionProvider>
    </NavigationContainer>
  );
}
