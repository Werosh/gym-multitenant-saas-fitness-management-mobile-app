import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { AppText } from '../../components/ui/AppText';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { useGymStore } from '../../stores/gymStore';
import { useThemeStore } from '../../stores/themeStore';
import { updateGym } from '../../services/gymService';
import { spacing } from '../../config/theme';

export function GymManagementScreen() {
  const profile = useAuthStore((s) => s.profile);
  const { gym, loadGym } = useGymStore();
  const colors = useThemeStore((s) => s.colors);
  const [gymName, setGymName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (profile?.gymId) {
        loadGym(profile.gymId).then(() => {
          const current = useGymStore.getState().gym;
          if (current) {
            setGymName(current.gymName);
            setLocation(current.location);
          }
        });
      }
    }, [profile?.gymId, loadGym])
  );

  const handleUpdate = async () => {
    if (!profile?.gymId || !gymName.trim()) return;
    setLoading(true);
    try {
      await updateGym(profile.gymId, { gymName: gymName.trim(), location: location.trim() });
      await loadGym(profile.gymId);
      Alert.alert('Saved', 'Gym details updated.');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['owner']}>
      <ScreenContainer keyboardAvoid>
        <Header title="Gym" subtitle="Settings & join code" />

        {gym && (
          <>
            <SectionLabel title="Join code" />
            <Card>
              <AppText variant="caption" secondary>Share with members and trainers</AppText>
              <AppText variant="stat" style={{ color: colors.primary, letterSpacing: 3, marginVertical: spacing.sm }}>
                {gym.gymCode}
              </AppText>
              <AppText variant="small" muted>Plan · {gym.subscriptionPlan}</AppText>
            </Card>
          </>
        )}

        <SectionLabel title="Details" />
        <Input label="Gym name" value={gymName} onChangeText={setGymName} />
        <Input label="Location" value={location} onChangeText={setLocation} />
        <Button title="Save changes" onPress={handleUpdate} loading={loading} />
      </ScreenContainer>
    </RoleGuard>
  );
}
