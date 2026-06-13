import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppText } from '../../components/ui/AppText';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { ResponsiveRow } from '../../components/ui/ResponsiveRow';
import { useAuthStore } from '../../stores/authStore';
import { TrainerStackParamList } from '../../navigation/types';
import { updateMember } from '../../services/memberService';
import { spacing } from '../../config/theme';

type Route = RouteProp<TrainerStackParamList, 'MemberProgress'>;

export function MemberProgressScreen() {
  const route = useRoute<Route>();
  const { memberId, memberName } = route.params;
  const profile = useAuthStore((s) => s.profile);
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!profile?.gymId) return;
    setLoading(true);
    try {
      await updateMember(profile.gymId, memberId, {
        weight: weight ? parseFloat(weight) : undefined,
        goal: goal.trim() || undefined,
      });
      Alert.alert('Saved', 'Member progress updated.');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer keyboardAvoid>
      <AppText variant="h3" style={{ marginBottom: spacing.md }} numberOfLines={2}>
        {memberName}
      </AppText>

      <SectionLabel title="Progress" />
      <ResponsiveRow>
        <Input label="Weight kg" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
        <Input label="Goal" value={goal} onChangeText={setGoal} />
      </ResponsiveRow>

      <Button title="Save" onPress={handleUpdate} loading={loading} />
    </ScreenContainer>
  );
}
