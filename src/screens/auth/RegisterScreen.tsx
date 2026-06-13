import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { BrandMark } from '../../components/ui/BrandTitle';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppText } from '../../components/ui/AppText';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { AuthStackParamList } from '../../navigation/types';
import { UserRole } from '../../types';
import { isValidEmail, isValidPassword, isValidGymCode } from '../../utils/validators';
import { spacing, borderRadius } from '../../config/theme';
import { DemoLoginFab } from '../../components/ui/DemoLoginFab';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const ROLES: { key: UserRole; label: string }[] = [
  { key: 'owner', label: 'Owner' },
  { key: 'trainer', label: 'Trainer' },
  { key: 'member', label: 'Member' },
];

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register, isLoading, clearError } = useAuthStore();
  const colors = useThemeStore((s) => s.colors);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [gymCode, setGymCode] = useState('');
  const [goal, setGoal] = useState('');

  const handleRegister = async () => {
    clearError();
    if (!name.trim()) { Alert.alert('Required', 'Name is required'); return; }
    if (!isValidEmail(email)) { Alert.alert('Required', 'Enter a valid email'); return; }
    if (!isValidPassword(password)) { Alert.alert('Required', 'Password must be at least 6 characters'); return; }
    if (role !== 'owner' && !isValidGymCode(gymCode)) {
      Alert.alert('Required', 'Enter a valid 6-character gym code');
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        gymCode: role !== 'owner' ? gymCode.toUpperCase() : undefined,
        goal: goal.trim() || undefined,
      });
    } catch (err) {
      Alert.alert('Registration failed', err instanceof Error ? err.message : 'Unable to register');
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenContainer keyboardAvoid>
      <BrandMark compact />
      <AppText variant="h2" style={styles.title}>Create account</AppText>
      <AppText secondary style={styles.sub}>Set up your profile to get started.</AppText>

      <SectionLabel title="Account" />
      <Input label="Full name" value={name} onChangeText={setName} />
      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />

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
          <Input label="Gym code" value={gymCode} onChangeText={setGymCode} autoCapitalize="characters" maxLength={6} placeholder="IRON01" />
        </>
      )}

      {role === 'member' && (
        <Input label="Fitness goal" value={goal} onChangeText={setGoal} placeholder="Optional" />
      )}

      <Button title="Create account" onPress={handleRegister} loading={isLoading} style={styles.submit} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
        <AppText secondary>
          Have an account? <AppText style={{ color: colors.primary, fontWeight: '600' }}>Sign in</AppText>
        </AppText>
      </TouchableOpacity>
    </ScreenContainer>
      <DemoLoginFab />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
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
  link: { marginTop: spacing.lg, alignItems: 'center', paddingBottom: spacing.lg },
});
