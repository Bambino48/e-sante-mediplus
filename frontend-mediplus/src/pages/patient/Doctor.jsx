// src/pages/patient/Doctor.jsx
import { useState } from "react";
import {
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStar,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/Card.jsx";
import ProfileCard from "../../components/ProfileCard.jsx";
import { useDoctor } from "../../hooks/useDoctors.js";

// Fonction pour récupérer les détails d'un docteur depuis l'API

export default function Doctor() {
  const { id } = useParams();
  const { data, isLoading, error } = useDoctor(id);

  // Transformation des données pour correspondre au format attendu par le composant
  const doctor = data
    ? {
        id: data.id,
        name: data.name || `Dr. ${data.first_name} ${data.last_name}`,
        specialty: data.specialty || data.specialization || "Médecine générale",
        experience: data.experience_years || 5,
        address: data.address || "Adresse non disponible",
        phone: data.phone || "Téléphone non disponible",
        rating: data.rating || 4.5,
        bio: data.bio || "Professionnel de santé expérimenté.",
        fees: data.consultation_fee || 15000,
        languages: data.languages || ["Français"],
        availabilities: data.availabilities || [
          { day: "Lundi", hours: "09h - 17h" },
          { day: "Mercredi", hours: "09h - 17h" },
          { day: "Vendredi", hours: "09h - 17h" },
        ],
        reviews: data.reviews || [],
        email: data.email,
        is_available: data.is_available,
        latitude: data.latitude,
        longitude: data.longitude,
      }
    : null;

  const [showAllReviews, setShowAllReviews] = useState(false);

  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="card grid place-items-center py-20">Chargement…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="card grid place-items-center py-20 text-red-600">
          <p>Erreur lors du chargement du profil du docteur.</p>
          <p className="text-sm text-gray-500 mt-2">{error?.message}</p>
        </div>
      </main>
    );
  }

  if (!doctor) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="card grid place-items-center py-20">
          <p>Docteur non trouvé.</p>
        </div>
      </main>
    );
  }

  const d = doctor;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <ProfileCard user={d} />

      <Card>
        <CardHeader title="Informations générales" />
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-slate-600">
              <FaMapMarkerAlt className="text-cyan-600" /> {d.address}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <FaPhoneAlt className="text-cyan-600" /> {d.phone}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <FaCalendarCheck className="text-cyan-600" /> Expérience :{" "}
              {d.experience} ans
            </div>
            <div className="flex items-center gap-2 text-yellow-500">
              <FaStar /> {d.rating}/5
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">{d.bio}</p>
          <div className="mt-2 text-sm text-slate-500">
            Langues : {d.languages.join(", ")}
          </div>
          <div className="mt-2 font-medium text-cyan-700">
            Tarif consultation : {d.fees.toLocaleString()} FCFA
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Disponibilités" />
        <CardContent>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {d.availabilities.map((a, i) => (
              <li key={i} className="py-2 flex justify-between">
                <span>{a.day}</span>
                <span className="text-slate-600">{a.hours}</span>
              </li>
            ))}
          </ul>
          <Link
            to={`/booking/${d.id}`}
            className="btn-primary mt-4 w-full text-center"
          >
            Prendre rendez-vous
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Avis & retours patients" />
        <CardContent>
          {d.reviews
            .slice(0, showAllReviews ? d.reviews.length : 2)
            .map((r) => (
              <div
                key={r.id}
                className="border-b border-slate-200 dark:border-slate-800 py-2"
              >
                <div className="font-medium text-slate-700">{r.patient}</div>
                <div className="text-sm text-slate-500 mt-1">{r.comment}</div>
                <div className="text-xs text-yellow-500 mt-1">
                  {"⭐".repeat(r.rating)}{" "}
                  <span className="text-slate-400">({r.rating}/5)</span>
                </div>
              </div>
            ))}
          {d.reviews.length > 2 && (
            <button
              onClick={() => setShowAllReviews((s) => !s)}
              className="btn-ghost text-xs mt-2"
            >
              {showAllReviews ? "Réduire" : "Voir tous les avis"}
            </button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
