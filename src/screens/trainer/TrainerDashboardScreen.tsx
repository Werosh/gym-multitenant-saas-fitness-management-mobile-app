import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { getMembersByTrainer } from '../../services/memberService';
import { getWorkoutsByTrainer } from '../../services/workoutService';
import { TrainerStackParamList } from '../../navigation/types';
import { spacing } from '../../config/theme';

type Nav = NativeStackNavigationProp<TrainerStackParamList>;

export function TrainerDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const colors = useThemeStore((s) => s.colors);
  const [assignedCount, setAssignedCount] = useState(0);
  const [workoutCount, setWorkoutCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (!profile?.gymId || !profile.userId) return;
      Promise.all([
        getMembersByTrainer(profile.gymId, profile.userId),
        getWorkoutsByTrainer(profile.gymId, profile.userId),
      ]).then(([members, workouts]) => {
        setAssignedCount(members.length);
        setWorkoutCount(workouts.length);
      });
    }, [profile?.gymId, profile?.userId])
  );

  return (
    <RoleGuard allowedRoles={['trainer']}>
      <ScreenContainer>
        <Header title="Dashboard" subtitle={profile?.name ?? 'Trainer'} rightAction={{ label: 'Sign out', onPress: logout }} />

        <SectionLabel title="Overview" />
        <StatGrid>
          <StatCard label="Members" value={assignedCount} />
          <StatCard label="Workout plans" value={workoutCount} />
        </StatGrid>

        <SectionLabel title="Actions" />
        <Card padded={false}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => navigation.navigate('TrainerTabs', { screen: 'Members' })}
          >
            <AppText variant="h3" style={styles.linkTitle}>Assigned members</AppText>
            <AppText style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>View</AppText>
          </TouchableOpacity>
        </Card>
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  linkTitle: { fontSize: 15, flex: 1, minWidth: 0 },
});
