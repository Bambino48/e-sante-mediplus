/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bone,
  Brain,
  Eye,
  Heart,
  MapPin,
  Search,
  Star,
  Stethoscope,
  User,
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
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  userLocation={coords}
                />
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

function DoctorCard({ doctor, userLocation }) {
  // Extraction des vraies données depuis l'API
  const doctorName = doctor.name || "Docteur";
  const specialty =
    doctor.profile?.specialty || doctor.specialty || "Médecine générale";
  const rating = doctor.profile?.rating || 0;
  const fee = doctor.profile?.fees || null;
  const city = doctor.location?.city || "";
  const bio = doctor.profile?.bio || "";
  const photo = doctor.photo;
  const doctorLat = doctor.location?.latitude;
  const doctorLng = doctor.location?.longitude;

  // Résolution de l'URL de la photo (gère photo stockée localement, base64 ou URL complète)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const resolvePhoto = (photoSource) => {
    const DEFAULT_AVATAR =
      "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    if (!photoSource) return DEFAULT_AVATAR;
    if (typeof photoSource !== "string") return DEFAULT_AVATAR;
    if (photoSource.startsWith("http")) return photoSource;
    if (photoSource.startsWith("data:image")) return photoSource;
    // Si c'est un chemin relatif renvoyé par l'API (ex: "avatars/.."), construire l'URL complète
    return `${API_URL}/storage/${photoSource}`;
  };
  const photoUrl = resolvePhoto(photo);

  // Calculs dérivés
  const shortBio = bio.length > 80 ? bio.substring(0, 80) + "..." : bio;
  const hasRating = rating > 0;

  // Calcul de la distance si coordonnées disponibles
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return null;

    const R = 6371; // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance =
    userLocation && doctorLat && doctorLng
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          doctorLat,
          doctorLng
        )
      : null;

  const distanceText = distance
    ? `${distance < 1 ? "< 1 km" : `${distance.toFixed(1)} km`}`
    : "";

  // Fonction pour obtenir l'icône et la couleur selon la spécialité
  const getSpecialtyInfo = (specialty) => {
    const specialtyMap = {
      // Médecine générale et variantes
      "Médecine générale": {
        icon: Stethoscope,
        color: "text-blue-600 dark:text-blue-400",
      },
      "Médecin general": {
        icon: Stethoscope,
        color: "text-blue-600 dark:text-blue-400",
      },
      "Médecine general": {
        icon: Stethoscope,
        color: "text-blue-600 dark:text-blue-400",
      },
      "Médecine Generale": {
        icon: Stethoscope,
        color: "text-blue-600 dark:text-blue-400",
      },

      // Cardiologie
      Cardiologie: { icon: Heart, color: "text-red-600 dark:text-red-400" },
      Cardiologue: { icon: Heart, color: "text-red-600 dark:text-red-400" },

      // Dermatologie
      Dermatologie: {
        icon: Stethoscope,
        color: "text-purple-600 dark:text-purple-400",
      },
      Dermatologue: {
        icon: Stethoscope,
        color: "text-purple-600 dark:text-purple-400",
      },

      // Ophtalmologie
      Ophtalmologie: {
        icon: Eye,
        color: "text-green-600 dark:text-green-400",
      },
      Ophtalmologue: {
        icon: Eye,
        color: "text-green-600 dark:text-green-400",
      },

      // Pédiatrie
      Pédiatrie: { icon: User, color: "text-pink-600 dark:text-pink-400" },
      Pédiatre: { icon: User, color: "text-pink-600 dark:text-pink-400" },

      // Gynécologie
      Gynécologie: { icon: User, color: "text-rose-600 dark:text-rose-400" },
      Gynécologue: { icon: User, color: "text-rose-600 dark:text-rose-400" },

      // Orthopédie
      Orthopédie: { icon: Bone, color: "text-orange-600 dark:text-orange-400" },
      Orthopédiste: {
        icon: Bone,
        color: "text-orange-600 dark:text-orange-400",
      },

      // Neurologie
      Neurologie: {
        icon: Brain,
        color: "text-indigo-600 dark:text-indigo-400",
      },
      Neurologue: {
        icon: Brain,
        color: "text-indigo-600 dark:text-indigo-400",
      },

      // Psychiatrie
      Psychiatrie: {
        icon: Brain,
        color: "text-violet-600 dark:text-violet-400",
      },
      Psychiatre: {
        icon: Brain,
        color: "text-violet-600 dark:text-violet-400",
      },

      // Dentisterie
      Dentisterie: {
        icon: Activity,
        color: "text-cyan-600 dark:text-cyan-400",
      },
      Dentiste: { icon: Activity, color: "text-cyan-600 dark:text-cyan-400" },
    };
    return (
      specialtyMap[specialty] || {
        icon: Stethoscope,
        color: "text-cyan-600 dark:text-cyan-400",
      }
    );
  };

  const specialtyInfo = getSpecialtyInfo(specialty);

  // Fonction pour corriger les fautes courantes dans les textes
  const correctText = (text) => {
    if (!text) return text;
    return text
      .replace(/pluseurs/g, "plusieurs")
      .replace(/expericences/g, "expériences")
      .replace(/experiance/g, "expérience")
      .replace(/disponible/g, "disponible")
      .replace(/professionel/g, "professionnel")
      .replace(/professionelle/g, "professionnelle")
      .replace(/specialiste/g, "spécialiste")
      .replace(/general/g, "général")
      .replace(/generale/g, "générale");
  };

  // Appliquer les corrections
  const correctedBio = correctText(bio);
  const correctedSpecialty = correctText(specialty);

  // Recalculer specialtyInfo avec la spécialité corrigée
  const correctedSpecialtyInfo = getSpecialtyInfo(correctedSpecialty);

  // Fonction pour afficher les étoiles
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="h-3 w-3 fill-yellow-400 text-yellow-400 inline"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="h-3 w-3 fill-yellow-400/50 text-yellow-400 inline"
          />
        );
      } else {
        stars.push(<Star key={i} className="h-3 w-3 text-gray-300 inline" />);
      }
    }
    return <span className="flex items-center gap-0.5">{stars}</span>;
  };

  return (
    <div className="card">
      {/* Photo de profil - Optimisée pour un rendu parfait */}
      <div className="aspect-square bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl overflow-hidden relative shadow-sm">
        {/* État de chargement */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 animate-pulse">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>

        {/* Image principale avec optimisation */}
        <img
          src={photoUrl}
          alt={`Photo de profil de ${doctorName}`}
          className="w-full h-full object-cover object-center transition-all duration-300 ease-in-out hover:scale-105"
          loading="lazy"
          onLoad={(e) => {
            // Masquer le loader quand l'image se charge
            const loader =
              e.target.parentElement.querySelector(".animate-pulse");
            if (loader) loader.style.display = "none";
          }}
          onError={(e) => {
            // Masquer l'image et afficher le fallback
            e.target.style.display = "none";
            const loader =
              e.target.parentElement.querySelector(".animate-pulse");
            if (loader) loader.style.display = "none";
            const fallback =
              e.target.parentElement.querySelector(".photo-fallback");
            if (fallback) fallback.style.display = "flex";
          }}
        />

        {/* Fallback élégant avec icône spécialisée */}
        <div
          className="photo-fallback absolute inset-0 flex items-center justify-center bg-linear-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 transition-all duration-300"
          style={{ display: "none" }}
        >
          <div className="text-center transform transition-transform duration-200 hover:scale-110">
            <div className="w-16 h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg border border-white/20 dark:border-slate-700/20">
              <correctedSpecialtyInfo.icon className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {correctedSpecialty}
            </div>
          </div>
        </div>

        {/* Rating en overlay avec design amélioré */}
        {hasRating && (
          <div className="absolute top-2 right-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-semibold flex items-center gap-1 shadow-lg border border-white/20 dark:border-slate-700/20">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-slate-700 dark:text-slate-200">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Overlay de hover pour plus d'interactivité */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 rounded-xl pointer-events-none"></div>
      </div>
      {/* Informations */}
      <div className="mt-3">
        <div className="font-medium text-slate-900 dark:text-white">
          {doctorName}
        </div>
        <div
          className={`text-sm font-medium flex items-center gap-1 ${correctedSpecialtyInfo.color}`}
        >
          <correctedSpecialtyInfo.icon className="h-4 w-4" />
          {correctedSpecialty}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {city && <div className="text-xs text-slate-500">📍 {city}</div>}
          {distanceText && (
            <div className="text-xs text-slate-500">• {distanceText}</div>
          )}
        </div>

        {/* Rating avec étoiles */}
        {hasRating && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {renderStars(rating)}
            </span>
            <span className="text-xs text-slate-500">
              ({rating.toFixed(1)})
            </span>
          </div>
        )}

        {/* Biographie courte */}
        {shortBio && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
            {correctedBio.length > 80
              ? correctedBio.substring(0, 80) + "..."
              : correctedBio}
          </p>
        )}

        {/* Prix et disponibilité */}
        <div className="text-sm text-slate-500 mt-2">
          {fee ? (
            <span className="font-medium text-green-600 dark:text-green-400">
              {fee.toLocaleString()} FCFA
            </span>
          ) : (
            <span className="text-slate-400">Prix sur demande</span>
          )}
          <span className="mx-2">•</span>
          <span>Sur RDV</span>
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
