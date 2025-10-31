import { create } from "zustand";


export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),
    clear: () => set({ user: null, isLoading: false }),
}));