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
import { isValidEmail, isValidPassword } from '../../utils/validators';
import { spacing } from '../../config/theme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login, isLoading, error, clearError } = useAuthStore();
  const colors = useThemeStore((s) => s.colors);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    clearError();
    const errors: typeof fieldErrors = {};
    if (!isValidEmail(email)) errors.email = 'Enter a valid email';
    if (!isValidPassword(password)) errors.password = 'Password must be at least 6 characters';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await login(email.trim(), password);
    } catch {
      Alert.alert('Login Failed', error ?? 'Unable to sign in. Please try again.');
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <AppText variant="h1">GymHub</AppText>
        <AppText secondary style={styles.subtitle}>
          Multi-gym management platform
        </AppText>
      </View>

      <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <AppText variant="h3" style={styles.formTitle}>
          Sign In
        </AppText>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={fieldErrors.email}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={fieldErrors.password}
        />

        {error && (
          <AppText style={{ color: colors.error, marginBottom: spacing.sm }}>{error}</AppText>
        )}

        <Button title="Sign In" onPress={handleLogin} loading={isLoading} />

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
          <AppText secondary>
            Don't have an account?{' '}
            <AppText style={{ color: colors.primary }}>Register</AppText>
          </AppText>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  form: {
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
  },
  formTitle: {
    marginBottom: spacing.lg,
  },
  link: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
});
