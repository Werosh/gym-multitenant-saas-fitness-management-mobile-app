import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { AttendanceRecord } from '../types';

const ATTENDANCE_COLLECTION = 'attendance';

function toISOString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

export function mapAttendanceDoc(id: string, data: Record<string, unknown>): AttendanceRecord {
  return {
    attendanceId: id,
    gymId: (data.gymId as string) ?? '',
    memberId: (data.memberId as string) ?? '',
    memberName: data.memberName as string | undefined,
    checkInTime: toISOString(data.checkInTime),
    checkOutTime: data.checkOutTime ? toISOString(data.checkOutTime) : undefined,
  };
}

export async function checkIn(gymId: string, memberId: string, memberName?: string): Promise<AttendanceRecord> {
  const ref = doc(collection(db, ATTENDANCE_COLLECTION));
  const data = {
    gymId,
    memberId,
    memberName,
    checkInTime: serverTimestamp(),
  };
  await setDoc(ref, data);
  return mapAttendanceDoc(ref.id, { ...data, checkInTime: new Date().toISOString() });
}

export async function checkOut(gymId: string, attendanceId: string): Promise<void> {
  await updateDoc(doc(db, ATTENDANCE_COLLECTION, attendanceId), {
    checkOutTime: serverTimestamp(),
    gymId,
  });
}

export async function getAttendanceByGym(gymId: string): Promise<AttendanceRecord[]> {
  const q = query(
    collection(db, ATTENDANCE_COLLECTION),
    where('gymId', '==', gymId),
    orderBy('checkInTime', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapAttendanceDoc(d.id, d.data() as Record<string, unknown>));
}

export async function getAttendanceByMember(gymId: string, memberId: string): Promise<AttendanceRecord[]> {
  const q = query(
    collection(db, ATTENDANCE_COLLECTION),
    where('gymId', '==', gymId),
    where('memberId', '==', memberId),
    orderBy('checkInTime', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapAttendanceDoc(d.id, d.data() as Record<string, unknown>));
}

export async function getActiveCheckIn(gymId: string, memberId: string): Promise<AttendanceRecord | null> {
  const records = await getAttendanceByMember(gymId, memberId);
  return records.find((r) => !r.checkOutTime) ?? null;
}

export async function getTodayAttendanceCount(gymId: string): Promise<number> {
  const records = await getAttendanceByGym(gymId);
  const today = new Date().toDateString();
  return records.filter((r) => new Date(r.checkInTime).toDateString() === today).length;
}
