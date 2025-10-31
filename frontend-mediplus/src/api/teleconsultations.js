/* eslint-disable no-unused-vars */
import api from "./axiosInstance.js";


// À brancher côté Laravel quand prêt
// export async function startTeleconsult(appointmentId) {
// const { data } = await api.post(`/api/teleconsultations/${appointmentId}/start`);
// return data; // { room_id, token? }
// }
// export async function endTeleconsult(appointmentId) {
// const { data } = await api.post(`/api/teleconsultations/${appointmentId}/end`);
// return data;
// }


// Mock pour l’instant
export async function startTeleconsult(appointmentId) {
    return { room_id: String(appointmentId) };
}
export async function endTeleconsult() { return { ok: true }; }