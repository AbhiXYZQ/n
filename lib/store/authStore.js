import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (userData) => set({
        user: {
          ...userData,
          monetization: {
            plan: userData?.monetization?.plan || 'FREE',
            verificationBadgeActive: userData?.monetization?.verificationBadgeActive || false,
            aiProActive: userData?.monetization?.aiProActive || false,
            aiProActivatedAt: userData?.monetization?.aiProActivatedAt || null
          }
        },
        isAuthenticated: true
      }),
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),

      applyMonetizationFromServer: ({ monetization, verifiedBadges }) => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            monetization: monetization || state.user.monetization,
            verifiedBadges: verifiedBadges || state.user.verifiedBadges || []
          }
        };
      }),

      activateVerificationBadge: () => set((state) => {
        if (!state.user) return state;
        const hasVerificationBadge = state.user.verifiedBadges?.includes('Verified User');
        return {
          user: {
            ...state.user,
            verifiedBadges: hasVerificationBadge
              ? state.user.verifiedBadges
              : [...(state.user.verifiedBadges || []), 'Verified User'],
            monetization: {
              ...state.user.monetization,
              verificationBadgeActive: true
            }
          }
        };
      }),

      activateAiProPlan: () => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            monetization: {
              ...state.user.monetization,
              plan: 'AI_PRO',
              aiProActive: true,
              aiProActivatedAt: new Date().toISOString()
            }
          }
        };
      })
    }),
    {
      name: 'nainix-auth-storage',
      storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
      })
    }
  )
);

export default useAuthStore;
