import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CreateGymPayload, Gym } from '../types';

const GYMS_COLLECTION = 'gyms';
const USERS_COLLECTION = 'users';

function mapGymDoc(gymId: string, data: Record<string, unknown>): Gym {
  return {
    gymId,
    gymName: data.gymName as string,
    location: data.location as string,
    ownerId: data.ownerId as string,
    gymCode: data.gymCode as string,
    createdAt: data.createdAt as string,
    subscriptionPlan: data.subscriptionPlan as Gym['subscriptionPlan'],
  };
}

function generateGymCode(): string {
  return `GYM${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export async function getGymById(gymId: string): Promise<Gym | null> {
  const snap = await getDoc(doc(db, GYMS_COLLECTION, gymId));
  if (!snap.exists()) return null;
  return mapGymDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function getGymByCode(gymCode: string): Promise<Gym | null> {
  const q = query(
    collection(db, GYMS_COLLECTION),
    where('gymCode', '==', gymCode.trim().toUpperCase()),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const gymDoc = snap.docs[0];
  return mapGymDoc(gymDoc.id, gymDoc.data() as Record<string, unknown>);
}

export async function createGym(ownerId: string, payload: CreateGymPayload): Promise<Gym> {
  const gymRef = doc(collection(db, GYMS_COLLECTION));
  const ts = new Date().toISOString();
  const gym: Gym = {
    gymId: gymRef.id,
    gymName: payload.gymName.trim(),
    location: payload.location.trim(),
    ownerId,
    gymCode: generateGymCode(),
    subscriptionPlan: payload.subscriptionPlan,
    createdAt: ts,
  };

  await setDoc(gymRef, gym);
  await updateDoc(doc(db, USERS_COLLECTION, ownerId), {
    gymId: gym.gymId,
    role: 'owner',
    updatedAt: ts,
  });

  return gym;
}

export async function updateGym(
  gymId: string,
  updates: Partial<Pick<Gym, 'gymName' | 'location' | 'subscriptionPlan'>>,
): Promise<void> {
  await updateDoc(doc(db, GYMS_COLLECTION, gymId), updates);
}

export async function getAllGyms(): Promise<Gym[]> {
  const snap = await getDocs(collection(db, GYMS_COLLECTION));
  return snap.docs.map((gymDoc) => mapGymDoc(gymDoc.id, gymDoc.data() as Record<string, unknown>));
}

export async function linkUserToGym(userId: string, gymId: string): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    gymId,
    updatedAt: new Date().toISOString(),
  });
}
