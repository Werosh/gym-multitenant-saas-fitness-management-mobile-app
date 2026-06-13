import React, { useCallback } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { AppText } from '../../components/ui/AppText';
import { StatusBadge } from '../../components/ui/StatusBadge';
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
    Alert.alert('Remove member', `Remove ${name}?`, [
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
          subtitle={`${members.length} registered`}
          rightAction={{ label: 'Add', onPress: () => navigation.navigate('MemberForm', {}) }}
        />

        {members.length === 0 ? (
          <EmptyState title="No members" description="Add members to start tracking memberships and attendance." />
        ) : (
          members.map((member) => (
            <Card key={member.userId}>
              <View style={styles.top}>
                <View style={styles.info}>
                  <AppText variant="h3" style={styles.name}>{member.name}</AppText>
                  <AppText variant="caption" secondary>{member.email}</AppText>
                </View>
                <StatusBadge
                  label={member.membershipStatus ?? 'active'}
                  tone={member.membershipStatus === 'expired' ? 'warning' : 'success'}
                />
              </View>

              <AppText variant="small" muted style={styles.detail}>
                Trainer · {getTrainerName(member.trainerId)}
                {member.goal ? `  ·  ${member.goal}` : ''}
              </AppText>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation.navigate('MemberForm', { member })}>
                  <AppText style={{ color: colors.primary, fontWeight: '600', fontSize: 13 }}>Edit</AppText>
                </TouchableOpacity>
                <View style={[styles.actionSep, { backgroundColor: colors.border }]} />
                <TouchableOpacity onPress={() => handleDelete(member.userId, member.name)}>
                  <AppText style={{ color: colors.error, fontWeight: '600', fontSize: 13 }}>Remove</AppText>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: { flex: 1, paddingRight: spacing.sm },
  name: { fontSize: 16, marginBottom: 2 },
  detail: { marginTop: spacing.sm },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128,128,128,0.2)',
    gap: spacing.md,
  },
  actionSep: {
    width: 1,
    height: 14,
  },
});
