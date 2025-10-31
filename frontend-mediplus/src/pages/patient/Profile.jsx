/* eslint-disable no-unused-vars */
// src/pages/patient/Profile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Icône personnalisée pour la position du patient
const userIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
});

export default function PatientProfile() {
    const { user, updateProfile } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        latitude: "",
        longitude: "",
        photo: "",
    });

    const [tracking, setTracking] = useState(false);
    const [showMap, setShowMap] = useState(false);

    // ✅ Remplit le formulaire avec les infos actuelles
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                latitude: user.latitude || "",
                longitude: user.longitude || "",
                photo: user.photo || "",
            });
        }
    }, [user]);

    // ✅ Récupération géolocalisation
    useEffect(() => {
        let watchId;
        if ("geolocation" in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setForm((prev) => ({ ...prev, latitude, longitude }));
                },
                (error) => {
                    console.warn("Erreur géolocalisation :", error.message);
                    toast.error("Impossible de récupérer la position GPS.");
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
            );
            setTracking(true);
        } else {
            toast.error("La géolocalisation n'est pas supportée par votre navigateur.");
        }
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    // ✅ Gestion du téléchargement de la photo
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm((prev) => ({ ...prev, photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // ✅ Soumission du formulaire
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(form);
            toast.success("Profil mis à jour avec succès !");
        } catch {
            toast.error("Erreur lors de la mise à jour du profil.");
        }
    };

    // ✅ Si non connecté
    if (!user) {
        return (
            <div className="text-center mt-16 text-slate-500">
                Vous devez être connecté pour voir cette page.
            </div>
        );
    }

    // ✅ Interface principale
    return (
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-100">
                Mon profil
            </h1>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* ✅ Section photo de profil */}
                <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-700">
                    <div className="relative">
                        <img
                            src={
                                form.photo ||
                                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                            }
                            alt="Profil"
                            className="h-28 w-28 rounded-full object-cover border-4 border-cyan-500 shadow-md"
                        />
                        <label
                            htmlFor="photo"
                            className="absolute bottom-0 right-0 bg-cyan-500 text-white text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-cyan-600 transition"
                        >
                            Changer
                        </label>
                        <input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Cliquez sur “Changer” pour mettre à jour votre photo
                    </p>
                </div>

                {/* ✅ Champs infos utilisateur */}
                <div className="space-y-4">
                    <input
                        className="input"
                        type="text"
                        placeholder="Nom complet"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        className="input"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        className="input"
                        type="text"
                        placeholder="Téléphone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                </div>

                {/* ✅ Position GPS (readonly) */}
                <div className="grid grid-cols-2 gap-3">
                    <input
                        className="input"
                        type="text"
                        placeholder="Latitude"
                        value={form.latitude || ""}
                        readOnly
                    />
                    <input
                        className="input"
                        type="text"
                        placeholder="Longitude"
                        value={form.longitude || ""}
                        readOnly
                    />
                </div>

                {/* ✅ Bouton Voir / Masquer carte */}
                <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    className="btn-secondary w-full mt-2"
                >
                    {showMap ? "Masquer la carte" : "Voir ma position"}
                </button>

                {/* ✅ Carte Leaflet */}
                {showMap && form.latitude && form.longitude && (
                    <div className="mt-4 rounded-lg overflow-hidden shadow border border-slate-200 dark:border-slate-800">
                        <MapContainer
                            center={[form.latitude, form.longitude]}
                            zoom={15}
                            style={{ height: "300px", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[form.latitude, form.longitude]} icon={userIcon}>
                                <Popup>Vous êtes ici 📍</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                )}

                {/* ✅ Bouton mise à jour */}
                <button type="submit" className="btn-primary w-full mt-4">
                    Mettre à jour
                </button>
            </form>
        </div>
    );
}
