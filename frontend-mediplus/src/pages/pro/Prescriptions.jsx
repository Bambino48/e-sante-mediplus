// src/pages/pro/Prescriptions.jsx
import { FileText, RefreshCw } from "lucide-react";
import PrescriptionCard from "../../components/PrescriptionCard.jsx";
import { usePrescriptions } from "../../hooks/usePrescriptions.js";
import ProLayout from "../../layouts/ProLayout.jsx";

export default function Prescriptions() {
  const { data: prescriptions, isLoading, error, refetch } = usePrescriptions();

  return (
    <ProLayout title="Mes prescriptions">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {prescriptions.length} prescription
            {prescriptions.length !== 1 ? "s" : ""} émise
            {prescriptions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn-secondary text-xs"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw size={14} className="animate-spin mr-2" />
              Actualisation...
            </>
          ) : (
            <>
              <RefreshCw size={14} className="mr-2" />
              Actualiser
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="card grid place-items-center py-16">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 rounded-full border-2 border-cyan-500 border-t-transparent"></div>
            <span>Chargement des prescriptions...</span>
          </div>
        </div>
      ) : error ? (
        <div className="card text-center py-16">
          <div className="text-red-500 mb-4">
            <FileText size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Erreur de chargement
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Impossible de charger les prescriptions. Veuillez réessayer.
          </p>
          <button onClick={() => refetch()} className="btn-primary">
            Réessayer
          </button>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="card text-center py-16">
          <FileText size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Aucune prescription
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Vous n'avez pas encore émis de prescriptions.
          </p>
          <button className="btn-primary">Créer une prescription</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
            />
          ))}
        </div>
      )}
    </ProLayout>
  );
}
