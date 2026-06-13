import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { GoogleProfileSetupPayload, RegisterPayload, UserProfile, UserRole } from '../types';
import { getGymByCode } from './gymService';

const USERS_COLLECTION = 'users';

function mapFirestoreProfile(userId: string, data: Record<string, unknown>): UserProfile {
  return {
    userId,
    gymId: (data.gymId as string | null) ?? null,
    name: data.name as string,
    email: data.email as string,
    role: data.role as UserRole,
    age: data.age as number | undefined,
    weight: data.weight as number | undefined,
    height: data.height as number | undefined,
    goal: data.goal as string | undefined,
    trainerId: data.trainerId as string | undefined,
    membershipStatus: data.membershipStatus as UserProfile['membershipStatus'],
    expiryDate: data.expiryDate as string | undefined,
    createdAt: data.createdAt as string,
    updatedAt: data.updatedAt as string,
  };
}

function mapAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled.';
    default:
      return err instanceof Error ? err.message : 'Authentication failed.';
  }
}

async function resolveGymId(role: UserRole, gymCode?: string): Promise<string | null> {
  if (role === 'owner' || role === 'super_admin') return null;
  if (!gymCode) throw new Error('Gym code is required.');
  const gym = await getGymByCode(gymCode);
  if (!gym) throw new Error('Invalid gym code. Please check and try again.');
  return gym.gymId;
}

async function createUserProfileDocument(
  userId: string,
  payload: {
    email: string;
    name: string;
    role: UserRole;
    gymCode?: string;
    goal?: string;
  },
): Promise<UserProfile> {
  const gymId = await resolveGymId(payload.role, payload.gymCode);
  const ts = new Date().toISOString();
  const profile: UserProfile = {
    userId,
    gymId,
    name: payload.name.trim(),
    email: payload.email.trim(),
    role: payload.role,
    goal: payload.goal?.trim() || undefined,
    createdAt: ts,
    updatedAt: ts,
  };

  await setDoc(doc(db, USERS_COLLECTION, userId), profile);
  return profile;
}

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const profile = await fetchUserProfile(credential.user.uid);
    if (!profile) {
      throw new Error('Account profile not found. Please complete registration.');
    }
    return profile;
  } catch (err) {
    throw new Error(mapAuthError(err));
  }
}

export async function registerUser(payload: RegisterPayload): Promise<UserProfile> {
  try {
    const email = payload.email.trim();
    const credential = await createUserWithEmailAndPassword(auth, email, payload.password);
    if (payload.name.trim()) {
      await updateProfile(credential.user, { displayName: payload.name.trim() });
    }
    return createUserProfileDocument(credential.user.uid, {
      email,
      name: payload.name,
      role: payload.role,
      gymCode: payload.gymCode,
      goal: payload.goal,
    });
  } catch (err) {
    throw new Error(mapAuthError(err));
  }
}

export async function loginWithGoogleIdToken(idToken: string): Promise<{
  profile: UserProfile | null;
  firebaseUser: FirebaseUser;
}> {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    const profile = await fetchUserProfile(result.user.uid);
    return { profile, firebaseUser: result.user };
  } catch (err) {
    throw new Error(mapAuthError(err));
  }
}

export async function completeGoogleProfileSetup(
  userId: string,
  email: string,
  payload: GoogleProfileSetupPayload,
): Promise<UserProfile> {
  const existing = await fetchUserProfile(userId);
  if (existing) throw new Error('Profile already exists.');

  return createUserProfileDocument(userId, {
    email,
    name: payload.name.trim(),
    role: payload.role,
    gymCode: payload.gymCode,
    goal: payload.goal,
  });
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS_COLLECTION, userId));
  if (!snap.exists()) return null;
  return mapFirestoreProfile(snap.id, snap.data() as Record<string, unknown>);
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  const { userId: _id, createdAt, ...rest } = updates;
  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    ...rest,
    updatedAt: new Date().toISOString(),
  });
}

export function subscribeAuthState(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function cancelIncompleteGoogleSignIn(): Promise<void> {
  const profile = auth.currentUser ? await fetchUserProfile(auth.currentUser.uid) : null;
  if (!profile && auth.currentUser) {
    await signOut(auth);
  }
}
