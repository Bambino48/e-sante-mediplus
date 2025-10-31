// src/api/admin.js

const DB = {
    users: [
        { id: "1", name: "Dr. Marie Kouassi", role: "doctor", verified: true },
        { id: "2", name: "Aïcha Koné", role: "patient", verified: true },
        { id: "3", name: "Admin Central", role: "admin", verified: true },
    ],
    pharmacies: [
        { id: "ph1", name: "Pharmacie du Soleil", address: "Abidjan", phone: "01020304", on_guard: true },
        { id: "ph2", name: "Pharmacie de la Paix", address: "Yamoussoukro", phone: "05060708", on_guard: false },
    ],
};

export async function listUsers() {
    return { items: DB.users };
}

export async function listPharmacies() {
    return { items: DB.pharmacies };
}

export async function createPharmacy(data) {
    const id = crypto.randomUUID();
    const newPh = { id, ...data };
    DB.pharmacies.push(newPh);
    return { pharmacy: newPh };
}

export async function updatePharmacy(id, data) {
    const idx = DB.pharmacies.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Pharmacie introuvable");
    DB.pharmacies[idx] = { ...DB.pharmacies[idx], ...data };
    return { pharmacy: DB.pharmacies[idx] };
}

export async function deletePharmacy(id) {
    const idx = DB.pharmacies.findIndex((p) => p.id === id);
    if (idx !== -1) DB.pharmacies.splice(idx, 1);
    return { ok: true };
}

export async function toggleUserVerification(id) {
    const u = DB.users.find((x) => x.id === id);
    if (!u) throw new Error("Utilisateur introuvable");
    u.verified = !u.verified;
    return { user: u };
}
