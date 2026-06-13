import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppText } from '../../components/ui/AppText';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { AuthStackParamList } from '../../navigation/types';
import { MOCK_PASSWORD } from '../../data/mockData';
import { spacing, borderRadius } from '../../config/theme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const DEMO_ACCOUNTS = [
  { userId: 'user-owner-1', label: 'Gym Owner', icon: 'business-outline' as const },
  { userId: 'user-trainer-1', label: 'Trainer', icon: 'barbell-outline' as const },
  { userId: 'user-member-1', label: 'Member', icon: 'person-outline' as const },
];

export function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
  const demoLogin = useAuthStore((s) => s.demoLogin);
  const colors = useThemeStore((s) => s.colors);

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Ionicons name="fitness" size={48} color="#FFF" />
          </View>
          <AppText variant="h1" style={styles.title}>
            GymHub
          </AppText>
          <AppText secondary style={styles.tagline}>
            Manage your gym. Track workouts. Grow your fitness business.
          </AppText>
        </View>

        <View style={styles.actions}>
          <Button title="Get Started" onPress={() => navigation.navigate('Register')} />
          <Button title="Sign In" variant="outline" onPress={() => navigation.navigate('Login')} />
        </View>

        <Card style={styles.demoCard}>
          <AppText variant="h3">Try Demo</AppText>
          <AppText secondary style={styles.demoHint}>
            Jump in instantly with dummy data — no account needed.
          </AppText>
          {DEMO_ACCOUNTS.map((account) => (
            <Button
              key={account.userId}
              title={account.label}
              variant="outline"
              onPress={() => demoLogin(account.userId)}
              style={styles.demoBtn}
            />
          ))}
        </Card>

        <AppText variant="small" secondary style={styles.footer}>
          Demo login: owner@gymhub.com / {MOCK_PASSWORD}
        </AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
  },
  tagline: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  actions: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  demoCard: {
    marginBottom: spacing.md,
  },
  demoHint: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  demoBtn: {
    marginTop: spacing.sm,
    minHeight: 44,
  },
  footer: {
    textAlign: 'center',
  },
});
