import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { AppText } from './AppText';

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText secondary style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
  },
});
