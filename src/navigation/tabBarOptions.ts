import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ThemeColors } from '../config/theme';

export function getTabBarOptions(colors: ThemeColors): BottomTabNavigationOptions {
  return {
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.tabBarInactive,
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.3,
      marginBottom: 4,
    },
    tabBarStyle: {
      backgroundColor: colors.tabBar,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      height: 60,
      paddingTop: 6,
      elevation: 0,
      shadowOpacity: 0,
    },
  };
}
