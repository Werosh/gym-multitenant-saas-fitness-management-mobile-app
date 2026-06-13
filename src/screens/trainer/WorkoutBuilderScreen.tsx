import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { ResponsiveRow } from '../../components/ui/ResponsiveRow';
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
      Alert.alert('Required', 'Title and exercise names are required');
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
    <ScreenContainer keyboardAvoid>
      <AppText variant="h3" style={styles.subtitle} numberOfLines={2}>
        {memberName}
      </AppText>

      <SectionLabel title="Plan" />
      <Input label="Title" value={title} onChangeText={setTitle} />

      {exercises.map((exercise, index) => (
        <Card key={index}>
          <AppText variant="label" secondary style={{ marginBottom: spacing.sm }}>
            Exercise {index + 1}
          </AppText>
          <Input
            label="Name"
            value={exercise.exerciseName}
            onChangeText={(v) => updateExercise(index, 'exerciseName', v)}
          />
          <ResponsiveRow>
            <Input label="Sets" value={String(exercise.sets)} onChangeText={(v) => updateExercise(index, 'sets', v)} keyboardType="numeric" />
            <Input label="Reps" value={String(exercise.reps)} onChangeText={(v) => updateExercise(index, 'reps', v)} keyboardType="numeric" />
          </ResponsiveRow>
          <ResponsiveRow>
            <Input label="Weight kg" value={String(exercise.weight)} onChangeText={(v) => updateExercise(index, 'weight', v)} keyboardType="decimal-pad" />
            <Input label="Rest sec" value={String(exercise.restTime)} onChangeText={(v) => updateExercise(index, 'restTime', v)} keyboardType="numeric" />
          </ResponsiveRow>
        </Card>
      ))}

      <Button title="Add exercise" variant="outline" onPress={() => setExercises((prev) => [...prev, emptyExercise()])} style={styles.addBtn} />
      <Button title={workout ? 'Save changes' : 'Save plan'} onPress={handleSave} loading={loading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginBottom: spacing.md },
  addBtn: { marginBottom: spacing.md },
});
