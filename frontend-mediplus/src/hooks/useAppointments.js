/* eslint-disable no-unused-vars */
// src/hooks/useAppointments.js
// Petit hook générique pour lister des RDV (mock + prêt pour API)
import { useQuery } from "@tanstack/react-query";

// Option A: API réelle quand prête
// import api from "../api/axiosInstance";
// async function fetchAppointments({ role, status }) {
//   const { data } = await api.get("/api/appointments", { params: { role, status } });
//   return data;
// }

// Option B: Mock local (par défaut)
async function fetchAppointments({ role, status }) {
    const base = [
        { id: "a1", patient: "Aïcha K.", doctor: "Dr Marie Kouassi", date: "2025-11-01", time: "09:00", mode: "presentiel", status: "confirmed", price_cfa: 15000 },
        { id: "a2", patient: "Jean-Marc B.", doctor: "Dr Mamadou Keita", date: "2025-11-01", time: "11:30", mode: "teleconsult", status: "pending", price_cfa: 12000 },
        { id: "a3", patient: "Leroy D.", doctor: "Dr Marie Kouassi", date: "2025-11-02", time: "14:00", mode: "presentiel", status: "done", price_cfa: 15000 },
    ];
    const filtered = base.filter((x) => !status || x.status === status);
    // rôle 'patient' = ne renvoie que ses RDV / 'doctor' = ses RDV patients
    return { items: filtered };
}

export function useAppointments({ role = "patient", status } = {}) {
    return useQuery({
        queryKey: ["appointments", { role, status }],
        queryFn: () => fetchAppointments({ role, status }),
    });
}
