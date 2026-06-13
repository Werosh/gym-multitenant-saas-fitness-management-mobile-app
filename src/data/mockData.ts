import {
  Gym,
  UserProfile,
  Workout,
  AttendanceRecord,
  Membership,
  RegisterPayload,
  CreateGymPayload,
  CreateMemberPayload,
  CreateTrainerPayload,
  Exercise,
  MembershipPlan,
} from '../types';
import { generateGymCode } from '../utils/generateGymCode';

const now = new Date().toISOString();
const futureDate = new Date();
futureDate.setMonth(futureDate.getMonth() + 6);

export const MOCK_PASSWORD = 'password123';

export const mockGyms: Gym[] = [
  {
    gymId: 'gym-1',
    gymName: 'Iron Fitness Club',
    location: 'Colombo, Sri Lanka',
    ownerId: 'user-owner-1',
    gymCode: 'IRON01',
    createdAt: now,
    subscriptionPlan: 'pro',
  },
];

export const mockUsers: UserProfile[] = [
  {
    userId: 'user-admin-1',
    gymId: null,
    name: 'Super Admin',
    email: 'admin@gymhub.com',
    role: 'super_admin',
    createdAt: now,
    updatedAt: now,
  },
  {
    userId: 'user-owner-1',
    gymId: 'gym-1',
    name: 'Alex Owner',
    email: 'owner@gymhub.com',
    role: 'owner',
    createdAt: now,
    updatedAt: now,
  },
  {
    userId: 'user-trainer-1',
    gymId: 'gym-1',
    name: 'Sam Trainer',
    email: 'trainer@gymhub.com',
    role: 'trainer',
    createdAt: now,
    updatedAt: now,
  },
  {
    userId: 'user-member-1',
    gymId: 'gym-1',
    name: 'Jordan Member',
    email: 'member@gymhub.com',
    role: 'member',
    age: 28,
    weight: 75,
    height: 175,
    goal: 'Build muscle',
    trainerId: 'user-trainer-1',
    membershipStatus: 'active',
    expiryDate: futureDate.toISOString(),
    createdAt: now,
    updatedAt: now,
  },
  {
    userId: 'user-member-2',
    gymId: 'gym-1',
    name: 'Taylor Reed',
    email: 'taylor@gymhub.com',
    role: 'member',
    age: 32,
    weight: 68,
    height: 168,
    goal: 'Lose weight',
    trainerId: 'user-trainer-1',
    membershipStatus: 'active',
    expiryDate: futureDate.toISOString(),
    createdAt: now,
    updatedAt: now,
  },
];

export const mockWorkouts: Workout[] = [
  {
    workoutId: 'workout-1',
    gymId: 'gym-1',
    memberId: 'user-member-1',
    trainerId: 'user-trainer-1',
    title: 'Upper Body Strength',
    exercises: [
      { exerciseName: 'Bench Press', sets: 4, reps: 8, weight: 60, restTime: 90 },
      { exerciseName: 'Shoulder Press', sets: 3, reps: 10, weight: 20, restTime: 60 },
      { exerciseName: 'Pull-ups', sets: 3, reps: 8, weight: 0, restTime: 60 },
    ],
    createdAt: now,
    updatedAt: now,
  },
];

export const mockAttendance: AttendanceRecord[] = [
  {
    attendanceId: 'att-1',
    gymId: 'gym-1',
    memberId: 'user-member-1',
    memberName: 'Jordan Member',
    checkInTime: new Date(Date.now() - 86400000 * 2).toISOString(),
    checkOutTime: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
  },
  {
    attendanceId: 'att-2',
    gymId: 'gym-1',
    memberId: 'user-member-1',
    memberName: 'Jordan Member',
    checkInTime: new Date(Date.now() - 86400000).toISOString(),
    checkOutTime: new Date(Date.now() - 86400000 + 5400000).toISOString(),
  },
];

export const mockMemberships: Membership[] = [
  {
    membershipId: 'mem-1',
    gymId: 'gym-1',
    memberId: 'user-member-1',
    plan: 'monthly',
    startDate: now,
    expiryDate: futureDate.toISOString(),
    status: 'active',
  },
  {
    membershipId: 'mem-2',
    gymId: 'gym-1',
    memberId: 'user-member-2',
    plan: 'yearly',
    startDate: now,
    expiryDate: futureDate.toISOString(),
    status: 'active',
  },
];

/** In-memory credentials map (email -> password) */
export const mockCredentials: Record<string, string> = {
  'admin@gymhub.com': MOCK_PASSWORD,
  'owner@gymhub.com': MOCK_PASSWORD,
  'trainer@gymhub.com': MOCK_PASSWORD,
  'member@gymhub.com': MOCK_PASSWORD,
  'taylor@gymhub.com': MOCK_PASSWORD,
};

let idCounter = 100;

export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function calculateExpiryDate(plan: MembershipPlan): string {
  const date = new Date();
  if (plan === 'monthly') date.setMonth(date.getMonth() + 1);
  else date.setFullYear(date.getFullYear() + 1);
  return date.toISOString();
}

export function getMembershipStatus(membership: Membership) {
  if (membership.status === 'suspended') return 'suspended' as const;
  if (new Date(membership.expiryDate) < new Date()) return 'expired' as const;
  return 'active' as const;
}
