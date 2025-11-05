/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  AlertTriangle,
  MapPin,
  Search,
  Stethoscope,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDoctorsList } from "../../api/doctors.js";
import { useGeo } from "../../hooks/useGeo.js";

export default function PatientHome() {
  // État local pour gérer les docteurs
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // État pour le formulaire de recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  // Hooks pour la navigation et la géolocalisation
  const navigate = useNavigate();
  const { coords, detect } = useGeo();

  // Fonction pour charger les docteurs
  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🔄 Chargement des docteurs...");
      const response = await getDoctorsList({
        per_page: 6,
        has_profile: true,
        sort_by: "rating",
        sort_order: "desc",
      });

      // La structure est : response.data.doctors (et non response.data.data.doctors)
      const doctorsArray = response.data?.doctors || [];
      setDoctors(doctorsArray);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des docteurs:", err);
      console.error("📋 Détails de l'erreur:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(err);
      // Fallback vers une liste vide
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Récupération des docteurs au chargement du composant
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fonction pour gérer la recherche
  const handleSearch = (e) => {
    e.preventDefault();

    // Paramètres de recherche à passer
    const searchParams = new URLSearchParams();

    if (searchQuery.trim()) {
      searchParams.set("q", searchQuery.trim());
    }

    if (locationQuery.trim()) {
      searchParams.set("location", locationQuery.trim());
    }

    // Si on a des coordonnées GPS, les inclure
    if (coords) {
      searchParams.set("lat", coords.lat.toString());
      searchParams.set("lng", coords.lng.toString());
    }

    // Redirection vers la page de recherche avec les paramètres
    const queryString = searchParams.toString();
    navigate(`/search${queryString ? "?" + queryString : ""}`);
  };

  // Fonction pour détecter la localisation
  const handleLocationDetect = () => {
    detect();
  };

  return (
    <main className="pt-4 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold tracking-tight"
              >
                Trouvez, réservez, consultez —
                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-teal-500">
                  {" "}
                  en quelques clics
                </span>
              </motion.h1>
              <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-xl">
                Plateforme e‑Santé intelligente pour patients et professionnels
                : RDV, téléconsultation, ordonnances numériques et rappels
                médicaments.
              </p>
              {/* Search bar */}
              <form
                onSubmit={handleSearch}
                className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm"
              >
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                    <Search className="h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Symptômes, spécialité, nom"
                      className="bg-transparent outline-none w-full text-sm"
                    />
                  </div>
                  <div className="relative flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder={
                        coords
                          ? `Position détectée (${coords.lat.toFixed(
                              4
                            )}, ${coords.lng.toFixed(4)})`
                          : "Abobo, Treichville…"
                      }
                      className="bg-transparent outline-none w-full text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleLocationDetect}
                      className="text-blue-500 hover:text-blue-600 text-xs shrink-0"
                      title="Détecter ma position"
                    >
                      📍
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                      disabled={
                        !searchQuery.trim() && !locationQuery.trim() && !coords
                      }
                    >
                      Rechercher
                    </button>
                  </div>
                </div>
              </form>{" "}
              {/* Quick CTAs */}
              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                <CTA icon={<Stethoscope />} title="Prendre RDV" to="/search" />
                <CTA
                  icon={<Video />}
                  title="Téléconsultation maintenant"
                  to="/teleconsult"
                />
                <CTA
                  icon={<AlertTriangle />}
                  title="Besoin d'urgence ?"
                  to="/triage"
                  variant="warning"
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="aspect-4/3 rounded-3xl bg-linear-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/20 border border-slate-200 dark:border-slate-800 shadow-inner" />
              <div className="absolute inset-6 rounded-3xl border border-dashed border-cyan-300/50 dark:border-cyan-700/40" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Near me cards */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Près de moi</h2>
            <Link to="/search" className="text-sm text-cyan-600">
              Voir tout
            </Link>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-36 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                  <div className="mt-3 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">
                Erreur lors du chargement des docteurs
              </p>
              <button
                onClick={fetchDoctors}
                className="btn-secondary"
                disabled={isLoading}
              >
                {isLoading ? "Chargement..." : "Réessayer"}
              </button>
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">
                Aucun docteur disponible pour le moment
              </p>
              <Link to="/search" className="btn-primary">
                Explorer tous les professionnels
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function DoctorCard({ doctor }) {
  const doctorName =
    doctor.name || `Dr. ${doctor.first_name} ${doctor.last_name}` || "Docteur";
  const specialty =
    doctor.specialty || doctor.specialization || "Médecine générale";
  const rating = doctor.rating || 4.5;
  const fee = doctor.consultation_fee || doctor.fees || 15000;
  const nextSlot = doctor.next_availability || "Sur RDV";
  const distance = doctor.distance_km ? `${doctor.distance_km} km` : "";

  return (
    <div className="card">
      <div className="h-36 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Stethoscope className="h-8 w-8 text-cyan-600" />
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            ⭐ {rating.toFixed(1)}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="font-medium">
          {doctorName} — {specialty}
        </div>
        <div className="text-sm text-slate-500">
          {distance && `${distance} · `}Dès {nextSlot} · {fee.toLocaleString()}{" "}
          FCFA
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Link className="btn-secondary flex-1" to={`/doctor/${doctor.id}`}>
          Détails
        </Link>
        <Link className="btn-primary flex-1" to={`/booking/${doctor.id}`}>
          Réserver
        </Link>
      </div>
    </div>
  );
}

function CTA({ icon, title, to, variant }) {
  const base = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm";
  const styles =
    variant === "warning"
      ? "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800"
      : "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-100 dark:border-slate-700";
  return (
    <Link to={to} className={`${base} ${styles}`}>
      <span className="shrink-0">{icon}</span>
      <span className="font-medium">{title}</span>
    </Link>
  );
}
