import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppText } from '../../components/ui/AppText';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { SubscriptionPlan } from '../../types';
import { spacing } from '../../config/theme';

const PLANS: SubscriptionPlan[] = ['basic', 'pro', 'enterprise'];

export function GymSetupScreen() {
  const { setupGym, isLoading } = useAuthStore();
  const colors = useThemeStore((s) => s.colors);
  const [gymName, setGymName] = useState('');
  const [location, setLocation] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>('basic');
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!gymName.trim() || !location.trim()) {
      Alert.alert('Validation', 'Gym name and location are required');
      return;
    }

    try {
      const gym = await setupGym({ gymName: gymName.trim(), location: location.trim(), subscriptionPlan });
      setCreatedCode(gym.gymCode);
      Alert.alert(
        'Gym Created!',
        `Your gym code is: ${gym.gymCode}\n\nShare this code with members and trainers to join your gym.`
      );
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create gym');
    }
  };

  if (createdCode) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.center}>
          <AppText variant="h2">Gym Ready!</AppText>
          <AppText secondary style={styles.message}>
            Share this code with your team:
          </AppText>
          <View style={[styles.codeBox, { backgroundColor: colors.primary }]}>
            <AppText variant="h1" style={{ color: '#FFF', letterSpacing: 4 }}>
              {createdCode}
            </AppText>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AppText variant="h2" style={styles.title}>
        Register Your Gym
      </AppText>
      <AppText secondary style={styles.subtitle}>
        Set up your gym to start managing members and trainers.
      </AppText>

      <Input label="Gym Name" value={gymName} onChangeText={setGymName} placeholder="Iron Fitness Club" />
      <Input label="Location" value={location} onChangeText={setLocation} placeholder="City, Country" />

      <AppText variant="caption" secondary>
        Subscription Plan
      </AppText>
      <View style={styles.planRow}>
        {PLANS.map((plan) => (
          <Button
            key={plan}
            title={plan.charAt(0).toUpperCase() + plan.slice(1)}
            variant={subscriptionPlan === plan ? 'primary' : 'outline'}
            onPress={() => setSubscriptionPlan(plan)}
            style={styles.planButton}
          />
        ))}
      </View>

      <Button title="Create Gym" onPress={handleCreate} loading={isLoading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  planRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  planButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    minHeight: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  message: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  codeBox: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 12,
  },
});
