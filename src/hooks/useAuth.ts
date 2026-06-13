import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return useAuthStore();
}
