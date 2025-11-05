// src/pages/pro/Prescriptions.jsx
import { useQuery } from "@tanstack/react-query";
import { listPrescriptionsByDoctor } from "../../api/prescriptions.js";
import PrescriptionCard from "../../components/PrescriptionCard.jsx";
import ProLayout from "../../layouts/ProLayout.jsx";

export default function Prescriptions() {
  const doctorId = "1"; // temporaire
  const { data, isLoading } = useQuery({
    queryKey: ["prescriptions", { doctorId }],
    queryFn: () => listPrescriptionsByDoctor(doctorId),
  });

  return (
    <ProLayout title="Mes prescriptions">
      {isLoading ? (
        <div className="card grid place-items-center py-16">Chargement…</div>
      ) : !data?.items?.length ? (
        <div className="card">Aucune prescription enregistrée.</div>
      ) : (
        data.items.map((p) => <PrescriptionCard key={p.id} prescription={p} />)
      )}
    </ProLayout>
  );
}
