import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { AppText } from '../../components/ui/AppText';
import { Button } from '../../components/ui/Button';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { useAuthStore } from '../../stores/authStore';
import { useGymStore } from '../../stores/gymStore';
import {
  checkIn,
  checkOut,
  getActiveCheckIn,
} from '../../services/attendanceService';
import {
  parseQRAttendanceData,
  validateQRCheckIn,
  generateQRAttendancePayload,
} from '../../utils/qrAttendance';
import { AttendanceRecord } from '../../types';
import { spacing } from '../../config/theme';

export function AttendanceScreen() {
  const profile = useAuthStore((s) => s.profile);
  const { attendance, loadAttendance } = useGymStore();
  const [activeSession, setActiveSession] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!profile?.gymId || !profile.userId) return;
    await loadAttendance(profile.gymId, profile.userId);
    setActiveSession(await getActiveCheckIn(profile.gymId, profile.userId));
  }, [profile?.gymId, profile?.userId, loadAttendance]);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const handleCheckIn = async () => {
    if (!profile?.gymId || !profile.userId) return;
    setLoading(true);
    try {
      await checkIn(profile.gymId, profile.userId, profile.name);
      await refresh();
      Alert.alert('Checked in', 'Session started.');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!profile?.gymId || !activeSession) return;
    setLoading(true);
    try {
      await checkOut(profile.gymId, activeSession.attendanceId);
      await refresh();
      Alert.alert('Checked out', 'See you next time.');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateQRScan = () => {
    if (!profile?.gymId || !profile.userId) return;
    const payload = parseQRAttendanceData(
      generateQRAttendancePayload(profile.gymId, profile.userId)
    );
    if (!payload) {
      Alert.alert('Invalid QR', 'Could not parse code.');
      return;
    }
    const validation = validateQRCheckIn(payload, profile.gymId, profile.userId);
    if (!validation.valid) {
      Alert.alert('QR error', validation.error);
      return;
    }
    handleCheckIn();
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleString();

  return (
    <RoleGuard allowedRoles={['member']}>
      <ScreenContainer>
        <Header title="Attendance" subtitle="Track gym visits" />

        <SectionLabel title="Check-in" />
        <Card>
          <AppText variant="caption" secondary style={{ marginBottom: spacing.md }}>
            {activeSession ? 'You have an active session.' : 'Check in manually or via QR.'}
          </AppText>
          {activeSession ? (
            <Button title="Check out" variant="secondary" onPress={handleCheckOut} loading={loading} />
          ) : (
            <>
              <Button title="Check in" onPress={handleCheckIn} loading={loading} />
              <Button title="Simulate QR scan" variant="outline" onPress={handleSimulateQRScan} style={{ marginTop: spacing.sm }} />
            </>
          )}
        </Card>

        <SectionLabel title="History" />
        {attendance.length === 0 ? (
          <EmptyState title="No visits yet" description="Your check-in history appears here." />
        ) : (
          attendance.map((record) => (
            <Card key={record.attendanceId}>
              <View style={styles.historyRow}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <AppText numberOfLines={2}>{formatTime(record.checkInTime)}</AppText>
                  {record.checkOutTime && (
                    <AppText variant="caption" secondary numberOfLines={1}>
                      Out · {formatTime(record.checkOutTime)}
                    </AppText>
                  )}
                </View>
                <StatusBadge label={record.checkOutTime ? 'Done' : 'Active'} tone={record.checkOutTime ? 'default' : 'success'} />
              </View>
            </Card>
          ))
        )}
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
