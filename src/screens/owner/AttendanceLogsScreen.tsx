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
import { useThemeStore } from '../../stores/themeStore';
import { spacing } from '../../config/theme';

export function AttendanceLogsScreen() {
  const profile = useAuthStore((s) => s.profile);
  const { attendance, loadAttendance } = useGymStore();
  const colors = useThemeStore((s) => s.colors);

  useFocusEffect(
    useCallback(() => {
      if (profile?.gymId) loadAttendance(profile.gymId);
    }, [profile?.gymId, loadAttendance])
  );

  const formatTime = (iso: string) => new Date(iso).toLocaleString();

  return (
    <RoleGuard allowedRoles={['owner']}>
      <ScreenContainer>
        <Header title="Attendance Logs" subtitle={`${attendance.length} records`} />

        {attendance.length === 0 ? (
          <EmptyState title="No attendance records" description="Member check-ins will appear here." />
        ) : (
          attendance.map((record) => (
            <Card key={record.attendanceId}>
              <View style={styles.row}>
                <View>
                  <AppText variant="h3">Member {record.memberId.slice(0, 8)}...</AppText>
                  <AppText secondary>Check-in: {formatTime(record.checkInTime)}</AppText>
                  {record.checkOutTime && (
                    <AppText secondary>Check-out: {formatTime(record.checkOutTime)}</AppText>
                  )}
                </View>
                <View style={[styles.status, { backgroundColor: record.checkOutTime ? colors.textSecondary + '30' : colors.success + '30' }]}>
                  <AppText variant="small" style={{ color: record.checkOutTime ? colors.textSecondary : colors.success }}>
                    {record.checkOutTime ? 'Completed' : 'Active'}
                  </AppText>
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
    alignItems: 'center',
  },
  status: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
