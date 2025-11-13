import { Heart, MapPin, Search as SearchIcon, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import MapWithMarkers from "../../components/MapWithMarkers.jsx";

import { motion } from "framer-motion";
import {
  Activity,
  Bone,
  Brain,
  Calendar,
  Eye,
  Stethoscope,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getDoctorsList } from "../../api/doctors.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useDoctorAvailabilities } from "../../hooks/useDoctors.js";
import { useGeo } from "../../hooks/useGeo.js";
import { useFavoritesStore } from "../../store/favoritesStore.js";

export default function Search() {
  const { coords, detect, setCoords } = useGeo();

  // État de recherche
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [language, setLanguage] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [radius, setRadius] = useState(10);
  const [realTimeItems, setRealTimeItems] = useState([]); // Items provenant d'Overpass
  const [isLoading, setIsLoading] = useState(false);
  const [searchFunction, setSearchFunction] = useState(null);

  // État pour afficher tous les médecins
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);
  const [allDoctorsLoading, setAllDoctorsLoading] = useState(false);

  // Fonction pour charger tous les médecins
  const fetchAllDoctors = async () => {
    try {
      setAllDoctorsLoading(true);
      console.log("🔄 Chargement de tous les médecins...");

      const response = await getDoctorsList({
        per_page: 100, // Charger beaucoup de médecins
        has_profile: true,
        sort_by: "name",
        sort_order: "asc",
      });

      const doctorsArray = response.data?.doctors || [];
      setAllDoctors(doctorsArray);
      console.log(`✅ ${doctorsArray.length} médecins chargés`);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des médecins:", error);
      setAllDoctors([]);
    } finally {
      setAllDoctorsLoading(false);
    }
  };

  // Initialiser les valeurs depuis les paramètres URL
  useEffect(() => {
    // Lire les paramètres d'URL pour pré-remplir la recherche
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get("q");
    const locationParam = urlParams.get("location");
    const latParam = urlParams.get("lat");
    const lngParam = urlParams.get("lng");
    const showAllParam = urlParams.get("show_all_doctors");

    // Vérifier si on doit afficher tous les médecins
    if (showAllParam === "true") {
      setShowAllDoctors(true);
      fetchAllDoctors();
      return; // Ne pas continuer avec les autres paramètres
    }

    // Définir la requête de recherche
    if (queryParam) {
      setQ(queryParam);
    }

    // Définir la localisation manuelle
    if (locationParam) {
      setCoords((prev) => ({ ...prev, manual: locationParam }));
    }

    // Définir les coordonnées GPS si présentes
    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      if (!isNaN(lat) && !isNaN(lng)) {
        setCoords({ lat, lng });
      }
    }
  }, [setCoords]);

  // Fonction pour déclencher la recherche manuellement
  const handleManualSearch = useCallback(async () => {
    // Validation des prérequis
    if (!coords) {
      return;
    }

    if (q.trim().length < 3) {
      return;
    }

    if (!searchFunction) {
      return;
    }

    setIsLoading(true);
    try {
      await searchFunction();
    } catch {
      // TODO: Afficher un message d'erreur à l'utilisateur
    } finally {
      setIsLoading(false);
    }
  }, [coords, q, searchFunction]); // Dépendances optimisées

  // Callback pour recevoir la fonction de recherche du composant Map
  const handleSearchFunctionUpdate = (searchFunc) => {
    setSearchFunction(() => searchFunc);
  };

  // Callback pour recevoir les items du composant Map
  const handleItemsUpdate = (items) => {
    setRealTimeItems(items);
  };

  // Callback pour synchroniser l'état de chargement
  const handleLoadingStateUpdate = (loading) => {
    setIsLoading(loading);
  };

  // Suppression de la recherche automatique - tout se fait manuellement maintenant

  // Utiliser realTimeItems au lieu de data
  const items = realTimeItems ?? [];
  const itemsWithoutCoords = []; // Pas nécessaire avec Overpass car on a les coordonnées
  const allItems = realTimeItems ?? [];
  const totalAll = realTimeItems?.length ?? 0;

  // Si on affiche tous les médecins, utiliser une vue différente
  if (showAllDoctors) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* En-tête pour tous les médecins */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Tous les médecins
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            {allDoctorsLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Chargement des médecins...
              </span>
            ) : (
              <span>
                {`${allDoctors.length} médecin${
                  allDoctors.length > 1 ? "s" : ""
                } trouvé${allDoctors.length > 1 ? "s" : ""}`}
              </span>
            )}
          </div>
        </div>

        {/* Liste de tous les médecins */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {allDoctorsLoading ? (
            // Squelettes de chargement
            Array.from({ length: 8 }).map((_, i) => (
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
            ))
          ) : allDoctors.length > 0 ? (
            allDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-slate-500 mb-4">
                Aucun médecin disponible pour le moment
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <div>
      {/* En-tête avec compteur */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Recherche d'établissements de santé
        </h1>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Recherche en cours...
              </span>
            ) : (
              <>
                {`${totalAll} établissement${totalAll > 1 ? "s" : ""} trouvé${
                  totalAll > 1 ? "s" : ""
                }`}
                <span className="text-blue-600">
                  ({items.length} sur la carte)
                </span>
                {itemsWithoutCoords.length > 0 && (
                  <span className="text-amber-600">
                    {" • "}
                    {itemsWithoutCoords.length} sans coordonnées
                  </span>
                )}
              </>
            )}
          </span>
          {coords && (
            <span className="text-blue-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              Position détectée
            </span>
          )}
          {!coords && (
            <span className="text-amber-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
              Position non détectée
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Colonne gauche : Filtres + Liste */}
        <div className="space-y-4">
          <div className="card">
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Champ de recherche avec bouton intégré */}
              <div className="relative flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800 transition-colors">
                <SearchIcon className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Nom, symptôme, spécialité..."
                  className="bg-transparent outline-none w-full text-sm placeholder:text-slate-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && q.trim().length >= 3 && coords) {
                      handleManualSearch();
                    }
                  }}
                  aria-label="Rechercher un établissement de santé"
                />
                <button
                  type="button"
                  onClick={handleManualSearch}
                  disabled={isLoading || !coords || q.trim().length < 3}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 
                    flex items-center gap-1 shrink-0 min-w-10 justify-center
                    ${
                      isLoading || !coords || q.trim().length < 3
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                    }
                  `}
                  title={
                    !coords
                      ? "Localisation requise pour effectuer une recherche"
                      : q.trim().length < 3
                      ? "Tapez au moins 3 caractères"
                      : "Lancer la recherche"
                  }
                  aria-label={
                    !coords
                      ? "Localisation requise pour effectuer une recherche"
                      : q.trim().length < 3
                      ? "Tapez au moins 3 caractères pour rechercher"
                      : "Lancer la recherche"
                  }
                >
                  {isLoading ? (
                    <div
                      className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"
                      aria-hidden="true"
                    />
                  ) : (
                    "Go"
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                <MapPin className="h-5 w-5 text-slate-400" />
                <input
                  onChange={(e) =>
                    setCoords((c) => ({ ...(c || {}), manual: e.target.value }))
                  }
                  placeholder="Localisation (ex: Abobo)"
                  className="bg-transparent outline-none w-full text-sm"
                />
                <button onClick={detect} className="btn-ghost text-xs">
                  Me localiser
                </button>
              </div>
            </div>
            <div className="mt-3 grid sm:grid-cols-4 gap-3">
              <select
                className="input"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="">Tous les établissements</option>
                <optgroup label="👨‍⚕️ Médecins">
                  <option>Cardiologie</option>
                  <option>Pédiatrie</option>
                  <option>Gynécologie</option>
                  <option>Dermatologie</option>
                  <option>Médecine générale</option>
                </optgroup>
                <optgroup label="🏥 Centres médicaux">
                  <option>Centre médical</option>
                  <option>Clinique</option>
                  <option>Hôpital</option>
                </optgroup>
                <optgroup label="💊 Pharmacies">
                  <option>Pharmacie</option>
                </optgroup>
                <optgroup label="🔬 Laboratoires">
                  <option>Laboratoire</option>
                  <option>Analyses médicales</option>
                </optgroup>
              </select>
              <select
                className="input"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="">Langue</option>
                <option value="FR">Français</option>
                <option value="EN">English</option>
              </select>
              <select
                className="input"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >
                <option value={0}>Note minimale</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
                <option value={4.5}>4.5+</option>
              </select>
              <select
                className="input"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>
          </div>

          <ResultsList items={allItems} isLoading={isLoading} />
        </div>

        {/* Colonne droite : Carte */}
        <div className="sticky top-20 space-y-4">
          <MapWithMarkers
            center={coords ? [coords.lat, coords.lng] : [5.3456, -4.0237]}
            items={items}
            itemsWithoutCoords={itemsWithoutCoords}
            userPosition={coords}
            searchQuery={q}
            onItemsUpdate={handleItemsUpdate}
            onSearchRequest={handleSearchFunctionUpdate}
            onLoadingStateUpdate={handleLoadingStateUpdate}
            onSelect={(it) => {
              const el = document.getElementById(`card-${it.id}`);
              el?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          />

          {/* Légende des marqueurs */}
          <div className="card">
            <h3 className="font-semibold text-sm mb-3">
              Légende de la carte 🌍
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-white text-[10px]">
                  📍
                </div>
                <span>Votre position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center text-white text-[10px]">
                  👨‍⚕️
                </div>
                <span>Médecins</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center text-white text-[10px]">
                  🏥
                </div>
                <span>Hôpitaux/Cliniques</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded flex items-center justify-center text-white text-[10px]">
                  💊
                </div>
                <span>Pharmacies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded flex items-center justify-center text-white text-[10px]">
                  🔬
                </div>
                <span>Laboratoires</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-500 rounded flex items-center justify-center text-white text-[10px]">
                  🦷
                </div>
                <span>Dentistes</span>
              </div>
            </div>
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
              <strong>🌍 Source temps réel:</strong> OpenStreetMap
              <br />
              Les données sont mises à jour automatiquement depuis la base
              mondiale d'OpenStreetMap.
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Cliquez sur un marqueur pour voir les détails
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsList({ items, loading }) {
  if (loading) {
    return (
      <div className="card grid place-items-center py-16 text-sm text-slate-500">
        Chargement des résultats…
      </div>
    );
  }
  if (!items.length) {
    return (
      <div className="card">
        <div className="text-sm text-slate-500">
          Aucun résultat. Essayez d'élargir le rayon ou de retirer un filtre.
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <ResultCard key={it.id} item={it} />
      ))}
    </div>
  );
}

function ResultCard({ item }) {
  const favorites = useFavoritesStore((s) => s.favorites);
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFav = favorites.has(item.id);
  return (
    <div id={`card-${item.id}`} className="card">
      <div className="flex gap-3">
        <div className="h-16 w-16 rounded-xl bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold">{item.name}</div>
            <button
              onClick={() => toggle(item.id)}
              className="btn-ghost"
              aria-label="Favori"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFav ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </button>
          </div>
          <div className="text-sm text-slate-500">
            {item.specialty} • {item.languages?.join(", ")}
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4" /> {item.rating}
            </span>
            <span>À ~{item.distance_km ?? "-"} km</span>
            <span>Prochain créneau : {item.nextSlot}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn-secondary">Détails</button>
            <button className="btn-primary">Réserver</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorCard({ doctor, userLocation }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Extraction des vraies données depuis l'API avec fallbacks améliorés
  const doctorName = doctor?.name || doctor?.profile?.name || "Médecin";
  const specialty =
    doctor?.profile?.specialty ||
    doctor?.specialty ||
    doctor?.profile?.primary_specialty ||
    "Médecine générale";
  const rating = doctor?.profile?.rating || doctor?.rating || 0;
  const fee = doctor?.profile?.fees || doctor?.fees || null;
  const city = doctor?.location?.city || doctor?.city || "";
  const bio = doctor?.profile?.bio || doctor?.bio || "";
  const photo = doctor?.photo || doctor?.profile?.photo;
  const doctorLat = doctor?.location?.latitude || doctor?.lat;
  const doctorLng = doctor?.location?.longitude || doctor?.lng;
  const memberSince = doctor?.member_since || doctor?.created_at;

  // Hook pour récupérer les disponibilités du médecin
  const {
    data: availabilityData,
    isLoading: availabilityLoading,
    error: availabilityError,
  } = useDoctorAvailabilities(doctor.id);

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

  // Fonctions pour gérer les clics avec vérification d'authentification
  const handleProfileClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate(`/login?redirect=/doctor/${doctor.id}`);
      return;
    }
  };

  const handleBookingClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate(`/login?redirect=/booking/${doctor.id}`);
      return;
    }
    if (!nextSlot) {
      e.preventDefault();
    }
  };

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
        color: "text-slate-600 dark:text-slate-400",
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

  // Fonction pour trouver le prochain créneau disponible
  const getNextAvailableSlot = (availabilityData) => {
    if (!availabilityData?.slots) return null;

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const currentTime = now.getHours() * 100 + now.getMinutes(); // Format HHMM

    const dates = Object.keys(availabilityData.slots).sort();

    for (const date of dates) {
      const slots = availabilityData.slots[date];
      if (!slots || slots.length === 0) continue;

      // Si c'est aujourd'hui, filtrer les slots passés
      let availableSlots = slots;
      if (date === today) {
        availableSlots = slots.filter((slot) => {
          const [hours, minutes] = slot.split(":").map(Number);
          const slotTime = hours * 100 + minutes;
          return slotTime > currentTime;
        });
      }

      if (availableSlots.length > 0) {
        const nextSlotTime = availableSlots[0];
        return {
          date,
          time: nextSlotTime,
          formatted: `${nextSlotTime}`,
        };
      }
    }

    return null;
  };

  // Calculer le prochain slot disponible
  const nextSlot = getNextAvailableSlot(availabilityData);

  return (
    <motion.div
      className="card group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer w-full max-w-sm mx-auto sm:max-w-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.random() * 0.2 }}
      whileHover={{ y: -4 }}
    >
      {/* Photo de profil - Optimisée pour un rendu parfait */}
      <div className="aspect-square bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl overflow-hidden relative shadow-sm group">
        {/* État de chargement amélioré */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 animate-pulse">
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-full mx-auto mb-2 animate-pulse"></div>
            <div className="w-16 h-3 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Image principale avec optimisation améliorée */}
        <img
          src={photoUrl}
          alt={`Photo de profil de ${doctorName}`}
          className="w-full h-full object-cover object-center transition-all duration-300 ease-out group-hover:scale-105 opacity-0 animate-in fade-in-0"
          loading="lazy"
          decoding="async"
          fetchPriority="high"
          onLoad={(e) => {
            // Masquer le loader et animer l'apparition
            e.target.classList.remove("opacity-0");
            e.target.classList.add("opacity-100");
            const loader =
              e.target.parentElement.querySelector(".animate-pulse");
            if (loader) loader.style.display = "none";
          }}
          onError={(e) => {
            // Masquer l'image et afficher le fallback avec animation
            e.target.style.display = "none";
            const loader =
              e.target.parentElement.querySelector(".animate-pulse");
            if (loader) loader.style.display = "none";
            const fallback =
              e.target.parentElement.querySelector(".photo-fallback");
            if (fallback) {
              fallback.style.display = "flex";
              fallback.classList.add("animate-in", "fade-in-0", "duration-300");
            }
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
      {/* Informations avec animations d'entrée */}
      <div className="mt-3 space-y-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-100">
        <div className="font-medium text-slate-900 dark:text-white leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200">
          {doctorName}
        </div>
        <div
          className={`text-sm font-medium flex items-center gap-1 transition-all duration-200 group-hover:scale-105 ${correctedSpecialtyInfo.color}`}
        >
          <correctedSpecialtyInfo.icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{correctedSpecialty}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 animate-in fade-in-0 slide-in-from-bottom-1 duration-300 delay-200">
          {city ? (
            <div className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200">
              <MapPin className="h-3 w-3" />
              <span>{city}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-slate-400">
              <MapPin className="h-3 w-3" />
              <span>Localisation non précisée</span>
            </div>
          )}
          {distanceText && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {distanceText}
              </span>
            </>
          )}
        </div>

        {/* Rating avec étoiles et animations */}
        {hasRating && (
          <div className="flex items-center gap-1 mt-2 animate-in fade-in-0 slide-in-from-left-2 duration-300 delay-300">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {renderStars(rating)}
            </span>
            <span className="text-xs text-slate-500">
              ({rating.toFixed(1)})
            </span>
          </div>
        )}

        {/* Biographie courte avec animation */}
        {shortBio && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 animate-in fade-in-0 slide-in-from-bottom-1 duration-300 delay-400 leading-relaxed">
            {correctedBio.length > 80
              ? correctedBio.substring(0, 80) + "..."
              : correctedBio}
          </p>
        )}

        {/* Prix et disponibilité avec animation */}
        <div className="text-sm text-slate-500 mt-3 animate-in fade-in-0 slide-in-from-bottom-1 duration-300 delay-500">
          {fee ? (
            <span className="font-medium text-green-600 dark:text-green-400 transition-colors duration-200 hover:scale-105 inline-block">
              {fee.toLocaleString()} FCFA
            </span>
          ) : (
            <span className="text-slate-400 italic">Prix sur demande</span>
          )}
          <span className="mx-2 text-slate-300 dark:text-slate-600">•</span>
          {availabilityLoading ? (
            <span className="text-slate-400 animate-pulse inline-flex items-center gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </span>
          ) : availabilityError ? (
            <span className="text-slate-400 italic">Sur RDV</span>
          ) : nextSlot ? (
            <span className="font-medium text-green-600 dark:text-green-400 transition-colors duration-200 hover:scale-105 inline-block">
              {nextSlot.formatted}
            </span>
          ) : (
            <span className="text-slate-400 italic">Sur RDV</span>
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-2 sm:gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-600">
        <Link
          className="btn-secondary flex-1 text-sm sm:text-base py-2 px-3 sm:px-4 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 hover:bg-slate-100 dark:hover:bg-slate-700 group"
          to={`/doctor/${doctor.id}`}
          onClick={handleProfileClick}
          title="Voir le profil complet du médecin"
          aria-label={`Voir les détails de ${doctorName}`}
        >
          <Eye className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
          Voir profil
        </Link>
        <Link
          className={`flex-1 text-sm sm:text-base py-2 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 group ${
            nextSlot
              ? "btn-primary hover:bg-cyan-600 dark:hover:bg-cyan-500"
              : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
          }`}
          to={nextSlot ? `/booking/${doctor.id}` : "#"}
          onClick={handleBookingClick}
          title={
            nextSlot
              ? `Réserver un rendez-vous - Prochain créneau: ${nextSlot.formatted}`
              : "Aucun créneau disponible actuellement"
          }
          aria-label={
            nextSlot
              ? `Réserver un rendez-vous avec ${doctorName} - Disponible ${nextSlot.formatted}`
              : `Aucun créneau disponible pour ${doctorName}`
          }
        >
          <Calendar className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
          {nextSlot ? "Réserver RDV" : "Indisponible"}
        </Link>
      </div>
    </motion.div>
  );
}
