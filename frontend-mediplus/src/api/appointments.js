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
    // Transformation : scheduled_at au lieu de start_at pour correspondre à la BDD
    const requestData = {
        doctor_id: payload.doctor_id,
        scheduled_at: payload.scheduled_at || payload.start_at, // Support des deux formats
        reason: payload.reason || "Consultation générale",
        mode: payload.mode || "physical", // video | physical
    };

    const { data } = await api.post("/patient/appointments", requestData);
    return data;
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

// 🧪 MOCK - Disponibilités médecin (en attendant l'API réelle)
export async function getDoctorAvailabilities(doctorId) {
    // TODO: Connecter à l'API réelle quand disponible
    // const { data } = await api.get(`/doctors/${doctorId}/availabilities`);

    // Génère une semaine de slots fictifs
    const today = new Date();
    const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const byDay = {};
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        const slots = [];
        for (let h = 9; h <= 16; h++) {
            if (Math.random() > 0.2) slots.push(`${String(h).padStart(2, "0")}:00`);
            if (Math.random() > 0.7) slots.push(`${String(h).padStart(2, "0")}:30`);
        }
        byDay[key] = slots;
    }
    return { doctor: mockDoctor(doctorId), slots: byDay };
}

function mockDoctor(id) {
    const map = {
        1: {
            id: 1,
            name: "Dr Marie Kouassi",
            specialty: "Cardiologie",
            fees: 15000,
        },
        2: {
            id: 2,
            name: "Clinique Santé Plus",
            specialty: "Centre médical",
            fees: 10000,
        },
        3: { id: 3, name: "Dr Mamadou Keita", specialty: "Pédiatrie", fees: 12000 },
    };
    return (
        map[id] || {
            id,
            name: `Docteur #${id}`,
            specialty: "Médecine générale",
            fees: 10000,
        }
    );
}
