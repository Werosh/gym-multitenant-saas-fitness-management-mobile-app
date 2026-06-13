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
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Membership, MembershipPlan, MembershipStatus } from '../types';
import { calculateExpiryDate } from './memberService';

const MEMBERSHIPS_COLLECTION = 'memberships';

function toISOString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

export function mapMembershipDoc(id: string, data: Record<string, unknown>): Membership {
  return {
    membershipId: id,
    gymId: (data.gymId as string) ?? '',
    memberId: (data.memberId as string) ?? '',
    plan: (data.plan as MembershipPlan) ?? 'monthly',
    startDate: toISOString(data.startDate),
    expiryDate: toISOString(data.expiryDate),
    status: (data.status as MembershipStatus) ?? 'active',
  };
}

export async function createMembership(
  gymId: string,
  memberId: string,
  plan: MembershipPlan
): Promise<Membership> {
  const ref = doc(collection(db, MEMBERSHIPS_COLLECTION));
  const startDate = new Date().toISOString();
  const expiryDate = calculateExpiryDate(plan);

  const data = {
    gymId,
    memberId,
    plan,
    startDate: serverTimestamp(),
    expiryDate,
    status: 'active' as MembershipStatus,
  };

  await setDoc(ref, data);
  return mapMembershipDoc(ref.id, { ...data, startDate, expiryDate });
}

export async function getMembershipsByGym(gymId: string): Promise<Membership[]> {
  const q = query(collection(db, MEMBERSHIPS_COLLECTION), where('gymId', '==', gymId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapMembershipDoc(d.id, d.data() as Record<string, unknown>));
}

export async function getMembershipByMember(gymId: string, memberId: string): Promise<Membership | null> {
  const q = query(
    collection(db, MEMBERSHIPS_COLLECTION),
    where('gymId', '==', gymId),
    where('memberId', '==', memberId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return mapMembershipDoc(docSnap.id, docSnap.data() as Record<string, unknown>);
}

export function getMembershipStatus(membership: Membership): MembershipStatus {
  if (membership.status === 'suspended') return 'suspended';
  if (new Date(membership.expiryDate) < new Date()) return 'expired';
  return 'active';
}

/**
 * Renewal logic structure — implementation pending payment integration.
 */
export async function renewMembership(
  gymId: string,
  membershipId: string,
  plan: MembershipPlan
): Promise<void> {
  const expiryDate = calculateExpiryDate(plan);
  await updateDoc(doc(db, MEMBERSHIPS_COLLECTION, membershipId), {
    plan,
    expiryDate,
    status: 'active',
    startDate: new Date().toISOString(),
    gymId,
  });
}

export async function suspendMembership(gymId: string, membershipId: string): Promise<void> {
  await updateDoc(doc(db, MEMBERSHIPS_COLLECTION, membershipId), {
    status: 'suspended',
    gymId,
  });
}
