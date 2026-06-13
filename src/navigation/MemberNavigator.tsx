import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MemberTabParamList, MemberStackParamList } from './types';
import { useThemeStore } from '../stores/themeStore';
import { MemberDashboardScreen } from '../screens/member/MemberDashboardScreen';
import { WorkoutsScreen } from '../screens/member/WorkoutsScreen';
import { AttendanceScreen } from '../screens/member/AttendanceScreen';
import { ProfileScreen } from '../screens/member/ProfileScreen';

const Tab = createBottomTabNavigator<MemberTabParamList>();
const Stack = createNativeStackNavigator<MemberStackParamList>();

function MemberTabs() {
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
            Workouts: 'fitness-outline',
            Attendance: 'calendar-outline',
            Profile: 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={MemberDashboardScreen} />
      <Tab.Screen name="Workouts" component={WorkoutsScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function MemberNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MemberTabs" component={MemberTabs} />
    </Stack.Navigator>
  );
}
