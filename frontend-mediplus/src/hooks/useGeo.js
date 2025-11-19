import { useCallback, useEffect, useRef, useState } from "react";

export function useGeo() {
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false); // Éviter les tentatives multiples
  const autoDetectionDone = useRef(false); // Référence pour éviter la redétection

  const detect = useCallback(() => {
    if (loading || hasAttempted) {
      return;
    }

    if (!("geolocation" in navigator)) {
      setError("Géolocalisation non supportée");
      setHasAttempted(true);
      return;
    }

    setLoading(true);
    setHasAttempted(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Validation des coordonnées : vérifier si elles sont plausibles pour la Côte d'Ivoire
        // La Côte d'Ivoire est entre 4°N-11°N et 2°W-9°W (lng: -9 à -2)
        // Éviter les coordonnées dans l'océan Atlantique (lng > -2 ou lng < -9)
        const isValidLocation = lat >= 4 && lat <= 11 && lng >= -9 && lng <= -2;

        if (isValidLocation) {
          setCoords({ lat, lng });
        } else {
          console.warn(
            `⚠️ Coordonnées invalides détectées (${lat}, ${lng}), utilisation de la position par défaut`
          );
          setCoords(null); // Utiliser le fallback
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Impossible d'obtenir la position");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [loading, hasAttempted]);

  useEffect(() => {
    // Auto-détection au chargement - seulement une fois
    if (!autoDetectionDone.current && !hasAttempted && !coords && !loading) {
      autoDetectionDone.current = true;
      detect();
    }
  }, [detect, hasAttempted, coords, loading]);

  return { coords, setCoords, loading, error, detect };
}
