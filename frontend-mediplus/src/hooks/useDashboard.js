// src/hooks/useDashboard.js
import { useQuery } from "@tanstack/react-query";
import { getNextAppointment } from "../api/appointments.js";
import { getUnreadNotifications } from "../api/notifications.js";
import { getTodayMedications } from "../api/prescriptions.js";

// ✅ Hook pour le prochain rendez-vous
export function useNextAppointment() {
  return useQuery({
    queryKey: ["nextAppointment"],
    queryFn: getNextAppointment,
    enabled: false, // ⚠️ Désactivé temporairement - Activer après implémentation backend
    retry: false,
    refetchInterval: false,
  });
}

// ✅ Hook pour les médicaments du jour
export function useTodayMedications() {
  return useQuery({
    queryKey: ["todayMedications"],
    queryFn: getTodayMedications,
    enabled: false, // ⚠️ Désactivé temporairement - Activer après implémentation backend
    retry: false,
    refetchInterval: false,
  });
}

// ✅ Hook pour les notifications non lues
export function useUnreadNotifications() {
  return useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: getUnreadNotifications,
    enabled: false, // ⚠️ Désactivé temporairement - Activer après implémentation backend
    retry: false,
    refetchInterval: false,
  });
}
