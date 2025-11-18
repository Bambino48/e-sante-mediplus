/* eslint-disable no-unused-vars */
// src/pages/pro/PrescriptionsEditor.jsx
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { createPrescription } from "../../api/prescriptions.js";
import { useAuth } from "../../hooks/useAuth.js";
import { usePatients } from "../../hooks/usePatients.js";
import ProLayout from "../../layouts/ProLayout.jsx";

export default function PrescriptionsEditor() {
  const [searchParams] = useSearchParams();
  const [patientId, setPatientId] = useState("");
  const [meds, setMeds] = useState([
    {
      name: "",
      dosage: "",
      intake: "",
      frequency: 1,
      duration_days: 3,
      instructions: "",
    },
  ]);

  // Récupérer le docteur connecté et la liste des patients
  const { user: doctor } = useAuth();
  const { data: patients, isLoading: patientsLoading } = usePatients();

  // Pré-remplir le patient si fourni dans l'URL
  useEffect(() => {
    const patientIdFromUrl = searchParams.get("patientId");
    if (patientIdFromUrl) {
      setPatientId(patientIdFromUrl);
    }
  }, [searchParams]);

  const addMed = () =>
    setMeds((m) => [
      ...m,
      {
        name: "",
        dosage: "",
        intake: "",
        frequency: 1,
        duration_days: 3,
        instructions: "",
      },
    ]);
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
    const valid =
      patientId && meds.every((m) => m.name && m.dosage && m.intake);
    if (!valid)
      return toast.error(
        "Veuillez remplir le patient et chaque médicament (nom, dosage, prise)"
      );
    mutation.mutate({
      patient_id: patientId,
      medications: meds,
    });
  };

  return (
    <ProLayout title="Créer une ordonnance">
      <div className="card">
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-500">Patient</label>
              <select
                className="input"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                disabled={patientsLoading}
              >
                <option value="">Sélectionner un patient</option>
                {patients?.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500">Docteur</label>
              <input
                className="input"
                value={doctor?.name || "Docteur non connecté"}
                disabled
                readOnly
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium">Médicaments</div>
            {meds.map((m, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-3"
              >
                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    className="input"
                    placeholder="Nom (ex: Amoxicilline)"
                    value={m.name}
                    onChange={(e) => setField(idx, "name", e.target.value)}
                  />
                  <input
                    className="input"
                    placeholder="Dosage (ex: 500 mg)"
                    value={m.dosage}
                    onChange={(e) => setField(idx, "dosage", e.target.value)}
                  />
                  <input
                    className="input"
                    placeholder="Prise (ex: matin, midi, soir)"
                    value={m.intake}
                    onChange={(e) => setField(idx, "intake", e.target.value)}
                  />
                  <input
                    className="input"
                    type="number"
                    min="1"
                    placeholder="Fréquence/jour"
                    value={m.frequency}
                    onChange={(e) => setField(idx, "frequency", e.target.value)}
                  />
                  <input
                    className="input"
                    type="number"
                    min="1"
                    placeholder="Durée (jours)"
                    value={m.duration_days}
                    onChange={(e) =>
                      setField(idx, "duration_days", e.target.value)
                    }
                  />
                  <input
                    className="input sm:col-span-3"
                    placeholder="Instructions"
                    value={m.instructions}
                    onChange={(e) =>
                      setField(idx, "instructions", e.target.value)
                    }
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    className="btn-ghost text-xs"
                    onClick={() => removeMed(idx)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn-secondary" onClick={addMed}>
              Ajouter un médicament
            </button>
          </div>

          <div className="pt-2 flex gap-2">
            <button className="btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? "Création…" : "Créer l’ordonnance"}
            </button>
            <button type="button" className="btn-ghost">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </ProLayout>
  );
}
