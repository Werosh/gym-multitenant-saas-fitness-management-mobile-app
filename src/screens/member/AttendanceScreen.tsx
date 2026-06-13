import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
  const colors = useThemeStore((s) => s.colors);
  const [activeSession, setActiveSession] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!profile?.gymId || !profile.userId) return;
    await loadAttendance(profile.gymId, profile.userId);
    const active = await getActiveCheckIn(profile.gymId, profile.userId);
    setActiveSession(active);
  }, [profile?.gymId, profile?.userId, loadAttendance]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleCheckIn = async () => {
    if (!profile?.gymId || !profile.userId) return;
    setLoading(true);
    try {
      await checkIn(profile.gymId, profile.userId, profile.name);
      await refresh();
      Alert.alert('Checked In', 'You have successfully checked in.');
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
      Alert.alert('Checked Out', 'See you next time!');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  /** QR scanner logic placeholder — simulates scanning a valid QR code. */
  const handleSimulateQRScan = () => {
    if (!profile?.gymId || !profile.userId) return;
    const qrData = generateQRAttendancePayload(profile.gymId, profile.userId);
    const payload = parseQRAttendanceData(qrData);
    if (!payload) {
      Alert.alert('Invalid QR', 'Could not parse QR code.');
      return;
    }
    const validation = validateQRCheckIn(payload, profile.gymId, profile.userId);
    if (!validation.valid) {
      Alert.alert('QR Error', validation.error);
      return;
    }
    handleCheckIn();
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleString();

  return (
    <RoleGuard allowedRoles={['member']}>
      <ScreenContainer>
        <Header title="Attendance" subtitle="Check in to track your visits" />

        <Card>
          <AppText variant="h3">Quick Check-in</AppText>
          <AppText secondary style={{ marginTop: spacing.sm, marginBottom: spacing.md }}>
            {activeSession ? 'You are currently checked in.' : 'Tap below to check in manually or via QR.'}
          </AppText>

          {activeSession ? (
            <Button title="Check Out" variant="secondary" onPress={handleCheckOut} loading={loading} />
          ) : (
            <>
              <Button title="Check In" onPress={handleCheckIn} loading={loading} />
              <Button
                title="Simulate QR Scan"
                variant="outline"
                onPress={handleSimulateQRScan}
                style={{ marginTop: spacing.sm }}
              />
            </>
          )}
        </Card>

        <AppText variant="h3" style={styles.historyTitle}>
          History
        </AppText>

        {attendance.length === 0 ? (
          <EmptyState title="No attendance yet" description="Your check-in history will appear here." />
        ) : (
          attendance.map((record) => (
            <Card key={record.attendanceId}>
              <AppText>{formatTime(record.checkInTime)}</AppText>
              {record.checkOutTime && (
                <AppText secondary>Out: {formatTime(record.checkOutTime)}</AppText>
              )}
              <AppText variant="small" style={{ color: record.checkOutTime ? colors.textSecondary : colors.success, marginTop: 4 }}>
                {record.checkOutTime ? 'Completed' : 'Active session'}
              </AppText>
            </Card>
          ))
        )}
      </ScreenContainer>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  historyTitle: {
    marginBottom: spacing.sm,
  },
});
