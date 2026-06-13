import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  serverTimestamp,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { AppNotification } from '../types';

const NOTIFICATIONS_COLLECTION = 'notifications';

function toISOString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

export function mapNotificationDoc(id: string, data: Record<string, unknown>): AppNotification {
  return {
    notificationId: id,
    gymId: (data.gymId as string) ?? '',
    userId: (data.userId as string) ?? '',
    title: (data.title as string) ?? '',
    message: (data.message as string) ?? '',
    createdAt: toISOString(data.createdAt),
    read: (data.read as boolean) ?? false,
  };
}

export async function createNotification(
  gymId: string,
  userId: string,
  title: string,
  message: string
): Promise<AppNotification> {
  const ref = doc(collection(db, NOTIFICATIONS_COLLECTION));
  const data = {
    gymId,
    userId,
    title,
    message,
    read: false,
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, data);
  return mapNotificationDoc(ref.id, { ...data, createdAt: new Date().toISOString() });
}

export async function getNotificationsByUser(gymId: string, userId: string): Promise<AppNotification[]> {
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('gymId', '==', gymId),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapNotificationDoc(d.id, d.data() as Record<string, unknown>));
}
