// src/pages/pro/Prescriptions.jsx
import { useQuery } from "@tanstack/react-query";
import { listPrescriptionsByDoctor } from "../../api/prescriptions.js";
import PrescriptionCard from "../../components/PrescriptionCard.jsx";

export default function Prescriptions() {
    const doctorId = "1"; // temporaire
    const { data, isLoading } = useQuery({
        queryKey: ["prescriptions", { doctorId }],
        queryFn: () => listPrescriptionsByDoctor(doctorId),
    });

    return (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-4">
            <h1 className="text-xl font-semibold">Mes prescriptions</h1>
            {isLoading ? (
                <div className="card grid place-items-center py-16">Chargement…</div>
            ) : !data?.items?.length ? (
                <div className="card">Aucune prescription enregistrée.</div>
            ) : (
                data.items.map((p) => <PrescriptionCard key={p.id} prescription={p} />)
            )}
        </main>
    );
}
