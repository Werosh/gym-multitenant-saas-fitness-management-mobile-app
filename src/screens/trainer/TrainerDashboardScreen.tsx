import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { AppText } from '../../components/ui/AppText';
import { Button } from '../../components/ui/Button';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { useGymStore } from '../../stores/gymStore';
import { getMembersByTrainer } from '../../services/memberService';
import { getWorkoutsByTrainer } from '../../services/workoutService';
import { TrainerStackParamList } from '../../navigation/types';
import { spacing } from '../../config/theme';

type Nav = NativeStackNavigationProp<TrainerStackParamList>;

export function TrainerDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
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
        <Header
          title="Trainer Dashboard"
          subtitle={`Welcome, ${profile?.name ?? 'Trainer'}`}
          rightAction={{ label: 'Logout', onPress: logout }}
        />

        <View style={styles.statsGrid}>
          <StatCard label="Assigned Members" value={assignedCount} />
          <StatCard label="Active Workouts" value={workoutCount} />
        </View>

        <Card>
          <AppText variant="h3">Quick Actions</AppText>
          <Button
            title="View Assigned Members"
            onPress={() => navigation.navigate('TrainerTabs', { screen: 'Members' })}
            style={styles.btn}
          />
        </Card>

        <Card>
          <AppText variant="h3">Progress Tracking</AppText>
          <AppText secondary style={{ marginTop: spacing.sm }}>
            Update member weight and workout progress from the member detail screen.
          </AppText>
        </Card>
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  btn: {
    marginTop: spacing.md,
  },
});
