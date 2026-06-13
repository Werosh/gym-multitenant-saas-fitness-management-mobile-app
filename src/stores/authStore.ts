import { create } from 'zustand';
import {
  mockLogin,
  mockLogout,
  mockRegister,
  mockRestoreSession,
  mockFetchProfile,
  mockCreateGym,
} from '../data/mockApi';
import { RegisterPayload, UserProfile, CreateGymPayload, Gym } from '../types';
import { roleRequiresGymId } from '../utils/roleUtils';

interface AuthState {
  profile: UserProfile | null;
  gym: Gym | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: (userId: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setupGym: (payload: CreateGymPayload) => Promise<Gym>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  profile: null,
  gym: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    const profile = await mockRestoreSession();
    set({ profile, isInitialized: true });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await mockLogin(email, password);
      set({ profile, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  demoLogin: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { mockLoginAsUser } = await import('../data/mockApi');
      const profile = await mockLoginAsUser(userId);
      set({ profile, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Demo login failed';
      set({ error: message, isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await mockRegister(payload);
      set({ profile, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await mockLogout();
      set({ profile: null, gym: null, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      set({ error: message, isLoading: false });
    }
  },

  refreshProfile: async () => {
    const { profile } = get();
    if (!profile) return;
    const updated = await mockFetchProfile(profile.userId);
    set({ profile: updated });
  },

  setupGym: async (payload) => {
    const { profile } = get();
    if (!profile) throw new Error('Not authenticated');
    set({ isLoading: true, error: null });
    try {
      const gym = await mockCreateGym(profile.userId, payload);
      const updated = await mockFetchProfile(profile.userId);
      set({ gym, profile: updated, isLoading: false });
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
