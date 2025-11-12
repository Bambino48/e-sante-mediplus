import api from "./axiosInstance.js";

// ✅ API Réelles - Prochain rendez-vous du patient
export async function getNextAppointment() {
  const { data } = await api.get("/patient/appointments/next");
  return data; // { appointment: {...} } ou { appointment: null }
}

// ✅ API Réelles - Liste des rendez-vous du patient
export async function getPatientAppointments() {
  const { data } = await api.get("/patient/appointments");
  // Le backend retourne directement un tableau d'appointments
  // Normalisation pour l'interface : on s'attend à { items: [...] }
  return Array.isArray(data) ? { items: data } : data;
}

// ✅ API Réelles - Créer un rendez-vous
export async function bookAppointment(payload) {
  const { data } = await api.post("/patient/appointments", payload);
  return data;
}

// ✅ API Réelles - Consultations récentes du patient
export async function getRecentConsultations() {
  const { data } = await api.get("/patient/consultations/recent");
  return data; // { items: [...] }
}

// ✅ API Réelles - Annuler un rendez-vous
export async function cancelAppointment(appointmentId) {
  const { data } = await api.delete(`/patient/appointments/${appointmentId}`);
  return data;
}

// ✅ API Réelles - Modifier un rendez-vous
export async function updateAppointment(appointmentId, payload) {
  const { data } = await api.put(
    `/patient/appointments/${appointmentId}`,
    payload
  );
  return data;
}

// ✅ API Réelles - Disponibilités médecin
export async function getDoctorAvailabilities(doctorId) {
  const { data } = await api.get(`/doctors/${doctorId}/availabilities`);
  return data;
}
