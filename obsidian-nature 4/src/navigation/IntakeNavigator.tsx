import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IntakeStackParamList } from './types';
import { palette } from '@/theme/theme';

import { IntakeFreeScreen } from '@/screens/intake/IntakeFreeScreen';
import { EnneagramScreen } from '@/screens/intake/EnneagramScreen';
import { CognitionScreen } from '@/screens/intake/CognitionScreen';
import { TemperamentScreen } from '@/screens/intake/TemperamentScreen';
import { JungianScreen } from '@/screens/intake/JungianScreen';
import { IntakeReportScreen } from '@/screens/intake/IntakeReportScreen';

const Stack = createNativeStackNavigator<IntakeStackParamList>();

/**
 * Intake flow. The free opening inventory is first; each paid assessment screen
 * calls requirePaid() (see PaywallGate) before rendering for under-70 users.
 */
export function IntakeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.voidBlack },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="IntakeFree" component={IntakeFreeScreen} />
      <Stack.Screen name="Enneagram" component={EnneagramScreen} />
      <Stack.Screen name="Cognition" component={CognitionScreen} />
      <Stack.Screen name="Temperament" component={TemperamentScreen} />
      <Stack.Screen name="Jungian" component={JungianScreen} />
      <Stack.Screen name="IntakeReport" component={IntakeReportScreen} />
    </Stack.Navigator>
  );
}
