/* eslint-disable no-unused-vars */
import api from "./axiosInstance.js";


export async function searchProviders(params) {
    // 👉 Version API réelle — décommente quand le backend est prêt
    // const { data } = await api.get("/api/search", { params });
    // return data;
    return mockSearch(params); // ⚠️ mock local en attendant l'API
}

// -------- MOCK ---------
const MOCK = [
    {
        id: 1,
        name: "Dr Marie Kouassi",
        specialty: "Cardiologie",
        rating: 4.7,
        languages: ["FR", "EN"],
        fees: 15000,
        lat: 5.3456,
        lng: -4.0237,
        nextSlot: "10:30",
        distance_km: 2.1,
    },
    {
        id: 2,
        name: "Clinique Santé Plus",
        specialty: "Centre médical",
        rating: 4.4,
        languages: ["FR"],
        fees: 10000,
        lat: 5.3556,
        lng: -4.0137,
        nextSlot: "11:15",
        distance_km: 3.8,
    },
    {
        id: 3,
        name: "Dr Mamadou Keita",
        specialty: "Pédiatrie",
        rating: 4.9,
        languages: ["FR"],
        fees: 12000,
        lat: 5.3256,
        lng: -4.0537,
        nextSlot: "09:45",
        distance_km: 4.5,
    },
];

function mockSearch(params) {
    const { q = "", specialty = "", minRating = 0, language = "", radius_km = 50, lat, lng } = params || {};
    let res = [...MOCK];
    if (q) res = res.filter((x) => x.name.toLowerCase().includes(q.toLowerCase()));
    if (specialty) res = res.filter((x) => x.specialty.toLowerCase().includes(specialty.toLowerCase()));
    if (language) res = res.filter((x) => x.languages.includes(language));
    if (minRating) res = res.filter((x) => x.rating >= Number(minRating));
    if (lat && lng) res = res.map((x) => ({ ...x, distance_km: haversine(lat, lng, x.lat, x.lng) }));
    return Promise.resolve({ items: res });
}

function haversine(lat1, lon1, lat2, lon2) {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // km
}