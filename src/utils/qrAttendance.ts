/**
 * QR Attendance logic placeholder.
 * Expected QR payload format: mygymhere://checkin?gymId=xxx&memberId=yyy
 */

export interface QRAttendancePayload {
  gymId: string;
  memberId: string;
}

export function parseQRAttendanceData(data: string): QRAttendancePayload | null {
  try {
    if (data.startsWith('mygymhere://checkin')) {
      const url = new URL(data.replace('mygymhere://', 'https://'));
      const gymId = url.searchParams.get('gymId');
      const memberId = url.searchParams.get('memberId');
      if (gymId && memberId) {
        return { gymId, memberId };
      }
    }

    const parsed = JSON.parse(data);
    if (parsed.gymId && parsed.memberId) {
      return { gymId: parsed.gymId, memberId: parsed.memberId };
    }
  } catch {
    return null;
  }
  return null;
}

export function generateQRAttendancePayload(gymId: string, memberId: string): string {
  return `mygymhere://checkin?gymId=${encodeURIComponent(gymId)}&memberId=${encodeURIComponent(memberId)}`;
}

export function validateQRCheckIn(
  payload: QRAttendancePayload,
  userGymId: string,
  userId: string
): { valid: boolean; error?: string } {
  if (payload.gymId !== userGymId) {
    return { valid: false, error: 'QR code belongs to a different gym.' };
  }
  if (payload.memberId !== userId) {
    return { valid: false, error: 'QR code does not match your member account.' };
  }
  return { valid: true };
}
