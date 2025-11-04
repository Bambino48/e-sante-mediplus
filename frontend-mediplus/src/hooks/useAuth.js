import { useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  getCurrentUser,
  loginRequest,
  logoutRequest,
  registerRequest,
  updateProfileRequest,
} from "../api/auth.js";
import { useAuthStore } from "../store/authStore.js";
import {
  getErrorMessage,
  isTemporaryError,
  logError,
} from "../utils/errorHandler.js";

/**
 * Vérifie si un token est valide (Sanctum tokens sont des chaînes aléatoises, pas des JWT)
 */
function isValidToken(token) {
  // Pour Laravel Sanctum, le token est une chaîne aléatoire, pas un JWT
  return token && typeof token === "string" && token.length > 10;
}

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

      // Tentative de récupération via l'API
      const me = await getCurrentUser(token);
      const userData = me.user || me;

      // Mettre en cache les données utilisateur pour les erreurs serveur futures
      if (userData) {
        localStorage.setItem("cachedUser", JSON.stringify(userData));
      }

      setUser(userData);
    } catch (e) {
      logError("fetchCurrentUser", e);

      // Si c'est une erreur temporaire du serveur, on conserve la session avec un utilisateur minimal
      if (isTemporaryError(e)) {
        console.warn("Erreur serveur temporaire - conservation de la session");

        // Pour Laravel Sanctum, on ne peut pas décoder le token, on crée un utilisateur minimal
        if (isValidToken(token)) {
          // Vérifier si on a des données utilisateur en cache dans localStorage
          const cachedUser = localStorage.getItem("cachedUser");
          if (cachedUser) {
            try {
              setUser(JSON.parse(cachedUser));
              toast.success("Session restaurée à partir du cache local");
            } catch {
              // Si le cache est invalide, utiliser un utilisateur minimal
              const fallbackUser = {
                id: "temp",
                email: "utilisateur@mediplus.com",
                name: "Utilisateur",
                role: "patient",
              };
              setUser(fallbackUser);
              toast.warn("Session temporaire activée");
            }
          } else {
            toast.error(
              "Erreur temporaire du serveur. Certaines fonctionnalités peuvent être limitées."
            );
          }
        } else {
          toast.error(
            "Erreur temporaire du serveur. Certaines fonctionnalités peuvent être limitées."
          );
        }
      } else {
        // Pour les autres erreurs (401, 403, etc.), on efface la session
        clear(); // Pas connecté ou token invalide
        localStorage.removeItem("token");
        localStorage.removeItem("cachedUser"); // Nettoyer le cache
        toast.error(getErrorMessage(e));
      }
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
        // Cache les données utilisateur pour les erreurs serveur temporaires
        if (res.user) {
          localStorage.setItem("cachedUser", JSON.stringify(res.user));
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
        // Cache les données utilisateur pour les erreurs serveur temporaires
        if (res.user) {
          localStorage.setItem("cachedUser", JSON.stringify(res.user));
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
      localStorage.removeItem("cachedUser"); // Nettoyer le cache utilisateur
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
        const userData = res.user || res;

        // Mettre à jour le cache utilisateur
        if (userData) {
          localStorage.setItem("cachedUser", JSON.stringify(userData));
        }

        setUser(userData);
        toast.success("Profil mis à jour !");
      } catch (e) {
        logError("updateProfile", e);
        toast.error(
          getErrorMessage(e) || "Erreur lors de la mise à jour du profil"
        );
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
