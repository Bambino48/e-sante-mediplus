import { Heart, MapPin, Search as SearchIcon, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import MapWithMarkers from "../../components/MapWithMarkers.jsx";

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

  // Initialiser les valeurs depuis les paramètres URL
  useEffect(() => {
    // Lire les paramètres d'URL pour pré-remplir la recherche
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get("q");
    const locationParam = urlParams.get("location");
    const latParam = urlParams.get("lat");
    const lngParam = urlParams.get("lng");

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

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
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
    </main>
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
