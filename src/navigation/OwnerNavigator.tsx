import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { OwnerTabParamList, OwnerStackParamList } from './types';
import { getTabBarOptions } from './tabBarOptions';
import { useThemeStore } from '../stores/themeStore';
import { OwnerDashboardScreen } from '../screens/owner/OwnerDashboardScreen';
import { MembersScreen } from '../screens/owner/MembersScreen';
import { TrainersScreen } from '../screens/owner/TrainersScreen';
import { AttendanceLogsScreen } from '../screens/owner/AttendanceLogsScreen';
import { GymManagementScreen } from '../screens/owner/GymManagementScreen';
import { MemberFormScreen } from '../screens/owner/MemberFormScreen';
import { TrainerFormScreen } from '../screens/owner/TrainerFormScreen';
import { GymSetupScreen } from '../screens/owner/GymSetupScreen';

const Tab = createBottomTabNavigator<OwnerTabParamList>();
const Stack = createNativeStackNavigator<OwnerStackParamList>();

function OwnerTabs() {
  const colors = useThemeStore((s) => s.colors);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...getTabBarOptions(colors),
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'grid-outline',
            Members: 'people-outline',
            Trainers: 'barbell-outline',
            Attendance: 'calendar-outline',
            Gym: 'business-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={OwnerDashboardScreen} />
      <Tab.Screen name="Members" component={MembersScreen} />
      <Tab.Screen name="Trainers" component={TrainersScreen} />
      <Tab.Screen name="Attendance" component={AttendanceLogsScreen} />
      <Tab.Screen name="Gym" component={GymManagementScreen} options={{ title: 'Gym' }} />
    </Tab.Navigator>
  );
}

export function OwnerNavigator() {
  const colors = useThemeStore((s) => s.colors);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="OwnerTabs" component={OwnerTabs} options={{ headerShown: false }} />
      <Stack.Screen name="MemberForm" component={MemberFormScreen} options={{ title: 'Member' }} />
      <Stack.Screen name="TrainerForm" component={TrainerFormScreen} options={{ title: 'Add Trainer' }} />
      <Stack.Screen name="GymSetup" component={GymSetupScreen} options={{ title: 'Setup Gym', headerShown: false }} />
    </Stack.Navigator>
  );
}
