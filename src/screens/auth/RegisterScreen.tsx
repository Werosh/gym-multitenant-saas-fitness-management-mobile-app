import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppText } from '../../components/ui/AppText';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { AuthStackParamList } from '../../navigation/types';
import { UserRole } from '../../types';
import { isValidEmail, isValidPassword, isValidGymCode } from '../../utils/validators';
import { getRoleLabel } from '../../utils/roleUtils';
import { spacing } from '../../config/theme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const ROLES: UserRole[] = ['owner', 'trainer', 'member'];

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

    if (!name.trim()) {
      Alert.alert('Validation', 'Name is required');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Validation', 'Enter a valid email');
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert('Validation', 'Password must be at least 6 characters');
      return;
    }
    if (role !== 'owner' && !isValidGymCode(gymCode)) {
      Alert.alert('Validation', 'Enter a valid 6-character gym code');
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
      Alert.alert('Registration Failed', err instanceof Error ? err.message : 'Unable to register');
    }
  };

  return (
    <ScreenContainer>
      <AppText variant="h2" style={styles.title}>
        Create Account
      </AppText>

      <Input label="Full Name" value={name} onChangeText={setName} />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <AppText variant="caption" secondary style={styles.roleLabel}>
        Select Role
      </AppText>
      <View style={styles.roleRow}>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r}
            style={[
              styles.roleChip,
              {
                backgroundColor: role === r ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setRole(r)}
          >
            <AppText style={{ color: role === r ? '#FFF' : colors.text, fontSize: 13 }}>
              {getRoleLabel(r)}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {role !== 'owner' && (
        <Input
          label="Gym Code"
          value={gymCode}
          onChangeText={setGymCode}
          autoCapitalize="characters"
          maxLength={6}
          placeholder="ABC123"
        />
      )}

      {role === 'member' && (
        <Input label="Fitness Goal (optional)" value={goal} onChangeText={setGoal} />
      )}

      <Button title="Register" onPress={handleRegister} loading={isLoading} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
        <AppText secondary>
          Already have an account? <AppText style={{ color: colors.primary }}>Sign In</AppText>
        </AppText>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.lg,
  },
  roleLabel: {
    marginBottom: spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  roleChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  link: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
});
