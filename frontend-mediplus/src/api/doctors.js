// src/api/doctors.js
import api from "./axiosInstance";

/**
 * 🧩 Récupération de la liste des docteurs (route publique)
 * @param {Object} params - Paramètres de filtrage et pagination
 * @param {number} params.per_page - Nombre de résultats par page (défaut: 20)
 * @param {string} params.sort_by - Critère de tri (nom, date, note, tarifs)
 * @param {string} params.sort_order - Ordre de tri (asc/desc)
 * @param {string} params.city - Filtrage par ville
 * @param {string} params.specialty - Filtrage par spécialité
 * @param {boolean} params.has_profile - Profils complets uniquement
 * @returns {Promise<Object>} Liste des docteurs avec pagination
 */
export const getDoctorsList = async (params = {}) => {
  console.log("🌐 API getDoctorsList - Calling /doctors with params:", params);
  const response = await api.get("/doctors", { params });
  console.log("🌐 API getDoctorsList - Raw response:", response);
  console.log("🌐 API getDoctorsList - Response data:", response.data);
  // Retourne directement la structure complète pour que le composant puisse accéder aux docteurs
  return response.data;
};

/**
 * 🧩 Récupération des détails d'un docteur spécifique
 * @param {number} doctorId - ID du docteur
 * @returns {Promise<Object>} Détails du docteur
 */
export const getDoctorDetails = async (doctorId) => {
  const { data } = await api.get(`/doctors/${doctorId}`);
  return data;
};

/**
 * 🧩 Récupération des disponibilités d'un docteur
 * @param {number} doctorId - ID du docteur
 * @param {Object} params - Paramètres de filtrage des disponibilités
 * @returns {Promise<Object>} Disponibilités du docteur
 */
export const getDoctorAvailabilities = async (doctorId, params = {}) => {
  const { data } = await api.get(`/doctors/${doctorId}/availabilities`, {
    params,
  });
  return data;
};
