import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useGymStore } from '../stores/gymStore';

export function useGymData() {
  const profile = useAuthStore((s) => s.profile);
  const gymStore = useGymStore();

  useEffect(() => {
    if (profile?.gymId) {
      gymStore.loadGym(profile.gymId);
    }
    return () => gymStore.clear();
  }, [profile?.gymId]);

  return { profile, ...gymStore };
}
