import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CreateGymPayload, Gym, SubscriptionPlan } from '../types';
import { generateGymCode } from '../utils/generateGymCode';
import { updateUserProfile } from './authService';

const GYMS_COLLECTION = 'gyms';

function toISOString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

export function mapGymDoc(id: string, data: Record<string, unknown>): Gym {
  return {
    gymId: id,
    gymName: (data.gymName as string) ?? '',
    location: (data.location as string) ?? '',
    ownerId: (data.ownerId as string) ?? '',
    gymCode: (data.gymCode as string) ?? '',
    createdAt: toISOString(data.createdAt),
    subscriptionPlan: (data.subscriptionPlan as SubscriptionPlan) ?? 'basic',
  };
}

export async function createGym(ownerId: string, payload: CreateGymPayload): Promise<Gym> {
  const gymRef = doc(collection(db, GYMS_COLLECTION));
  const gymCode = generateGymCode();

  const gymData = {
    gymName: payload.gymName,
    location: payload.location,
    ownerId,
    gymCode,
    subscriptionPlan: payload.subscriptionPlan,
    createdAt: serverTimestamp(),
  };

  await setDoc(gymRef, gymData);
  await updateUserProfile(ownerId, { gymId: gymRef.id, role: 'owner' });

  return mapGymDoc(gymRef.id, { ...gymData, createdAt: new Date().toISOString() });
}

export async function getGymById(gymId: string): Promise<Gym | null> {
  const snap = await getDoc(doc(db, GYMS_COLLECTION, gymId));
  if (!snap.exists()) return null;
  return mapGymDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function getGymByCode(gymCode: string): Promise<Gym | null> {
  const q = query(
    collection(db, GYMS_COLLECTION),
    where('gymCode', '==', gymCode.toUpperCase())
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return mapGymDoc(docSnap.id, docSnap.data() as Record<string, unknown>);
}

export async function linkUserToGym(userId: string, gymId: string): Promise<void> {
  await updateUserProfile(userId, { gymId });
}

export async function updateGym(
  gymId: string,
  updates: Partial<Pick<Gym, 'gymName' | 'location' | 'subscriptionPlan'>>
): Promise<void> {
  await updateDoc(doc(db, GYMS_COLLECTION, gymId), updates);
}

export async function getAllGyms(): Promise<Gym[]> {
  const snap = await getDocs(collection(db, GYMS_COLLECTION));
  return snap.docs.map((d) => mapGymDoc(d.id, d.data() as Record<string, unknown>));
}
