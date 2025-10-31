// src/context/AuthProvider.jsx
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Toaster } from "react-hot-toast";

export default function AuthProvider({ children }) {
    const { fetchCurrentUser } = useAuth();

    useEffect(() => {
        fetchCurrentUser(); // Vérifie la session actuelle au démarrage
    }, [fetchCurrentUser]);

    return (
        <>
            {children}
            <Toaster position="top-right" />
        </>
    );
}
