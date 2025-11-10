import { create } from "zustand";

// Fonction pour récupérer l'utilisateur depuis le localStorage
const getInitialUser = () => {
  try {
    const cachedUser = localStorage.getItem("cachedUser");
    return cachedUser ? JSON.parse(cachedUser) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getInitialUser(), // Initialiser avec les données du localStorage
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ user: null, isLoading: false }),
}));
