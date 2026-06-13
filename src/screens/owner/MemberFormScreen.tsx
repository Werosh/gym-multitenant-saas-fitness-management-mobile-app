import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppText } from '../../components/ui/AppText';
import { useAuthStore } from '../../stores/authStore';
import { useGymStore } from '../../stores/gymStore';
import { useThemeStore } from '../../stores/themeStore';
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
  const colors = useThemeStore((s) => s.colors);

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

  const handleSave = async () => {
    if (!profile?.gymId || !name.trim()) {
      Alert.alert('Validation', 'Name is required');
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
          Alert.alert('Validation', 'Email and password required for new members');
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
    <ScreenContainer>
      <Input label="Full Name" value={name} onChangeText={setName} />
      {!existing && (
        <>
          <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        </>
      )}
      <Input label="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
      <Input label="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
      <Input label="Height (cm)" value={height} onChangeText={setHeight} keyboardType="decimal-pad" />
      <Input label="Goal" value={goal} onChangeText={setGoal} />

      <AppText variant="caption" secondary>
        Assign Trainer
      </AppText>
      <View style={styles.trainerRow}>
        <TouchableOpacity
          style={[styles.chip, { borderColor: colors.border, backgroundColor: !trainerId ? colors.primary : colors.surface }]}
          onPress={() => setTrainerId('')}
        >
          <AppText style={{ color: !trainerId ? '#FFF' : colors.text, fontSize: 13 }}>None</AppText>
        </TouchableOpacity>
        {trainers.map((t) => (
          <TouchableOpacity
            key={t.userId}
            style={[styles.chip, { borderColor: colors.border, backgroundColor: trainerId === t.userId ? colors.primary : colors.surface }]}
            onPress={() => setTrainerId(t.userId)}
          >
            <AppText style={{ color: trainerId === t.userId ? '#FFF' : colors.text, fontSize: 13 }}>
              {t.name}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {!existing && (
        <>
          <AppText variant="caption" secondary>
            Membership Plan
          </AppText>
          <View style={styles.planRow}>
            {(['monthly', 'yearly'] as MembershipPlan[]).map((p) => (
              <Button
                key={p}
                title={p.charAt(0).toUpperCase() + p.slice(1)}
                variant={plan === p ? 'primary' : 'outline'}
                onPress={() => setPlan(p)}
                style={styles.planBtn}
              />
            ))}
          </View>
        </>
      )}

      <Button title={existing ? 'Update Member' : 'Add Member'} onPress={handleSave} loading={loading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  trainerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  planRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  planBtn: {
    flex: 1,
    minHeight: 40,
  },
});
