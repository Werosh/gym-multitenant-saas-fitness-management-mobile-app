import { create } from 'zustand';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  loginUser,
  logoutUser,
  registerUser,
  fetchUserProfile,
  updateUserProfile,
} from '../services/authService';
import { getGymByCode, linkUserToGym, createGym } from '../services/gymService';
import { RegisterPayload, UserProfile, CreateGymPayload, Gym } from '../types';
import { roleRequiresGymId } from '../utils/roleUtils';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  gym: Gym | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setupGym: (payload: CreateGymPayload) => Promise<Gym>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  gym: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await fetchUserProfile(user.uid);
          set({ user, profile, isInitialized: true });
        } catch {
          set({ user, profile: null, isInitialized: true });
        }
      } else {
        set({ user: null, profile: null, gym: null, isInitialized: true });
      }
    });
    return unsubscribe;
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginUser(email, password);
      const profile = await fetchUserProfile(user.uid);
      set({ user, profile, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      let profile = await registerUser(payload);

      if (payload.role !== 'owner' && payload.role !== 'super_admin' && payload.gymCode) {
        const gym = await getGymByCode(payload.gymCode);
        if (!gym) {
          throw new Error('Invalid gym code. Please check and try again.');
        }
        await linkUserToGym(profile.userId, gym.gymId);
        profile = { ...profile, gymId: gym.gymId };
      }

      set({ user: auth.currentUser, profile, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUser();
      set({ user: null, profile: null, gym: null, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      set({ error: message, isLoading: false });
    }
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    const profile = await fetchUserProfile(user.uid);
    set({ profile });
  },

  setupGym: async (payload) => {
    const { user } = get();
    if (!user) throw new Error('Not authenticated');
    set({ isLoading: true, error: null });
    try {
      const gym = await createGym(user.uid, payload);
      const profile = await fetchUserProfile(user.uid);
      set({ gym, profile, isLoading: false });
      return gym;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create gym';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

export function useNeedsGymSetup(): boolean {
  const profile = useAuthStore((s) => s.profile);
  if (!profile) return false;
  if (!roleRequiresGymId(profile.role)) return false;
  return profile.role === 'owner' && !profile.gymId;
}

export function useHasGymAccess(): boolean {
  const profile = useAuthStore((s) => s.profile);
  if (!profile) return false;
  if (profile.role === 'super_admin') return true;
  return !!profile.gymId;
}
