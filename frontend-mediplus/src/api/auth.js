// src/api/auth.js
import api from "./axiosInstance";

// 🧩 Récupération du profil utilisateur connecté
export const getCurrentUser = async (token) => {
    const { data } = await api.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

// 🧩 Connexion utilisateur
export const loginRequest = async (payload) => {
    const { data } = await api.post("/login", payload);
    return data;
};

// 🧩 Inscription utilisateur
export const registerRequest = async (payload) => {
    const { data } = await api.post("/register", payload);
    return data;
};

// 🧩 Déconnexion utilisateur
export const logoutRequest = async (token) => {
    const { data } = await api.post(
        "/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
};

// 🧩 Mise à jour du profil
export const updateProfileRequest = async (token, payload) => {
    const { data } = await api.put("/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};
