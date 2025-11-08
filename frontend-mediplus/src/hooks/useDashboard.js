// src/hooks/useDashboard.js
import { useQuery } from "@tanstack/react-query";
import { getNextAppointment } from "../api/appointments.js";
import { getUnreadNotifications } from "../api/notifications.js";
import { getTodayMedications } from "../api/prescriptions.js";

// ✅ Vérifier si l'utilisateur est authentifié
function isAuthenticated() {
  const token = localStorage.getItem("token");
  return token && token.length > 10;
}

// ✅ Hook pour le prochain rendez-vous
export function useNextAppointment() {
  return useQuery({
    queryKey: ["nextAppointment"],
    queryFn: getNextAppointment,
    enabled: isAuthenticated(), // ✅ Désactivé si non authentifié
    retry: 1,
    refetchInterval: 5 * 60 * 1000, // Rafraîchissement toutes les 5 minutes
  });
}

// ✅ Hook pour les médicaments du jour
export function useTodayMedications() {
  return useQuery({
    queryKey: ["todayMedications"],
    queryFn: getTodayMedications,
    enabled: isAuthenticated(), // ✅ Désactivé si non authentifié
    retry: 1,
    refetchInterval: 10 * 60 * 1000, // Rafraîchissement toutes les 10 minutes
  });
}

// ✅ Hook pour les notifications non lues
export function useUnreadNotifications() {
  return useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: getUnreadNotifications,
    enabled: isAuthenticated(), // ✅ Désactivé si non authentifié
    retry: 1,
    refetchInterval: 2 * 60 * 1000, // Rafraîchissement toutes les 2 minutes
  });
}
