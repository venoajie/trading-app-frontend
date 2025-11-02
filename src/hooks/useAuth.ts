/** src/hooks/useAuth.ts */
import { useAuthStore } from '@/store/authStore';

/**
 * The canonical hook for checking authentication status throughout the application.
 *
 * This hook acts as a bridge to the Zustand auth store, providing a clean,
 * decoupled way for components to access the `isAuthenticated` state without
 * needing to know the implementation details of the store itself.
 *
 * It replaces the Phase 3 placeholder and is now the single source of truth for
 * auth status, derived from the `useAuthStore`.
 */
export const useAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return { isAuthenticated };
};
