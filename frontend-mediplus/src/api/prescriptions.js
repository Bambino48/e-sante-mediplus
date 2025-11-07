// src/api/prescriptions.js
import api from "./axiosInstance.js";

// ✅ API Réelles - Médicaments à prendre aujourd'hui
export async function getTodayMedications() {
    const { data } = await api.get("/medications/today");
    return data; // { items: [...] }
}

// ✅ API Réelles - Liste des ordonnances du patient
export async function getPatientPrescriptions() {
    const { data } = await api.get("/patient/prescriptions");
    return data; // { items: [...] }
}

// Mock local en attendant Laravel. Les données sont en mémoire (réinitialisées au refresh).
const DB = {
    prescriptions: [],
    medications: [],
};

export async function createPrescription(payload) {
    // payload: { doctor_id, patient_id, medications: [{ name, dosage, frequency, duration_days, instructions }] }
    if (
        !payload?.doctor_id ||
        !payload?.patient_id ||
        !Array.isArray(payload?.medications)
    ) {
        throw new Error("Données d’ordonnance incomplètes");
    }

    const id = crypto.randomUUID();
    const pdf_url = `https://example.com/prescription/${id}.pdf`;
    const qr_data = JSON.stringify({ id, patient_id: payload.patient_id });

    const presc = {
        id,
        doctor_id: payload.doctor_id,
        patient_id: payload.patient_id,
        created_at: new Date().toISOString(),
        status: "signed",
        pdf_url,
        qr_data,
    };

    DB.prescriptions.unshift(presc);

    // créer les médicaments rattachés
    payload.medications.forEach((m) => {
        DB.medications.push({
            id: crypto.randomUUID(),
            prescription_id: id,
            name: m.name,
            dosage: m.dosage,
            frequency: Number(m.frequency) || 1, // prises / jour
            duration_days: Number(m.duration_days) || 1,
            instructions: m.instructions || "",
            adherence: [], // { dateISO, taken: true }
        });
    });

    return { prescription: presc };
}

export async function listPrescriptionsByPatient(patient_id) {
    const presc = DB.prescriptions.filter((p) => p.patient_id === patient_id);
    const meds = DB.medications.filter((m) =>
        presc.some((p) => p.id === m.prescription_id)
    );
    // regrouper
    const items = presc.map((p) => ({
        ...p,
        medications: meds.filter((m) => m.prescription_id === p.id),
    }));
    return { items };
}

export async function listPrescriptionsByDoctor(doctor_id) {
    const presc = DB.prescriptions.filter((p) => p.doctor_id === doctor_id);
    const meds = DB.medications.filter((m) =>
        presc.some((p) => p.id === m.prescription_id)
    );
    const items = presc.map((p) => ({
        ...p,
        medications: meds.filter((m) => m.prescription_id === p.id),
    }));
    return { items };
}

export async function markDoseTaken(medication_id) {
    const med = DB.medications.find((m) => m.id === medication_id);
    if (!med) throw new Error("Médicament introuvable");
    med.adherence.push({ dateISO: new Date().toISOString(), taken: true });
    return { ok: true, medication: med };
}
