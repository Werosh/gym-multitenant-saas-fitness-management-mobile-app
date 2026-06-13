import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuth } from './src/hooks/useAuth';
import { useThemeStore } from './src/stores/themeStore';

export default function App() {
  useAuth();
  const { mode, colors, hydrate } = useThemeStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const navTheme = mode === 'dark'
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, primary: colors.primary, background: colors.background, card: colors.surface, text: colors.text, border: colors.border } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: colors.primary, background: colors.background, card: colors.surface, text: colors.text, border: colors.border } };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
