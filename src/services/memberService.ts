import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, getSecondaryAuth } from '../config/firebase';
import { CreateMemberPayload, MembershipPlan, UserProfile } from '../types';
import { mapUserDoc } from './authService';
import { createMembership } from './membershipService';

const USERS_COLLECTION = 'users';

export async function getMembersByGym(gymId: string): Promise<UserProfile[]> {
  const q = query(
    collection(db, USERS_COLLECTION),
    where('gymId', '==', gymId),
    where('role', '==', 'member')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapUserDoc(d.id, d.data() as Record<string, unknown>));
}

export async function createMember(
  gymId: string,
  payload: CreateMemberPayload
): Promise<UserProfile> {
  const secondaryAuth = getSecondaryAuth();
  const credential = await createUserWithEmailAndPassword(secondaryAuth, payload.email, payload.password);
  await signOut(secondaryAuth);
  const now = new Date().toISOString();

  const member: UserProfile = {
    userId: credential.user.uid,
    gymId,
    name: payload.name,
    email: payload.email,
    role: 'member',
    age: payload.age,
    weight: payload.weight,
    height: payload.height,
    goal: payload.goal,
    trainerId: payload.trainerId,
    membershipStatus: 'active',
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, USERS_COLLECTION, credential.user.uid), {
    ...member,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await createMembership(gymId, credential.user.uid, payload.plan);

  return member;
}

export async function updateMember(
  gymId: string,
  memberId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  const memberRef = doc(db, USERS_COLLECTION, memberId);
  await updateDoc(memberRef, { ...updates, gymId, updatedAt: serverTimestamp() });
}

export async function deleteMember(gymId: string, memberId: string): Promise<void> {
  const memberRef = doc(db, USERS_COLLECTION, memberId);
  await deleteDoc(memberRef);
}

export async function assignTrainerToMember(
  gymId: string,
  memberId: string,
  trainerId: string
): Promise<void> {
  await updateMember(gymId, memberId, { trainerId });
}

export async function getMembersByTrainer(gymId: string, trainerId: string): Promise<UserProfile[]> {
  const q = query(
    collection(db, USERS_COLLECTION),
    where('gymId', '==', gymId),
    where('role', '==', 'member'),
    where('trainerId', '==', trainerId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapUserDoc(d.id, d.data() as Record<string, unknown>));
}

export function calculateExpiryDate(plan: MembershipPlan): string {
  const date = new Date();
  if (plan === 'monthly') {
    date.setMonth(date.getMonth() + 1);
  } else {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date.toISOString();
}
