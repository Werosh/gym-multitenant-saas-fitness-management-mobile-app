import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { AppText } from '../../components/ui/AppText';
import { ActionLinks } from '../../components/ui/ActionLinks';
import { ResponsiveRow } from '../../components/ui/ResponsiveRow';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { useResponsive } from '../../hooks/useResponsive';
import { getMembersByTrainer } from '../../services/memberService';
import { UserProfile } from '../../types';
import { TrainerStackParamList } from '../../navigation/types';
import { spacing } from '../../config/theme';

type Nav = NativeStackNavigationProp<TrainerStackParamList>;

export function AssignedMembersScreen() {
  const navigation = useNavigation<Nav>();
  const profile = useAuthStore((s) => s.profile);
  const { stackActions } = useResponsive();
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
        <Header title="Members" subtitle={`${members.length} assigned`} />

        {members.length === 0 ? (
          <EmptyState title="No members" description="Your gym owner will assign members to you." />
        ) : (
          members.map((member) => (
            <Card key={member.userId}>
              <AppText variant="h3" numberOfLines={1}>{member.name}</AppText>
              {member.goal && (
                <AppText variant="caption" secondary numberOfLines={2} style={styles.meta}>
                  {member.goal}
                </AppText>
              )}
              {member.weight != null && (
                <AppText variant="small" muted style={styles.meta}>
                  {member.weight} kg
                </AppText>
              )}

              {stackActions ? (
                <View style={styles.stackActions}>
                  <Button
                    title="Create workout"
                    size="sm"
                    onPress={() =>
                      navigation.navigate('WorkoutBuilder', {
                        memberId: member.userId,
                        memberName: member.name,
                      })
                    }
                  />
                  <Button
                    title="Update progress"
                    variant="outline"
                    size="sm"
                    onPress={() =>
                      navigation.navigate('MemberProgress', {
                        memberId: member.userId,
                        memberName: member.name,
                      })
                    }
                  />
                </View>
              ) : (
                <ResponsiveRow style={styles.actions}>
                  <Button
                    title="Workout"
                    size="sm"
                    onPress={() =>
                      navigation.navigate('WorkoutBuilder', {
                        memberId: member.userId,
                        memberName: member.name,
                      })
                    }
                  />
                  <Button
                    title="Progress"
                    variant="outline"
                    size="sm"
                    onPress={() =>
                      navigation.navigate('MemberProgress', {
                        memberId: member.userId,
                        memberName: member.name,
                      })
                    }
                  />
                </ResponsiveRow>
              )}
            </Card>
          ))
        )}
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  meta: { marginTop: spacing.xs },
  actions: { marginTop: spacing.md },
  stackActions: { marginTop: spacing.md, gap: spacing.sm },
});
