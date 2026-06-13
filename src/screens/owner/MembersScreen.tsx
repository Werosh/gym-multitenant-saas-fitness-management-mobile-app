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
import { useThemeStore } from '../../stores/themeStore';
import { OwnerStackParamList } from '../../navigation/types';
import { deleteMember } from '../../services/memberService';
import { spacing } from '../../config/theme';

type Nav = NativeStackNavigationProp<OwnerStackParamList>;

export function MembersScreen() {
  const navigation = useNavigation<Nav>();
  const profile = useAuthStore((s) => s.profile);
  const { members, trainers, loadMembers, loadTrainers } = useGymStore();
  const colors = useThemeStore((s) => s.colors);

  useFocusEffect(
    useCallback(() => {
      if (profile?.gymId) {
        loadMembers(profile.gymId);
        loadTrainers(profile.gymId);
      }
    }, [profile?.gymId, loadMembers, loadTrainers])
  );

  const getTrainerName = (trainerId?: string) =>
    trainers.find((t) => t.userId === trainerId)?.name ?? 'Unassigned';

  const handleDelete = (memberId: string, name: string) => {
    Alert.alert('Remove Member', `Remove ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          if (!profile?.gymId) return;
          await deleteMember(profile.gymId, memberId);
          loadMembers(profile.gymId);
        },
      },
    ]);
  };

  return (
    <RoleGuard allowedRoles={['owner']}>
      <ScreenContainer>
        <Header
          title="Members"
          subtitle={`${members.length} total`}
          rightAction={{ label: '+ Add', onPress: () => navigation.navigate('MemberForm', {}) }}
        />

        {members.length === 0 ? (
          <EmptyState title="No members yet" description="Add your first member to get started." />
        ) : (
          members.map((member) => (
            <Card key={member.userId}>
              <View style={styles.row}>
                <View style={styles.info}>
                  <AppText variant="h3">{member.name}</AppText>
                  <AppText secondary>{member.email}</AppText>
                  <AppText variant="caption" secondary style={styles.meta}>
                    Trainer: {getTrainerName(member.trainerId)}
                  </AppText>
                  {member.goal && (
                    <AppText variant="caption" secondary>
                      Goal: {member.goal}
                    </AppText>
                  )}
                  <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
                    <AppText variant="small" style={{ color: colors.primary }}>
                      {member.membershipStatus ?? 'active'}
                    </AppText>
                  </View>
                </View>
                <View style={styles.actions}>
                  <Button
                    title="Edit"
                    variant="outline"
                    onPress={() => navigation.navigate('MemberForm', { member })}
                    style={styles.actionBtn}
                  />
                  <Button
                    title="Remove"
                    variant="danger"
                    onPress={() => handleDelete(member.userId, member.name)}
                    style={styles.actionBtn}
                  />
                </View>
              </View>
            </Card>
          ))
        )}
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  meta: {
    marginTop: spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
  },
  actionBtn: {
    paddingVertical: spacing.sm,
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
});
