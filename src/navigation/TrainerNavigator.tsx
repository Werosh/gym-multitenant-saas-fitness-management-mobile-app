import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TrainerTabParamList, TrainerStackParamList } from './types';
import { useThemeStore } from '../stores/themeStore';
import { TrainerDashboardScreen } from '../screens/trainer/TrainerDashboardScreen';
import { AssignedMembersScreen } from '../screens/trainer/AssignedMembersScreen';
import { WorkoutBuilderScreen } from '../screens/trainer/WorkoutBuilderScreen';
import { MemberProgressScreen } from '../screens/trainer/MemberProgressScreen';

const Tab = createBottomTabNavigator<TrainerTabParamList>();
const Stack = createNativeStackNavigator<TrainerStackParamList>();

function TrainerTabs() {
  const colors = useThemeStore((s) => s.colors);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: { backgroundColor: colors.tabBar, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'grid-outline',
            Members: 'people-outline',
            Workouts: 'fitness-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={TrainerDashboardScreen} />
      <Tab.Screen name="Members" component={AssignedMembersScreen} />
      <Tab.Screen name="Workouts" component={AssignedMembersScreen} options={{ title: 'Workouts' }} />
    </Tab.Navigator>
  );
}

export function TrainerNavigator() {
  const colors = useThemeStore((s) => s.colors);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="TrainerTabs" component={TrainerTabs} options={{ headerShown: false }} />
      <Stack.Screen name="WorkoutBuilder" component={WorkoutBuilderScreen} options={{ title: 'Workout Plan' }} />
      <Stack.Screen name="MemberProgress" component={MemberProgressScreen} options={{ title: 'Member Progress' }} />
    </Stack.Navigator>
  );
}
