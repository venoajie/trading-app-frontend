/**
 * NOTE: This is a temporary placeholder hook.
 * In Phase 4, this will be replaced with a real hook connected to our auth state
 * store (e.g., Zustand).
 *
 * @returns An object with the user's authentication status.
 */
export const useAuth = () => {
  // --- TOGGLE THIS VALUE TO TEST ROUTE GUARDS ---
  // `true`:  You will be redirected from the home page ('/') to '/dashboard'.
  // `false`: You will be redirected from '/dashboard' to the home page ('/').
  const isAuthenticated = true;

  return { isAuthenticated };
};
