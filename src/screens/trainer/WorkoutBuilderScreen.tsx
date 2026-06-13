import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../stores/authStore';
import { TrainerStackParamList } from '../../navigation/types';
import { createWorkout, updateWorkout } from '../../services/workoutService';
import { Exercise } from '../../types';
import { spacing } from '../../config/theme';

type Route = RouteProp<TrainerStackParamList, 'WorkoutBuilder'>;

const emptyExercise = (): Exercise => ({
  exerciseName: '',
  sets: 3,
  reps: 10,
  weight: 0,
  restTime: 60,
});

export function WorkoutBuilderScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const { memberId, memberName, workout } = route.params;
  const profile = useAuthStore((s) => s.profile);

  const [title, setTitle] = useState(workout?.title ?? `Plan for ${memberName}`);
  const [exercises, setExercises] = useState<Exercise[]>(
    workout?.exercises?.length ? workout.exercises : [emptyExercise()]
  );
  const [loading, setLoading] = useState(false);

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== index) return ex;
        const numFields: (keyof Exercise)[] = ['sets', 'reps', 'weight', 'restTime'];
        return {
          ...ex,
          [field]: numFields.includes(field) ? parseFloat(value) || 0 : value,
        };
      })
    );
  };

  const handleSave = async () => {
    if (!profile?.gymId || !profile.userId) return;
    if (!title.trim() || exercises.some((e) => !e.exerciseName.trim())) {
      Alert.alert('Validation', 'Title and exercise names are required');
      return;
    }

    setLoading(true);
    try {
      if (workout) {
        await updateWorkout(profile.gymId, workout.workoutId, { title: title.trim(), exercises });
      } else {
        await createWorkout(profile.gymId, memberId, profile.userId, title.trim(), exercises);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <AppText variant="h3" style={styles.subtitle}>
        Workout for {memberName}
      </AppText>

      <Input label="Plan Title" value={title} onChangeText={setTitle} />

      {exercises.map((exercise, index) => (
        <Card key={index}>
          <AppText variant="caption" secondary>
            Exercise {index + 1}
          </AppText>
          <Input
            label="Exercise Name"
            value={exercise.exerciseName}
            onChangeText={(v) => updateExercise(index, 'exerciseName', v)}
          />
          <View style={styles.row}>
            <Input
              label="Sets"
              value={String(exercise.sets)}
              onChangeText={(v) => updateExercise(index, 'sets', v)}
              keyboardType="numeric"
              style={styles.half}
            />
            <Input
              label="Reps"
              value={String(exercise.reps)}
              onChangeText={(v) => updateExercise(index, 'reps', v)}
              keyboardType="numeric"
              style={styles.half}
            />
          </View>
          <View style={styles.row}>
            <Input
              label="Weight (kg)"
              value={String(exercise.weight)}
              onChangeText={(v) => updateExercise(index, 'weight', v)}
              keyboardType="decimal-pad"
              style={styles.half}
            />
            <Input
              label="Rest (sec)"
              value={String(exercise.restTime)}
              onChangeText={(v) => updateExercise(index, 'restTime', v)}
              keyboardType="numeric"
              style={styles.half}
            />
          </View>
        </Card>
      ))}

      <Button
        title="+ Add Exercise"
        variant="outline"
        onPress={() => setExercises((prev) => [...prev, emptyExercise()])}
        style={styles.addBtn}
      />
      <Button title={workout ? 'Update Workout' : 'Save Workout'} onPress={handleSave} loading={loading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
  addBtn: {
    marginBottom: spacing.md,
  },
});
