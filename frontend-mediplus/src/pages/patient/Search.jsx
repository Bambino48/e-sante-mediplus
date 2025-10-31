import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, MapPin, Star, Heart, Stethoscope, Languages } from "lucide-react";
import { searchProviders } from "../../api/search.js";
import { useGeo } from "../../hooks/useGeo.js";
import { useFavoritesStore } from "../../store/favoritesStore.js";
import MapWithMarkers from "../../components/MapWithMarkers.jsx";

export default function Search() {
    const { coords, detect, setCoords } = useGeo();
    const [q, setQ] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [language, setLanguage] = useState("");
    const [minRating, setMinRating] = useState(0);
    const [radius, setRadius] = useState(10);

    const params = useMemo(
        () => ({ q, specialty, language, minRating, radius_km: radius, lat: coords?.lat, lng: coords?.lng }),
        [q, specialty, language, minRating, radius, coords]
    );

    const { data, isLoading } = useQuery({
        queryKey: ["search", params],
        queryFn: () => searchProviders(params),
        keepPreviousData: true,
    });

    const items = data?.items ?? [];

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid lg:grid-cols-2 gap-6 items-start">
                {/* Colonne gauche : Filtres + Liste */}
                <div className="space-y-4">
                    <div className="card">
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                                <SearchIcon className="h-5 w-5 text-slate-400" />
                                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nom, symptôme, spécialité" className="bg-transparent outline-none w-full text-sm" />
                            </div>
                            <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                                <MapPin className="h-5 w-5 text-slate-400" />
                                <input onChange={(e) => setCoords((c) => ({ ...(c || {}), manual: e.target.value }))} placeholder="Localisation (ex: Abobo)" className="bg-transparent outline-none w-full text-sm" />
                                <button onClick={detect} className="btn-ghost text-xs">Me localiser</button>
                            </div>
                        </div>
                        <div className="mt-3 grid sm:grid-cols-4 gap-3">
                            <select className="input" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                                <option value="">Spécialité</option>
                                <option>Cardiologie</option>
                                <option>Pédiatrie</option>
                                <option>Gynécologie</option>
                                <option>Centre médical</option>
                            </select>
                            <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                                <option value="">Langue</option>
                                <option value="FR">Français</option>
                                <option value="EN">English</option>
                            </select>
                            <select className="input" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                                <option value={0}>Note minimale</option>
                                <option value={3}>3+</option>
                                <option value={4}>4+</option>
                                <option value={4.5}>4.5+</option>
                            </select>
                            <select className="input" value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
                                <option value={5}>5 km</option>
                                <option value={10}>10 km</option>
                                <option value={20}>20 km</option>
                                <option value={50}>50 km</option>
                            </select>
                        </div>
                    </div>
                    <ResultsList items={items} loading={isLoading} />
                </div>

                {/* Colonne droite : Carte */}
                <div className="sticky top-20">
                    <MapWithMarkers
                        center={coords ? [coords.lat, coords.lng] : [5.3456, -4.0237]}
                        items={items}
                        onSelect={(it) => {
                            const el = document.getElementById(`card-${it.id}`);
                            el?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                    />
                </div>
            </div>
        </main>
    );
}

function ResultsList({ items, loading }) {
    if (loading) {
        return (
            <div className="card grid place-items-center py-16 text-sm text-slate-500">Chargement des résultats…</div>
        );
    }
    if (!items.length) {
        return (
            <div className="card">
                <div className="text-sm text-slate-500">Aucun résultat. Essayez d'élargir le rayon ou de retirer un filtre.</div>
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
                        <button onClick={() => toggle(item.id)} className="btn-ghost" aria-label="Favori">
                            <Heart className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                        </button>
                    </div>
                    <div className="text-sm text-slate-500">{item.specialty} • {item.languages?.join(", ")}</div>
                    <div className="mt-1 flex items-center gap-3 text-sm">
                        <span className="inline-flex items-center gap-1"><Star className="h-4 w-4" /> {item.rating}</span>
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