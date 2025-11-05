// src/pages/pro/Patients.jsx
import { useAppointments } from "../../hooks/useAppointments.js";
import ProLayout from "../../layouts/ProLayout.jsx";

export default function Patients() {
    const { data, isLoading } = useAppointments({ role: "doctor" });

    const patients = [
        ...new Map((data?.items || []).map((a) => [a.patient, a])).values(),
    ];

    return (
        <ProLayout title="Mes patients">
            {isLoading ? (
                <div className="card grid place-items-center py-16">Chargement…</div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {patients.map((p) => (
                        <div key={p.patient} className="card">
                            <div className="font-medium">{p.patient}</div>
                            <div className="text-sm text-slate-500">
                                Dernier RDV : {p.date} à {p.time}
                            </div>
                            <button className="btn-ghost text-xs mt-2">Voir dossier</button>
                        </div>
                    ))}
                </div>
            )}
        </ProLayout>
    );
}
