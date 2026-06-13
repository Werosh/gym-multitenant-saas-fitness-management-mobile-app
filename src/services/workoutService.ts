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
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Exercise, Workout } from '../types';

const WORKOUTS_COLLECTION = 'workouts';

function toISOString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

export function mapWorkoutDoc(id: string, data: Record<string, unknown>): Workout {
  return {
    workoutId: id,
    gymId: (data.gymId as string) ?? '',
    memberId: (data.memberId as string) ?? '',
    trainerId: (data.trainerId as string) ?? '',
    title: (data.title as string) ?? 'Workout Plan',
    exercises: (data.exercises as Exercise[]) ?? [],
    createdAt: toISOString(data.createdAt),
    updatedAt: toISOString(data.updatedAt),
  };
}

export async function getWorkoutsByGym(gymId: string): Promise<Workout[]> {
  const q = query(collection(db, WORKOUTS_COLLECTION), where('gymId', '==', gymId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapWorkoutDoc(d.id, d.data() as Record<string, unknown>));
}

export async function getWorkoutsByMember(gymId: string, memberId: string): Promise<Workout[]> {
  const q = query(
    collection(db, WORKOUTS_COLLECTION),
    where('gymId', '==', gymId),
    where('memberId', '==', memberId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapWorkoutDoc(d.id, d.data() as Record<string, unknown>));
}

export async function getWorkoutsByTrainer(gymId: string, trainerId: string): Promise<Workout[]> {
  const q = query(
    collection(db, WORKOUTS_COLLECTION),
    where('gymId', '==', gymId),
    where('trainerId', '==', trainerId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapWorkoutDoc(d.id, d.data() as Record<string, unknown>));
}

export async function createWorkout(
  gymId: string,
  memberId: string,
  trainerId: string,
  title: string,
  exercises: Exercise[]
): Promise<Workout> {
  const ref = doc(collection(db, WORKOUTS_COLLECTION));
  const data = {
    gymId,
    memberId,
    trainerId,
    title,
    exercises,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, data);
  return mapWorkoutDoc(ref.id, { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
}

export async function updateWorkout(
  gymId: string,
  workoutId: string,
  updates: { title?: string; exercises?: Exercise[] }
): Promise<void> {
  await updateDoc(doc(db, WORKOUTS_COLLECTION, workoutId), {
    ...updates,
    gymId,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteWorkout(gymId: string, workoutId: string): Promise<void> {
  await deleteDoc(doc(db, WORKOUTS_COLLECTION, workoutId));
}
