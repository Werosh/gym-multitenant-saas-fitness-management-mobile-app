import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { useAuthStore } from '../../stores/authStore';
import { useGymStore } from '../../stores/gymStore';
import { createTrainer } from '../../services/trainerService';

export function TrainerFormScreen() {
  const navigation = useNavigation();
  const profile = useAuthStore((s) => s.profile);
  const loadTrainers = useGymStore((s) => s.loadTrainers);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!profile?.gymId || !name.trim() || !email.trim() || !password) {
      Alert.alert('Required', 'All fields are required');
      return;
    }
    setLoading(true);
    try {
      await createTrainer(profile.gymId, { name: name.trim(), email: email.trim(), password });
      await loadTrainers(profile.gymId);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to add trainer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer keyboardAvoid>
      <SectionLabel title="Trainer account" />
      <Input label="Full name" value={name} onChangeText={setName} />
      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Add trainer" onPress={handleSave} loading={loading} />
    </ScreenContainer>
  );
}
