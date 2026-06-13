import { create } from 'zustand';
import { Gym, UserProfile, Workout, AttendanceRecord, Membership, OwnerDashboardStats } from '../types';
import { getGymById } from '../services/gymService';
import { getMembersByGym } from '../services/memberService';
import { getTrainersByGym } from '../services/trainerService';
import { getWorkoutsByGym, getWorkoutsByMember, getWorkoutsByTrainer } from '../services/workoutService';
import { getAttendanceByGym, getAttendanceByMember, getTodayAttendanceCount } from '../services/attendanceService';
import { getMembershipsByGym, getMembershipByMember, getMembershipStatus } from '../services/membershipService';

interface GymState {
  gym: Gym | null;
  members: UserProfile[];
  trainers: UserProfile[];
  workouts: Workout[];
  attendance: AttendanceRecord[];
  memberships: Membership[];
  isLoading: boolean;
  error: string | null;
  loadGym: (gymId: string) => Promise<void>;
  loadMembers: (gymId: string) => Promise<void>;
  loadTrainers: (gymId: string) => Promise<void>;
  loadWorkouts: (gymId: string, filter?: { memberId?: string; trainerId?: string }) => Promise<void>;
  loadAttendance: (gymId: string, memberId?: string) => Promise<void>;
  loadMemberships: (gymId: string) => Promise<void>;
  getOwnerStats: (gymId: string) => Promise<OwnerDashboardStats>;
  clear: () => void;
}

export const useGymStore = create<GymState>((set, get) => ({
  gym: null,
  members: [],
  trainers: [],
  workouts: [],
  attendance: [],
  memberships: [],
  isLoading: false,
  error: null,

  loadGym: async (gymId) => {
    set({ isLoading: true, error: null });
    try {
      const gym = await getGymById(gymId);
      set({ gym, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load gym', isLoading: false });
    }
  },

  loadMembers: async (gymId) => {
    set({ isLoading: true });
    try {
      const members = await getMembersByGym(gymId);
      set({ members, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load members', isLoading: false });
    }
  },

  loadTrainers: async (gymId) => {
    set({ isLoading: true });
    try {
      const trainers = await getTrainersByGym(gymId);
      set({ trainers, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load trainers', isLoading: false });
    }
  },

  loadWorkouts: async (gymId, filter) => {
    set({ isLoading: true });
    try {
      let workouts: Workout[];
      if (filter?.memberId) {
        workouts = await getWorkoutsByMember(gymId, filter.memberId);
      } else if (filter?.trainerId) {
        workouts = await getWorkoutsByTrainer(gymId, filter.trainerId);
      } else {
        workouts = await getWorkoutsByGym(gymId);
      }
      set({ workouts, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load workouts', isLoading: false });
    }
  },

  loadAttendance: async (gymId, memberId) => {
    set({ isLoading: true });
    try {
      const attendance = memberId
        ? await getAttendanceByMember(gymId, memberId)
        : await getAttendanceByGym(gymId);
      set({ attendance, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load attendance', isLoading: false });
    }
  },

  loadMemberships: async (gymId) => {
    set({ isLoading: true });
    try {
      const memberships = await getMembershipsByGym(gymId);
      set({ memberships, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load memberships', isLoading: false });
    }
  },

  getOwnerStats: async (gymId) => {
    const [members, memberships, todayAttendance] = await Promise.all([
      getMembersByGym(gymId),
      getMembershipsByGym(gymId),
      getTodayAttendanceCount(gymId),
    ]);

    const activeMembers = memberships.filter((m) => getMembershipStatus(m) === 'active').length;
    const expiredMemberships = memberships.filter((m) => getMembershipStatus(m) === 'expired').length;

    return {
      totalMembers: members.length,
      activeMembers,
      expiredMemberships,
      revenuePlaceholder: activeMembers * 49.99,
      todayAttendance,
    };
  },

  clear: () =>
    set({
      gym: null,
      members: [],
      trainers: [],
      workouts: [],
      attendance: [],
      memberships: [],
      error: null,
    }),
}));

export async function getMemberStats(gymId: string, memberId: string) {
  const [workouts, attendance, membership] = await Promise.all([
    getWorkoutsByMember(gymId, memberId),
    getAttendanceByMember(gymId, memberId),
    getMembershipByMember(gymId, memberId),
  ]);

  return {
    assignedWorkouts: workouts.length,
    membershipStatus: membership ? getMembershipStatus(membership) : ('none' as const),
    totalCheckIns: attendance.length,
  };
}
