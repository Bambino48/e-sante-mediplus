/* eslint-disable no-unused-vars */
// src/pages/pro/PrescriptionsEditor.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createPrescription } from "../../api/prescriptions.js";

export default function PrescriptionsEditor() {
    const [patientId, setPatientId] = useState("");
    const [doctorId, setDoctorId] = useState("1"); // TODO: remplacer par l'id du docteur connecté
    const [meds, setMeds] = useState([
        { name: "", dosage: "", frequency: 1, duration_days: 3, instructions: "" },
    ]);

    const addMed = () => setMeds((m) => [...m, { name: "", dosage: "", frequency: 1, duration_days: 3, instructions: "" }]);
    const removeMed = (idx) => setMeds((m) => m.filter((_, i) => i !== idx));
    const setField = (idx, key, val) =>
        setMeds((m) => m.map((x, i) => (i === idx ? { ...x, [key]: val } : x)));

    const mutation = useMutation({
        mutationFn: createPrescription,
        onSuccess: ({ prescription }) => {
            toast.success("Ordonnance créée ✅");
            // Redirection douce : le patient la verra dans /patient/prescriptions
        },
        onError: (e) => toast.error(e.message || "Erreur création ordonnance"),
    });

    const submit = (e) => {
        e.preventDefault();
        const valid = patientId && meds.every((m) => m.name && m.dosage);
        if (!valid) return toast.error("Veuillez remplir le patient et chaque médicament (nom + dosage)");
        mutation.mutate({ patient_id: patientId, doctor_id: doctorId, medications: meds });
    };

    return (
        <main className="max-w-3xl mx-auto px-4 py-8">
            <div className="card">
                <h1 className="text-xl font-semibold">Créer une ordonnance</h1>
                <form className="mt-4 space-y-4" onSubmit={submit}>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm text-slate-500">Patient ID</label>
                            <input className="input" value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="ex: 42" />
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">Docteur ID</label>
                            <input className="input" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="text-sm font-medium">Médicaments</div>
                        {meds.map((m, idx) => (
                            <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <input className="input" placeholder="Nom (ex: Amoxicilline)" value={m.name} onChange={(e) => setField(idx, "name", e.target.value)} />
                                    <input className="input" placeholder="Dosage (ex: 500 mg)" value={m.dosage} onChange={(e) => setField(idx, "dosage", e.target.value)} />
                                    <input className="input" type="number" min="1" placeholder="Fréquence/jour" value={m.frequency} onChange={(e) => setField(idx, "frequency", e.target.value)} />
                                    <input className="input" type="number" min="1" placeholder="Durée (jours)" value={m.duration_days} onChange={(e) => setField(idx, "duration_days", e.target.value)} />
                                    <input className="input sm:col-span-2" placeholder="Instructions" value={m.instructions} onChange={(e) => setField(idx, "instructions", e.target.value)} />
                                </div>
                                <div className="mt-2 flex justify-end">
                                    <button type="button" className="btn-ghost text-xs" onClick={() => removeMed(idx)}>Supprimer</button>
                                </div>
                            </div>
                        ))}
                        <button type="button" className="btn-secondary" onClick={addMed}>Ajouter un médicament</button>
                    </div>

                    <div className="pt-2 flex gap-2">
                        <button className="btn-primary" disabled={mutation.isPending}>{mutation.isPending ? "Création…" : "Créer l’ordonnance"}</button>
                        <button type="button" className="btn-ghost">Annuler</button>
                    </div>
                </form>
            </div>
        </main>
    );
}
