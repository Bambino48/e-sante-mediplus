// src/pages/patient/Prescriptions.jsx
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { listPrescriptionsByPatient, markDoseTaken } from "../../api/prescriptions.js";
import { usePrescriptionsStore } from "../../store/prescriptionsStore.js";
import PrescriptionCard from "../../components/PrescriptionCard.jsx";
import MedicationItem from "../../components/MedicationItem.jsx";

// NOTE: patientId fictif : remplace par l'ID du patient connecté via ton auth store
const patientId = "42";

export default function PatientPrescriptions() {
    const qc = useQueryClient();
    const setItems = usePrescriptionsStore((s) => s.setItems);
    const items = usePrescriptionsStore((s) => s.items);

    const { data, isLoading } = useQuery({
        queryKey: ["prescriptions", { patientId }],
        queryFn: () => listPrescriptionsByPatient(patientId),
    });

    useEffect(() => {
        if (data?.items) setItems(data.items);
    }, [data, setItems]);

    const mutation = useMutation({
        mutationFn: markDoseTaken,
        onSuccess: () => {
            toast.success("Pris ✅");
            qc.invalidateQueries({ queryKey: ["prescriptions"] });
        },
        onError: () => toast.error("Échec enregistrement"),
    });

    if (isLoading) {
        return (
            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="card grid place-items-center py-20">Chargement…</div>
            </main>
        );
    }

    return (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-4">
            <div className="text-xl font-semibold">Mes ordonnances</div>

            {!items.length && (
                <div className="card">Aucune ordonnance pour le moment.</div>
            )}

            {items.map((p) => (
                <div key={p.id} className="space-y-3">
                    <PrescriptionCard prescription={p} />
                    <div className="grid sm:grid-cols-2 gap-3">
                        {p.medications.map((m) => (
                            <MedicationItem key={m.id} med={m} onTake={(id) => mutation.mutate(id)} />
                        ))}
                    </div>
                </div>
            ))}
        </main>
    );
}
