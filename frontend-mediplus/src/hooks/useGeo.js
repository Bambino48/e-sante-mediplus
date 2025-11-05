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
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
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
