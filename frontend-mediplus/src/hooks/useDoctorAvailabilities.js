// src/hooks/useDoctorAvailabilities.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDoctorAvailability,
  deleteDoctorAvailability,
  getDoctorAvailabilities,
  updateDoctorAvailability,
} from "../api/doctor";

// ✅ Hook pour récupérer les disponibilités du médecin
export function useDoctorAvailabilities() {
  return useQuery({
    queryKey: ["doctor-availabilities"],
    queryFn: getDoctorAvailabilities,
    staleTime: 30 * 1000, // Considéré frais pendant 30 secondes
    refetchInterval: 60 * 1000, // Rafraîchissement automatique toutes les 60 secondes
    refetchOnWindowFocus: true, // Rafraîchissement quand l'utilisateur revient sur l'onglet
    refetchOnReconnect: true, // Rafraîchissement en cas de reconnexion réseau
    refetchIntervalInBackground: false, // Pas de refetch en arrière-plan pour économiser la batterie
  });
}

// ✅ Hook pour créer une disponibilité
export function useCreateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDoctorAvailability,
    onSuccess: (newAvailability) => {
      // Mise à jour optimiste du cache
      queryClient.setQueryData(["doctor-availabilities"], (oldData) => {
        const currentData = Array.isArray(oldData) ? oldData : [];
        return [...currentData, newAvailability];
      });
      // Invalidation pour s'assurer de la fraîcheur des données
      queryClient.invalidateQueries(["doctor-availabilities"]);
    },
  });
}

// ✅ Hook pour mettre à jour une disponibilité
export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateDoctorAvailability(id, data),
    onSuccess: (updatedAvailability) => {
      // Mise à jour optimiste du cache
      queryClient.setQueryData(["doctor-availabilities"], (oldData) => {
        const currentData = Array.isArray(oldData) ? oldData : [];
        return currentData.map((availability) =>
          availability.id === updatedAvailability.id
            ? updatedAvailability
            : availability
        );
      });
      // Invalidation pour s'assurer de la fraîcheur des données
      queryClient.invalidateQueries(["doctor-availabilities"]);
    },
  });
}

// ✅ Hook pour supprimer une disponibilité
export function useDeleteAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDoctorAvailability,
    onSuccess: (_, deletedId) => {
      // Mise à jour optimiste du cache
      queryClient.setQueryData(["doctor-availabilities"], (oldData) => {
        const currentData = Array.isArray(oldData) ? oldData : [];
        return currentData.filter(
          (availability) => availability.id !== deletedId
        );
      });
      // Invalidation pour s'assurer de la fraîcheur des données
      queryClient.invalidateQueries(["doctor-availabilities"]);
    },
  });
}
