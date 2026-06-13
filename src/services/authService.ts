import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { RegisterPayload, UserProfile, UserRole } from '../types';

const USERS_COLLECTION = 'users';

function toISOString(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
}

export function mapUserDoc(id: string, data: Record<string, unknown>): UserProfile {
  return {
    userId: id,
    gymId: (data.gymId as string | null) ?? null,
    name: (data.name as string) ?? '',
    email: (data.email as string) ?? '',
    role: (data.role as UserRole) ?? 'member',
    age: data.age as number | undefined,
    weight: data.weight as number | undefined,
    height: data.height as number | undefined,
    goal: data.goal as string | undefined,
    trainerId: data.trainerId as string | undefined,
    membershipStatus: data.membershipStatus as UserProfile['membershipStatus'],
    expiryDate: data.expiryDate as string | undefined,
    createdAt: toISOString(data.createdAt),
    updatedAt: toISOString(data.updatedAt),
  };
}

export async function registerUser(payload: RegisterPayload): Promise<UserProfile> {
  const credential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
  const now = new Date().toISOString();

  const profile: UserProfile = {
    userId: credential.user.uid,
    gymId: null,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    age: payload.age,
    weight: payload.weight,
    height: payload.height,
    goal: payload.goal,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, USERS_COLLECTION, credential.user.uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return profile;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS_COLLECTION, userId));
  if (!snap.exists()) return null;
  return mapUserDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  await setDoc(
    doc(db, USERS_COLLECTION, userId),
    { ...updates, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
