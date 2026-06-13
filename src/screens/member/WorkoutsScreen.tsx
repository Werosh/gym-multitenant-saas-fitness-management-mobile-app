import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { AppText } from '../../components/ui/AppText';
import { EmptyState } from '../../components/ui/EmptyState';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { useGymStore } from '../../stores/gymStore';
import { spacing } from '../../config/theme';

export function WorkoutsScreen() {
  const profile = useAuthStore((s) => s.profile);
  const { workouts, loadWorkouts } = useGymStore();

  useFocusEffect(
    useCallback(() => {
      if (profile?.gymId && profile.userId) {
        loadWorkouts(profile.gymId, { memberId: profile.userId });
      }
    }, [profile?.gymId, profile?.userId, loadWorkouts])
  );

  return (
    <RoleGuard allowedRoles={['member']}>
      <ScreenContainer>
        <Header title="My Workouts" subtitle={`${workouts.length} plans`} />

        {workouts.length === 0 ? (
          <EmptyState title="No workouts assigned" description="Your trainer will create workout plans for you." />
        ) : (
          workouts.map((workout) => (
            <Card key={workout.workoutId}>
              <AppText variant="h3">{workout.title}</AppText>
              <AppText variant="caption" secondary style={styles.meta}>
                {workout.exercises.length} exercises
              </AppText>
              {workout.exercises.map((exercise, i) => (
                <View key={i} style={styles.exercise}>
                  <AppText>{exercise.exerciseName}</AppText>
                  <AppText variant="caption" secondary>
                    {exercise.sets} sets × {exercise.reps} reps
                    {exercise.weight > 0 ? ` @ ${exercise.weight}kg` : ''} · Rest {exercise.restTime}s
                  </AppText>
                </View>
              ))}
            </Card>
          ))
        )}
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  meta: {
    marginBottom: spacing.sm,
  },
  exercise: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#334155',
  },
});
