import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { ChipSelect } from '../../components/ui/ChipSelect';
import { ResponsiveRow } from '../../components/ui/ResponsiveRow';
import { useAuthStore } from '../../stores/authStore';
import { useGymStore } from '../../stores/gymStore';
import { OwnerStackParamList } from '../../navigation/types';
import { createMember, updateMember } from '../../services/memberService';
import { MembershipPlan } from '../../types';
import { spacing } from '../../config/theme';

type Route = RouteProp<OwnerStackParamList, 'MemberForm'>;

export function MemberFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const existing = route.params?.member;
  const profile = useAuthStore((s) => s.profile);
  const { trainers, loadMembers } = useGymStore();

  const [name, setName] = useState(existing?.name ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(existing?.age?.toString() ?? '');
  const [weight, setWeight] = useState(existing?.weight?.toString() ?? '');
  const [height, setHeight] = useState(existing?.height?.toString() ?? '');
  const [goal, setGoal] = useState(existing?.goal ?? '');
  const [trainerId, setTrainerId] = useState(existing?.trainerId ?? '');
  const [plan, setPlan] = useState<MembershipPlan>('monthly');
  const [loading, setLoading] = useState(false);

  const trainerOptions = [
    { value: '', label: 'None' },
    ...trainers.map((t) => ({ value: t.userId, label: t.name.split(' ')[0] })),
  ];

  const handleSave = async () => {
    if (!profile?.gymId || !name.trim()) {
      Alert.alert('Required', 'Name is required');
      return;
    }
    setLoading(true);
    try {
      if (existing) {
        await updateMember(profile.gymId, existing.userId, {
          name: name.trim(),
          age: age ? parseInt(age, 10) : undefined,
          weight: weight ? parseFloat(weight) : undefined,
          height: height ? parseFloat(height) : undefined,
          goal: goal.trim() || undefined,
          trainerId: trainerId || undefined,
        });
      } else {
        if (!email.trim() || !password) {
          Alert.alert('Required', 'Email and password required');
          setLoading(false);
          return;
        }
        await createMember(profile.gymId, {
          name: name.trim(),
          email: email.trim(),
          password,
          age: age ? parseInt(age, 10) : undefined,
          weight: weight ? parseFloat(weight) : undefined,
          height: height ? parseFloat(height) : undefined,
          goal: goal.trim() || undefined,
          trainerId: trainerId || undefined,
          plan,
        });
      }
      await loadMembers(profile.gymId);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer keyboardAvoid>
      <SectionLabel title="Account" />
      <Input label="Full name" value={name} onChangeText={setName} />
      {!existing && (
        <>
          <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        </>
      )}

      <SectionLabel title="Body metrics" />
      <ResponsiveRow>
        <Input label="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
        <Input label="Weight kg" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
      </ResponsiveRow>
      <ResponsiveRow>
        <Input label="Height cm" value={height} onChangeText={setHeight} keyboardType="decimal-pad" />
        <Input label="Goal" value={goal} onChangeText={setGoal} />
      </ResponsiveRow>

      <SectionLabel title="Trainer" />
      <ChipSelect options={trainerOptions} value={trainerId} onChange={setTrainerId} />

      {!existing && (
        <>
          <SectionLabel title="Membership" />
          <ChipSelect
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
            value={plan}
            onChange={setPlan}
          />
        </>
      )}

      <Button title={existing ? 'Save changes' : 'Add member'} onPress={handleSave} loading={loading} style={{ marginTop: spacing.sm }} />
    </ScreenContainer>
  );
}
