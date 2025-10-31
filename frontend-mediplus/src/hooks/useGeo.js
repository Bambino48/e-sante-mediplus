import { useEffect, useState, useCallback } from "react";

export function useGeo() {
    const [coords, setCoords] = useState(null); // { lat, lng }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const detect = useCallback(() => {
        if (!("geolocation" in navigator)) {
            setError("Géolocalisation non supportée");
            return;
        }
        setLoading(true);
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
    }, []);
    useEffect(() => {
        // detect(); // activer l'auto-détection si souhaité
    }, [detect]);


    return { coords, setCoords, loading, error, detect };
}