import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, getSecondaryAuth } from '../config/firebase';
import { CreateTrainerPayload, UserProfile } from '../types';
import { mapUserDoc } from './authService';

const USERS_COLLECTION = 'users';

export async function getTrainersByGym(gymId: string): Promise<UserProfile[]> {
  const q = query(
    collection(db, USERS_COLLECTION),
    where('gymId', '==', gymId),
    where('role', '==', 'trainer')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapUserDoc(d.id, d.data() as Record<string, unknown>));
}

export async function createTrainer(
  gymId: string,
  payload: CreateTrainerPayload
): Promise<UserProfile> {
  const secondaryAuth = getSecondaryAuth();
  const credential = await createUserWithEmailAndPassword(secondaryAuth, payload.email, payload.password);
  await signOut(secondaryAuth);
  const now = new Date().toISOString();

  const trainer: UserProfile = {
    userId: credential.user.uid,
    gymId,
    name: payload.name,
    email: payload.email,
    role: 'trainer',
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, USERS_COLLECTION, credential.user.uid), {
    ...trainer,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return trainer;
}

export async function deleteTrainer(gymId: string, trainerId: string): Promise<void> {
  await deleteDoc(doc(db, USERS_COLLECTION, trainerId));
}
