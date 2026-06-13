import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AdminTabParamList, AdminStackParamList } from './types';
import { getTabBarOptions } from './tabBarOptions';
import { useThemeStore } from '../stores/themeStore';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

function AdminTabs() {
  const colors = useThemeStore((s) => s.colors);

  return (
    <Tab.Navigator
      screenOptions={{
        ...getTabBarOptions(colors),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="shield-outline" size={size} color={color} />
        ),
      }}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
    </Tab.Navigator>
  );
}

export function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
    </Stack.Navigator>
  );
}
