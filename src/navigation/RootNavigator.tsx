import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore, useNeedsGymSetup } from '../stores/authStore';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { AuthNavigator } from './AuthNavigator';
import { OwnerNavigator } from './OwnerNavigator';
import { TrainerNavigator } from './TrainerNavigator';
import { MemberNavigator } from './MemberNavigator';
import { AdminNavigator } from './AdminNavigator';
import { GymSetupScreen } from '../screens/owner/GymSetupScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const profile = useAuthStore((s) => s.profile);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const needsGymSetup = useNeedsGymSetup();

  if (!isInitialized) {
    return <LoadingScreen message="Initializing MyGymHere..." />;
  }

  if (!profile) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
      </Stack.Navigator>
    );
  }

  if (needsGymSetup) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GymSetup" component={GymSetupScreen} />
      </Stack.Navigator>
    );
  }

  const role = profile.role;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === 'super_admin' && <Stack.Screen name="AdminStack" component={AdminNavigator} />}
      {role === 'owner' && <Stack.Screen name="OwnerStack" component={OwnerNavigator} />}
      {role === 'trainer' && <Stack.Screen name="TrainerStack" component={TrainerNavigator} />}
      {role === 'member' && <Stack.Screen name="MemberStack" component={MemberNavigator} />}
    </Stack.Navigator>
  );
}
