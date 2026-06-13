import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { AppText } from '../../components/ui/AppText';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { useGymStore } from '../../stores/gymStore';
import { spacing } from '../../config/theme';

export function AttendanceLogsScreen() {
  const profile = useAuthStore((s) => s.profile);
  const { attendance, loadAttendance } = useGymStore();

  useFocusEffect(
    useCallback(() => {
      if (profile?.gymId) loadAttendance(profile.gymId);
    }, [profile?.gymId, loadAttendance])
  );

  const formatTime = (iso: string) => new Date(iso).toLocaleString();

  return (
    <RoleGuard allowedRoles={['owner']}>
      <ScreenContainer>
        <Header title="Attendance" subtitle={`${attendance.length} records`} />

        {attendance.length === 0 ? (
          <EmptyState title="No records" description="Member check-ins will appear here." />
        ) : (
          attendance.map((record) => (
            <Card key={record.attendanceId}>
              <View style={styles.row}>
                <View style={styles.info}>
                  <AppText variant="h3" numberOfLines={1}>
                    {record.memberName ?? `Member ${record.memberId.slice(0, 6)}`}
                  </AppText>
                  <AppText variant="caption" secondary numberOfLines={2}>
                    In · {formatTime(record.checkInTime)}
                  </AppText>
                  {record.checkOutTime && (
                    <AppText variant="caption" secondary numberOfLines={1}>
                      Out · {formatTime(record.checkOutTime)}
                    </AppText>
                  )}
                </View>
                <StatusBadge
                  label={record.checkOutTime ? 'Done' : 'Active'}
                  tone={record.checkOutTime ? 'default' : 'success'}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  info: { flex: 1, minWidth: 0 },
});
