import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { BrandMark } from '../../components/ui/BrandTitle';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppText } from '../../components/ui/AppText';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { UserRole } from '../../types';
import { isValidGymCode } from '../../utils/validators';
import { spacing, borderRadius } from '../../config/theme';

const ROLES: { key: UserRole; label: string }[] = [
  { key: 'owner', label: 'Owner' },
  { key: 'trainer', label: 'Trainer' },
  { key: 'member', label: 'Member' },
];

export function GoogleRoleSetupScreen() {
  const { pendingGoogleUser, completeGoogleSetup, cancelGoogleSetup, isLoading, error } =
    useAuthStore();
  const colors = useThemeStore((s) => s.colors);

  const [name, setName] = useState(pendingGoogleUser?.name ?? '');
  const [role, setRole] = useState<UserRole>('member');
  const [gymCode, setGymCode] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    if (pendingGoogleUser?.name) {
      setName(pendingGoogleUser.name);
    }
  }, [pendingGoogleUser?.name]);

  const handleComplete = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Name is required');
      return;
    }
    if (role !== 'owner' && !isValidGymCode(gymCode)) {
      Alert.alert('Required', 'Enter a valid 6-character gym code');
      return;
    }

    try {
      await completeGoogleSetup({
        name: name.trim(),
        role,
        gymCode: role !== 'owner' ? gymCode.toUpperCase() : undefined,
        goal: goal.trim() || undefined,
      });
    } catch (err) {
      Alert.alert('Setup failed', err instanceof Error ? err.message : 'Unable to complete setup');
    }
  };

  const handleCancel = async () => {
    await cancelGoogleSetup();
  };

  return (
    <ScreenContainer keyboardAvoid>
      <BrandMark compact />
      <AppText variant="h2" style={styles.title}>Finish Google sign up</AppText>
      <AppText secondary style={styles.sub}>
        Choose your role to complete your MyGymHere account
        {pendingGoogleUser?.email ? ` (${pendingGoogleUser.email})` : ''}.
      </AppText>

      <SectionLabel title="Profile" />
      <Input label="Full name" value={name} onChangeText={setName} />

      <SectionLabel title="Role" />
      <View style={[styles.roleBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={[
              styles.roleOption,
              role === r.key && { backgroundColor: colors.elevated, borderColor: colors.primary },
            ]}
            onPress={() => setRole(r.key)}
          >
            <AppText
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: role === r.key ? colors.primary : colors.textSecondary,
              }}
            >
              {r.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {role !== 'owner' && (
        <>
          <SectionLabel title="Gym" />
          <Input
            label="Gym code"
            value={gymCode}
            onChangeText={setGymCode}
            autoCapitalize="characters"
            maxLength={6}
            placeholder="IRON01"
          />
        </>
      )}

      {role === 'member' && (
        <Input label="Fitness goal" value={goal} onChangeText={setGoal} placeholder="Optional" />
      )}

      {error && (
        <AppText style={{ color: colors.error, marginBottom: spacing.sm, fontSize: 13 }}>{error}</AppText>
      )}

      <Button title="Complete setup" onPress={handleComplete} loading={isLoading} style={styles.submit} />
      <Button title="Cancel" onPress={handleCancel} variant="ghost" disabled={isLoading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.md, marginBottom: spacing.xs },
  sub: { marginBottom: spacing.lg },
  roleBar: {
    flexDirection: 'row',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    padding: 3,
    marginBottom: spacing.md,
    gap: 4,
  },
  roleOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  submit: { marginTop: spacing.sm },
});
