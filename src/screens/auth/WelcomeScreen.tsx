import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthLayout } from '../../components/ui/AuthLayout';
import { AppText } from '../../components/ui/AppText';
import { Button } from '../../components/ui/Button';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { AuthStackParamList } from '../../navigation/types';
import { spacing } from '../../config/theme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const DEMO_ACCOUNTS = [
  { userId: 'user-owner-1', label: 'Owner', desc: 'Manage gym & members' },
  { userId: 'user-trainer-1', label: 'Trainer', desc: 'Build workout plans' },
  { userId: 'user-member-1', label: 'Member', desc: 'Track workouts & attendance' },
];

export function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
  const demoLogin = useAuthStore((s) => s.demoLogin);
  const colors = useThemeStore((s) => s.colors);

  return (
    <AuthLayout
      headline="Run your gym. One platform."
      subline="Memberships, trainers, workouts, and attendance — built for gym operators."
    >
      <View style={styles.main}>
        <Button title="Create account" onPress={() => navigation.navigate('Register')} />
        <Button title="Sign in" variant="outline" onPress={() => navigation.navigate('Login')} style={styles.gap} />

        <SectionLabel title="Quick access" style={styles.section} />
        <View style={[styles.demoPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {DEMO_ACCOUNTS.map((account, index) => (
            <TouchableOpacity
              key={account.userId}
              style={[
                styles.demoRow,
                index < DEMO_ACCOUNTS.length - 1 && {
                  borderBottomColor: colors.borderSubtle,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
              onPress={() => demoLogin(account.userId)}
              activeOpacity={0.7}
            >
              <View style={styles.demoText}>
                <AppText variant="h3" style={styles.demoLabel} numberOfLines={1}>
                  {account.label}
                </AppText>
                <AppText variant="caption" secondary numberOfLines={2}>
                  {account.desc}
                </AppText>
              </View>
              <AppText style={{ color: colors.primary, fontWeight: '600', fontSize: 13, flexShrink: 0 }}>
                Open
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  main: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.md,
    width: '100%',
  },
  gap: { marginTop: spacing.sm },
  section: { marginTop: spacing.xl, marginBottom: spacing.sm },
  demoPanel: {
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    width: '100%',
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: spacing.sm,
  },
  demoText: { flex: 1, minWidth: 0 },
  demoLabel: { fontSize: 15, marginBottom: 2 },
});
