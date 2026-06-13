import React, { useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { AppText } from '../../components/ui/AppText';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { useGymStore } from '../../stores/gymStore';
import { OwnerStackParamList } from '../../navigation/types';
import { deleteTrainer } from '../../services/trainerService';
import { spacing } from '../../config/theme';

type Nav = NativeStackNavigationProp<OwnerStackParamList>;

export function TrainersScreen() {
  const navigation = useNavigation<Nav>();
  const profile = useAuthStore((s) => s.profile);
  const { trainers, members, loadTrainers, loadMembers } = useGymStore();

  useFocusEffect(
    useCallback(() => {
      if (profile?.gymId) {
        loadTrainers(profile.gymId);
        loadMembers(profile.gymId);
      }
    }, [profile?.gymId, loadTrainers, loadMembers])
  );

  const getAssignedCount = (trainerId: string) =>
    members.filter((m) => m.trainerId === trainerId).length;

  const handleDelete = (trainerId: string, name: string) => {
    Alert.alert('Remove Trainer', `Remove ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          if (!profile?.gymId) return;
          await deleteTrainer(profile.gymId, trainerId);
          loadTrainers(profile.gymId);
        },
      },
    ]);
  };

  return (
    <RoleGuard allowedRoles={['owner']}>
      <ScreenContainer>
        <Header
          title="Trainers"
          subtitle={`${trainers.length} total`}
          rightAction={{ label: '+ Add', onPress: () => navigation.navigate('TrainerForm') }}
        />

        {trainers.length === 0 ? (
          <EmptyState title="No trainers yet" description="Add trainers to assign members and create workouts." />
        ) : (
          trainers.map((trainer) => (
            <Card key={trainer.userId}>
              <AppText variant="h3">{trainer.name}</AppText>
              <AppText secondary>{trainer.email}</AppText>
              <AppText variant="caption" secondary style={styles.meta}>
                Assigned members: {getAssignedCount(trainer.userId)}
              </AppText>
              <Button
                title="Remove"
                variant="danger"
                onPress={() => handleDelete(trainer.userId, trainer.name)}
                style={styles.btn}
              />
            </Card>
          ))
        )}
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  meta: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  btn: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    minHeight: 36,
  },
});
