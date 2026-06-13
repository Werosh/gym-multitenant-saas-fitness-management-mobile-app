import React, { useState } from 'react';
import { Alert } from 'react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { AppText } from '../../components/ui/AppText';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { ResponsiveRow } from '../../components/ui/ResponsiveRow';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { updateUserProfile } from '../../services/authService';
import { getRoleLabel } from '../../utils/roleUtils';
import { spacing } from '../../config/theme';

export function ProfileScreen() {
  const { profile, refreshProfile, logout } = useAuthStore();
  const { toggleTheme, mode } = useThemeStore();

  const [name, setName] = useState(profile?.name ?? '');
  const [weight, setWeight] = useState(profile?.weight?.toString() ?? '');
  const [height, setHeight] = useState(profile?.height?.toString() ?? '');
  const [goal, setGoal] = useState(profile?.goal ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      await updateUserProfile(profile.userId, {
        name: name.trim(),
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
        goal: goal.trim() || undefined,
      });
      await refreshProfile();
      Alert.alert('Saved', 'Profile updated.');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['member']}>
      <ScreenContainer keyboardAvoid>
        <Header title="Profile" subtitle={profile?.email} />

        <Card>
          <AppText variant="caption" secondary>Role</AppText>
          <AppText variant="h3" style={{ marginTop: 4 }}>
            {profile ? getRoleLabel(profile.role) : '—'}
          </AppText>
        </Card>

        <SectionLabel title="Details" />
        <Input label="Name" value={name} onChangeText={setName} />
        <ResponsiveRow>
          <Input label="Weight kg" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
          <Input label="Height cm" value={height} onChangeText={setHeight} keyboardType="decimal-pad" />
        </ResponsiveRow>
        <Input label="Goal" value={goal} onChangeText={setGoal} />

        <Button title="Save profile" onPress={handleSave} loading={loading} />
        <Button title={`${mode === 'dark' ? 'Light' : 'Dark'} mode`} variant="outline" onPress={toggleTheme} style={{ marginTop: spacing.sm }} />
        <Button title="Sign out" variant="danger" onPress={logout} style={{ marginTop: spacing.sm }} />
      </ScreenContainer>
    </RoleGuard>
  );
}
