import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { spacing } from '../../config/theme';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="h3" secondary>
        {title}
      </AppText>
      {description && (
        <AppText secondary style={styles.description}>
          {description}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  description: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
