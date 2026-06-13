export type UserRole = 'super_admin' | 'owner' | 'trainer' | 'member';

export type MembershipPlan = 'monthly' | 'yearly';
export type MembershipStatus = 'active' | 'expired' | 'suspended';
export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';

export interface Gym {
  gymId: string;
  gymName: string;
  location: string;
  ownerId: string;
  gymCode: string;
  createdAt: string;
  subscriptionPlan: SubscriptionPlan;
}

export interface UserProfile {
  userId: string;
  gymId: string | null;
  name: string;
  email: string;
  role: UserRole;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  trainerId?: string;
  membershipStatus?: MembershipStatus;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
}

export interface Workout {
  workoutId: string;
  gymId: string;
  memberId: string;
  trainerId: string;
  title: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  attendanceId: string;
  gymId: string;
  memberId: string;
  memberName?: string;
  checkInTime: string;
  checkOutTime?: string;
}

export interface Membership {
  membershipId: string;
  gymId: string;
  memberId: string;
  plan: MembershipPlan;
  startDate: string;
  expiryDate: string;
  status: MembershipStatus;
}

export interface AppNotification {
  notificationId: string;
  gymId: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface OwnerDashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiredMemberships: number;
  revenuePlaceholder: number;
  todayAttendance: number;
}

export interface TrainerDashboardStats {
  assignedMembers: number;
  activeWorkouts: number;
  completedSessions: number;
}

export interface MemberDashboardStats {
  assignedWorkouts: number;
  membershipStatus: MembershipStatus | 'none';
  totalCheckIns: number;
  currentWeight?: number;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  gymCode?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
}

export interface CreateGymPayload {
  gymName: string;
  location: string;
  subscriptionPlan: SubscriptionPlan;
}

export interface CreateMemberPayload {
  name: string;
  email: string;
  password: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  trainerId?: string;
  plan: MembershipPlan;
}

export interface CreateTrainerPayload {
  name: string;
  email: string;
  password: string;
}
