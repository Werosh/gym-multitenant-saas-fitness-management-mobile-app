import React, { useState } from 'react';
import { View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthLayout } from '../../components/ui/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppText } from '../../components/ui/AppText';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { AuthStackParamList } from '../../navigation/types';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import { spacing } from '../../config/theme';
import { DemoLoginFab } from '../../components/ui/DemoLoginFab';

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
    if (!isValidPassword(password)) errors.password = 'Minimum 6 characters';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await login(email.trim(), password);
    } catch {
      Alert.alert('Sign in failed', error ?? 'Check your credentials and try again.');
    }
  };

  return (
    <View style={styles.screen}>
      <AuthLayout
      headline="Sign in"
      subline="Use your MyGymHere account credentials."
      footer={
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.footerLink}>
          <AppText secondary>
            No account? <AppText style={{ color: colors.primary, fontWeight: '600' }}>Register</AppText>
          </AppText>
        </TouchableOpacity>
      }
    >
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
        <AppText style={{ color: colors.error, marginBottom: spacing.sm, fontSize: 13 }}>{error}</AppText>
      )}

      <Button title="Sign in" onPress={handleLogin} loading={isLoading} />
      <AppText variant="small" muted style={styles.hint}>
        Demo: owner@mygymhere.com · password123
      </AppText>
    </AuthLayout>
      <DemoLoginFab />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  footerLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  hint: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
