import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { StatCard } from '../../components/ui/StatCard';
import { StatGrid } from '../../components/ui/StatGrid';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { Card } from '../../components/ui/Card';
import { AppText } from '../../components/ui/AppText';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { getAllGyms } from '../../services/gymService';
import { Gym } from '../../types';
import { spacing } from '../../config/theme';

export function AdminDashboardScreen() {
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const colors = useThemeStore((s) => s.colors);
  const [gyms, setGyms] = useState<Gym[]>([]);

  useFocusEffect(useCallback(() => { getAllGyms().then(setGyms); }, []));

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <ScreenContainer>
        <Header title="Platform" subtitle={profile?.name ?? 'Admin'} rightAction={{ label: 'Sign out', onPress: logout }} />

        <SectionLabel title="Overview" />
        <StatGrid>
          <StatCard label="Gyms" value={gyms.length} />
          <StatCard label="Status" value="Active" accent={colors.success} />
        </StatGrid>

        <SectionLabel title="Registered gyms" />
        <Card padded={false}>
          {gyms.length === 0 ? (
            <AppText secondary style={styles.empty}>No gyms registered yet.</AppText>
          ) : (
            gyms.map((gym, index) => (
              <View
                key={gym.gymId}
                style={[
                  styles.gymRow,
                  index > 0 && { borderTopColor: colors.borderSubtle, borderTopWidth: StyleSheet.hairlineWidth },
                ]}
              >
                <AppText variant="h3" numberOfLines={1}>{gym.gymName}</AppText>
                <AppText variant="caption" secondary numberOfLines={1}>{gym.location}</AppText>
                <AppText variant="small" muted style={{ marginTop: 4 }}>
                  {gym.subscriptionPlan} · {gym.gymCode}
                </AppText>
              </View>
            ))
          )}
        </Card>
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  empty: { padding: spacing.md },
  gymRow: { padding: spacing.md },
});
