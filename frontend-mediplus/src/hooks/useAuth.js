/* eslint-disable no-unused-vars */
import {
    getCurrentUser,
    loginRequest,
    registerRequest,
    logoutRequest,
    updateProfileRequest,
} from "../api/auth.js";
import { useCallback } from "react";
import { useAuthStore } from "../store/authStore.js";
import { toast } from "react-hot-toast";

export function useAuth() {
    // ✅ Gestion du state global (Zustand)
    const user = useAuthStore((state) => state.user);
    const isLoading = useAuthStore((state) => state.isLoading);
    const setUser = useAuthStore((state) => state.setUser);
    const setLoading = useAuthStore((state) => state.setLoading);
    const clear = useAuthStore((state) => state.clear);

    // ✅ Récupération du token depuis localStorage
    const token = localStorage.getItem("token");

    /**
     * 🔹 Récupérer l'utilisateur connecté
     */
    const fetchCurrentUser = useCallback(async () => {
        try {
            setLoading(true);
            if (!token) return; // Pas de token → pas d'appel
            const me = await getCurrentUser(token);
            setUser(me.user || me);
        } catch (e) {
            clear(); // Pas connecté ou token invalide
        } finally {
            setLoading(false);
        }
    }, [token, setUser, setLoading, clear]);

    /**
     * 🔹 Connexion
     */
    const login = useCallback(
        async (form) => {
            setLoading(true);
            try {
                const res = await loginRequest(form);
                if (res.token) {
                    localStorage.setItem("token", res.token);
                }
                setUser(res.user);
                toast.success("Connexion réussie !");
                return res.user;
            } catch (e) {
                toast.error(e.response?.data?.message || "Échec de connexion");
                throw e;
            } finally {
                setLoading(false);
            }
        },
        [setUser, setLoading]
    );

    /**
     * 🔹 Inscription
     */
    const register = useCallback(
        async (form) => {
            setLoading(true);
            try {
                const res = await registerRequest(form);
                if (res.token) {
                    localStorage.setItem("token", res.token);
                }
                setUser(res.user);
                toast.success("Compte créé avec succès !");
                return res.user;
            } catch (e) {
                toast.error(e.response?.data?.message || "Échec d'inscription");
                throw e;
            } finally {
                setLoading(false);
            }
        },
        [setUser, setLoading]
    );

    /**
     * 🔹 Déconnexion
     */
    const logout = useCallback(async () => {
        setLoading(true);
        try {
            if (token) await logoutRequest(token);
            localStorage.removeItem("token");
            clear();
            toast.success("Déconnecté");
        } catch (e) {
            toast.error(e.response?.data?.message || "Échec de déconnexion");
        } finally {
            setLoading(false);
        }
    }, [token, clear, setLoading]);

    /**
     * 🔹 Mise à jour du profil utilisateur (optionnelle)
     */
    const updateProfile = useCallback(
        async (form) => {
            if (!token) return toast.error("Non connecté");
            setLoading(true);
            try {
                const res = await updateProfileRequest(token, form);
                setUser(res.user);
                toast.success("Profil mis à jour !");
            } catch (e) {
                toast.error("Erreur lors de la mise à jour du profil");
            } finally {
                setLoading(false);
            }
        },
        [token, setUser, setLoading]
    );

    return {
        user,
        isLoading,
        token,
        fetchCurrentUser,
        login,
        register,
        logout,
        updateProfile,
    };
}
