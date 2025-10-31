/* eslint-disable no-unused-vars */
import api from "./axiosInstance.js";

// 🔗 API réelles (décommente quand le backend sera prêt)
// export async function getDoctorAvailabilities(doctorId, params) {
//   const { data } = await api.get(`/api/doctors/${doctorId}/availabilities`, { params });
//   return data; // { slots: { '2025-10-30': ['09:00','09:30'] , ... } }
// }
//
// export async function bookAppointment(payload) {
//   const { data } = await api.post('/api/appointments', payload);
//   return data;
// }

// 🧪 MOCK local en attendant l'API Laravel
export async function getDoctorAvailabilities(doctorId) {
    // Génère une semaine de slots fictifs
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
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

export async function bookAppointment(payload) {
    if (!payload?.doctor_id || !payload?.start_at || !payload?.mode) {
        throw new Error("Champs de réservation incomplets");
    }
    await new Promise((r) => setTimeout(r, 500)); // simulate latency
    return { id: Math.floor(Math.random() * 100000), status: "pending", ...payload };
}

function mockDoctor(id) {
    const map = {
        1: { id: 1, name: "Dr Marie Kouassi", specialty: "Cardiologie", fees: 15000 },
        2: { id: 2, name: "Clinique Santé Plus", specialty: "Centre médical", fees: 10000 },
        3: { id: 3, name: "Dr Mamadou Keita", specialty: "Pédiatrie", fees: 12000 },
    };
    return map[id] || { id, name: `Docteur #${id}`, specialty: "Médecine générale", fees: 10000 };
}
