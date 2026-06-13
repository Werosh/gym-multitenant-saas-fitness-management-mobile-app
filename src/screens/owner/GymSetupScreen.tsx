import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { BrandMark } from '../../components/ui/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppText } from '../../components/ui/AppText';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { ChipSelect } from '../../components/ui/ChipSelect';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { SubscriptionPlan } from '../../types';
import { spacing } from '../../config/theme';

const PLANS: { value: SubscriptionPlan; label: string }[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
];

export function GymSetupScreen() {
  const { setupGym, isLoading } = useAuthStore();
  const colors = useThemeStore((s) => s.colors);
  const [gymName, setGymName] = useState('');
  const [location, setLocation] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>('basic');
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!gymName.trim() || !location.trim()) {
      Alert.alert('Required', 'Gym name and location are required.');
      return;
    }
    try {
      const gym = await setupGym({ gymName: gymName.trim(), location: location.trim(), subscriptionPlan });
      setCreatedCode(gym.gymCode);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create gym');
    }
  };

  if (createdCode) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.center}>
          <BrandMark />
          <AppText variant="h2" style={styles.readyTitle}>Gym registered</AppText>
          <AppText secondary style={styles.message}>Share this code with your team:</AppText>
          <View style={[styles.codeBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <AppText variant="stat" style={{ color: colors.primary, letterSpacing: 4 }}>
              {createdCode}
            </AppText>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer keyboardAvoid>
      <BrandMark />
      <AppText variant="h2" style={styles.title}>Register your gym</AppText>
      <AppText secondary style={styles.subtitle}>
        Set up your gym to manage members and trainers.
      </AppText>

      <SectionLabel title="Details" />
      <Input label="Gym name" value={gymName} onChangeText={setGymName} placeholder="Iron Fitness Club" />
      <Input label="Location" value={location} onChangeText={setLocation} placeholder="City, Country" />

      <SectionLabel title="Plan" />
      <ChipSelect options={PLANS} value={subscriptionPlan} onChange={setSubscriptionPlan} />

      <Button title="Create gym" onPress={handleCreate} loading={isLoading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.md, marginBottom: spacing.xs },
  subtitle: { marginBottom: spacing.lg },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: spacing.xl,
  },
  readyTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  message: { marginBottom: spacing.lg },
  codeBox: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
});
