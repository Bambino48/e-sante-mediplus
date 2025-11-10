// src/hooks/usePatientDashboard.js
import { useQuery } from "@tanstack/react-query";
import {
  getPatientActivePrescriptions,
  getPatientActiveTeleconsults,
  getPatientPendingPayments,
  getPatientStats,
  getPatientTodayMedications,
  getPatientUpcomingAppointments,
} from "../api/patient.js";

// ✅ Vérifier si le patient est authentifié
function isAuthenticated() {
  const token = localStorage.getItem("token");
  return token && token.length > 10;
}

// ✅ Hook pour les statistiques du patient
export function usePatientStats() {
  return useQuery({
    queryKey: ["patientStats"],
    queryFn: getPatientStats,
    enabled: isAuthenticated(),
    retry: 1,
    refetchInterval: 5 * 60 * 1000, // Rafraîchissement toutes les 5 minutes
  });
}

// ✅ Hook pour les rendez-vous à venir
export function usePatientUpcomingAppointments() {
  return useQuery({
    queryKey: ["patientUpcomingAppointments"],
    queryFn: getPatientUpcomingAppointments,
    enabled: isAuthenticated(),
    retry: 1,
    refetchInterval: 10 * 60 * 1000, // Rafraîchissement toutes les 10 minutes
  });
}

// ✅ Hook pour les prescriptions actives
export function usePatientActivePrescriptions() {
  return useQuery({
    queryKey: ["patientActivePrescriptions"],
    queryFn: getPatientActivePrescriptions,
    enabled: isAuthenticated(),
    retry: 1,
    refetchInterval: 15 * 60 * 1000, // Rafraîchissement toutes les 15 minutes
  });
}

// ✅ Hook pour les paiements en attente
export function usePatientPendingPayments() {
  return useQuery({
    queryKey: ["patientPendingPayments"],
    queryFn: getPatientPendingPayments,
    enabled: isAuthenticated(),
    retry: 1,
    refetchInterval: 5 * 60 * 1000, // Rafraîchissement toutes les 5 minutes
  });
}

// ✅ Hook pour les téléconsultations actives
export function usePatientActiveTeleconsults() {
  return useQuery({
    queryKey: ["patientActiveTeleconsults"],
    queryFn: getPatientActiveTeleconsults,
    enabled: isAuthenticated(),
    retry: 1,
    refetchInterval: 2 * 60 * 1000, // Rafraîchissement toutes les 2 minutes
  });
}

// ✅ Hook pour les médicaments du jour
export function usePatientTodayMedications() {
  return useQuery({
    queryKey: ["patientTodayMedications"],
    queryFn: getPatientTodayMedications,
    enabled: isAuthenticated(),
    retry: 1,
    refetchInterval: 10 * 60 * 1000, // Rafraîchissement toutes les 10 minutes
  });
}
