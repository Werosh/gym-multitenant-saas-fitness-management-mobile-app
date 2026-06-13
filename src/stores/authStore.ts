import { create } from 'zustand';
import {
  loginUser,
  logoutUser,
  registerUser,
  fetchUserProfile,
  subscribeAuthState,
  loginWithGoogleIdToken,
  completeGoogleProfileSetup,
  cancelIncompleteGoogleSignIn,
} from '../services/authService';
import { createGym } from '../services/gymService';
import {
  RegisterPayload,
  UserProfile,
  CreateGymPayload,
  Gym,
  GoogleProfileSetupPayload,
} from '../types';
import { roleRequiresGymId } from '../utils/roleUtils';

export interface PendingGoogleUser {
  uid: string;
  email: string;
  name: string;
}

interface AuthState {
  profile: UserProfile | null;
  gym: Gym | null;
  pendingGoogleUser: PendingGoogleUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  completeGoogleSetup: (payload: GoogleProfileSetupPayload) => Promise<void>;
  cancelGoogleSetup: () => Promise<void>;
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
  pendingGoogleUser: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    await new Promise<void>((resolve) => {
      let settled = false;
      subscribeAuthState(async (firebaseUser) => {
        if (!firebaseUser) {
          set({
            profile: null,
            pendingGoogleUser: null,
            isInitialized: true,
            isLoading: false,
          });
        } else {
          try {
            const profile = await fetchUserProfile(firebaseUser.uid);
            if (profile) {
              set({
                profile,
                pendingGoogleUser: null,
                isInitialized: true,
                isLoading: false,
                error: null,
              });
            } else {
              set({
                profile: null,
                pendingGoogleUser: {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email ?? '',
                  name: firebaseUser.displayName ?? 'User',
                },
                isInitialized: true,
                isLoading: false,
                error: null,
              });
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load profile';
            set({ error: message, isInitialized: true, isLoading: false });
          }
        }

        if (!settled) {
          settled = true;
          resolve();
        }
      });
    });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await loginUser(email, password);
      set({ profile, pendingGoogleUser: null, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  loginWithGoogle: async (idToken) => {
    set({ isLoading: true, error: null });
    try {
      const { profile, firebaseUser } = await loginWithGoogleIdToken(idToken);
      if (profile) {
        set({ profile, pendingGoogleUser: null, isLoading: false });
      } else {
        set({
          profile: null,
          pendingGoogleUser: {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            name: firebaseUser.displayName ?? 'User',
          },
          isLoading: false,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign in failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  completeGoogleSetup: async (payload) => {
    const { pendingGoogleUser } = get();
    if (!pendingGoogleUser) throw new Error('No pending Google sign in');

    set({ isLoading: true, error: null });
    try {
      const profile = await completeGoogleProfileSetup(
        pendingGoogleUser.uid,
        pendingGoogleUser.email,
        payload,
      );
      set({ profile, pendingGoogleUser: null, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete setup';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  cancelGoogleSetup: async () => {
    set({ isLoading: true });
    try {
      await cancelIncompleteGoogleSignIn();
      set({ pendingGoogleUser: null, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel';
      set({ error: message, isLoading: false });
    }
  },

  demoLogin: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { mockLoginAsUser } = await import('../data/mockApi');
      const profile = await mockLoginAsUser(userId);
      set({ profile, pendingGoogleUser: null, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Demo login failed';
      set({ error: message, isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await registerUser(payload);
      set({ profile, pendingGoogleUser: null, isLoading: false });
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
      set({ profile: null, gym: null, pendingGoogleUser: null, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      set({ error: message, isLoading: false });
    }
  },

  refreshProfile: async () => {
    const { profile } = get();
    if (!profile) return;
    const updated = await fetchUserProfile(profile.userId);
    set({ profile: updated });
  },

  setupGym: async (payload) => {
    const { profile } = get();
    if (!profile) throw new Error('Not authenticated');
    set({ isLoading: true, error: null });
    try {
      const gym = await createGym(profile.userId, payload);
      const updated = await fetchUserProfile(profile.userId);
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

export function useNeedsGoogleRoleSetup(): boolean {
  const profile = useAuthStore((s) => s.profile);
  const pendingGoogleUser = useAuthStore((s) => s.pendingGoogleUser);
  return !profile && !!pendingGoogleUser;
}
