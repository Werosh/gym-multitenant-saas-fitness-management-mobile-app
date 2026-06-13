import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../stores/themeStore';
import { useResponsive } from '../../hooks/useResponsive';
import { spacing } from '../../config/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  keyboardAvoid?: boolean;
}

export function ScreenContainer({
  children,
  scroll = true,
  onRefresh,
  refreshing = false,
  keyboardAvoid = false,
}: ScreenContainerProps) {
  const colors = useThemeStore((s) => s.colors);
  const { horizontalPadding, contentMaxWidth, isTablet } = useResponsive();

  const inner = (
    <View
      style={[
        styles.contentWrap,
        {
          paddingHorizontal: horizontalPadding,
          maxWidth: isTablet ? contentMaxWidth : undefined,
        },
      ]}
    >
      {children}
    </View>
  );

  const scrollBody = scroll ? (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        ) : undefined
      }
    >
      {inner}
    </ScrollView>
  ) : (
    <View style={styles.flex}>{inner}</View>
  );

  const body = keyboardAvoid ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      {scrollBody}
    </KeyboardAvoidingView>
  ) : (
    scrollBody
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  contentWrap: {
    width: '100%',
    flex: 1,
  },
});
