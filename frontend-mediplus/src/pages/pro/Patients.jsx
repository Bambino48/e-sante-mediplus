// src/pages/pro/Patients.jsx
import { Calendar, User } from "lucide-react";
import { usePatients } from "../../hooks/usePatients.js";
import ProLayout from "../../layouts/ProLayout.jsx";

export default function Patients() {
  const { data: patients, isLoading, refetch } = usePatients();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <ProLayout title="Mes patients">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {patients.length} patient{patients.length !== 1 ? "s" : ""} suivi
            {patients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn-secondary text-xs"
          disabled={isLoading}
        >
          {isLoading ? "Actualisation..." : "Actualiser"}
        </button>
      </div>

      {isLoading ? (
        <div className="card grid place-items-center py-16">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 rounded-full border-2 border-cyan-500 border-t-transparent"></div>
            <span>Chargement des patients...</span>
          </div>
        </div>
      ) : patients.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                    <User
                      size={20}
                      className="text-cyan-600 dark:text-cyan-400"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ID: {patient.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Dernier RDV:{" "}
                    {formatDate(patient.lastAppointment.scheduled_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {patient.totalAppointments} rendez-vous total
                  </span>
                  {patient.upcomingAppointments > 0 && (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                      {patient.upcomingAppointments} à venir
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="btn-primary flex-1 text-xs">
                  Voir dossier
                </button>
                <button className="btn-ghost text-xs px-3">Contacter</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-16">
          <User size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Aucun patient
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Vous n'avez pas encore de patients inscrits à vos rendez-vous.
          </p>
          <button className="btn-primary">Voir les disponibilités</button>
        </div>
      )}
    </ProLayout>
  );
}
