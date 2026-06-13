import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
import { getMembersByTrainer } from '../../services/memberService';
import { UserProfile } from '../../types';
import { TrainerStackParamList } from '../../navigation/types';
import { spacing } from '../../config/theme';

type Nav = NativeStackNavigationProp<TrainerStackParamList>;

export function AssignedMembersScreen() {
  const navigation = useNavigation<Nav>();
  const profile = useAuthStore((s) => s.profile);
  const [members, setMembers] = useState<UserProfile[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!profile?.gymId || !profile.userId) return;
      getMembersByTrainer(profile.gymId, profile.userId).then(setMembers);
    }, [profile?.gymId, profile?.userId])
  );

  return (
    <RoleGuard allowedRoles={['trainer']}>
      <ScreenContainer>
        <Header title="Assigned Members" subtitle={`${members.length} members`} />

        {members.length === 0 ? (
          <EmptyState title="No assigned members" description="Your gym owner will assign members to you." />
        ) : (
          members.map((member) => (
            <Card key={member.userId}>
              <AppText variant="h3">{member.name}</AppText>
              {member.goal && <AppText secondary>Goal: {member.goal}</AppText>}
              {member.weight && (
                <AppText variant="caption" secondary style={styles.meta}>
                  Weight: {member.weight} kg
                </AppText>
              )}
              <View style={styles.actions}>
                <Button
                  title="Create Workout"
                  onPress={() =>
                    navigation.navigate('WorkoutBuilder', {
                      memberId: member.userId,
                      memberName: member.name,
                    })
                  }
                  style={styles.btn}
                />
                <Button
                  title="Progress"
                  variant="outline"
                  onPress={() =>
                    navigation.navigate('MemberProgress', {
                      memberId: member.userId,
                      memberName: member.name,
                    })
                  }
                  style={styles.btn}
                />
              </View>
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
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  btn: {
    flex: 1,
    minHeight: 40,
    paddingVertical: spacing.sm,
  },
});
