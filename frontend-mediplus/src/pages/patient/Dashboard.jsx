/* eslint-disable no-unused-vars */
// src/pages/patient/Dashboard.jsx
import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  Clock,
  Heart,
  Stethoscope,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { getDoctorsList } from "../../api/doctors.js";
import DoctorCarousel from "../../components/DoctorCarousel";
import PatientMedicalProfile from "../../components/PatientMedicalProfile";
import {
  useNextAppointment,
  useTodayMedications,
  useUnreadNotifications,
} from "../../hooks/useDashboard.js";

// Carte docteur (copiée depuis Home.jsx)
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
            <svg
              className="h-8 w-8 text-cyan-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11a7 7 0 11-14 0 7 7 0 0114 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19v2m0 0h-2m2 0h2"
              />
            </svg>
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
        <a className="btn-secondary flex-1" href={`/doctor/${doctor.id}`}>
          Détails
        </a>
        <a className="btn-primary flex-1" href={`/booking/${doctor.id}`}>
          Réserver
        </a>
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  // État local pour gérer les docteurs
  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [errorDoctors, setErrorDoctors] = useState(null);

  // Liste des docteurs pour le carrousel (top 12, triés par note)
  const navigate = useNavigate();

  // Fonction pour charger les docteurs
  const fetchDoctors = async () => {
    try {
      setIsLoadingDoctors(true);
      setErrorDoctors(null);

      console.log("🔄 Chargement des docteurs...");
      const response = await getDoctorsList({
        per_page: 12,
        has_profile: true,
        sort_by: "rating",
        sort_order: "desc",
      });

      // La structure est : response.data.doctors (et non response.data.data.doctors)
      const doctorsArray = response.data?.doctors || [];
      setDoctors(doctorsArray);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des docteurs:", err);
      console.error("� Détails de l'erreur:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setErrorDoctors(err);
      // Fallback vers une liste vide
      setDoctors([]);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  // Récupération des docteurs au chargement du composant
  useEffect(() => {
    fetchDoctors();
  }, []);

  // ✅ Récupération des données en temps réel
  const { data: nextAppointmentData, isLoading: loadingAppointment } =
    useNextAppointment();
  const { data: medicationsData, isLoading: loadingMedications } =
    useTodayMedications();
  const { data: notificationsData, isLoading: loadingNotifications } =
    useUnreadNotifications();

  // ✅ Gestionnaires de clics intelligents
  const handleAppointmentsClick = (e) => {
    if (!nextAppointmentData?.appointment) {
      e.preventDefault();
      toast("Vous n'avez aucun rendez-vous prévu pour le moment", {
        icon: "📅",
        duration: 3000,
      });
    } else {
      navigate("/booking");
    }
  };

  const handlePrescriptionsClick = (e) => {
    if (!medicationsData?.items || medicationsData.items.length === 0) {
      e.preventDefault();
      toast("Vous n'avez aucun médicament à prendre aujourd'hui", {
        icon: "💊",
        duration: 3000,
      });
    } else {
      navigate("/patient/prescriptions");
    }
  };

  const handleNotificationsClick = (e) => {
    if (!notificationsData?.count || notificationsData.count === 0) {
      e.preventDefault();
      toast("Vous n'avez aucune nouvelle notification", {
        icon: "🔔",
        duration: 3000,
      });
    } else {
      navigate("/notifications");
    }
  };

  const shortcuts = [
    {
      title: "Téléconsultation",
      icon: <Video className="h-5 w-5 text-cyan-500" />,
      link: "/teleconsult",
      color: "from-blue-500 to-cyan-500",
      description: "Consultez un médecin en ligne en direct.",
    },
    {
      title: "Triage IA",
      icon: <Stethoscope className="h-5 w-5 text-teal-500" />,
      link: "/triage",
      color: "from-emerald-500 to-teal-500",
      description: "Analysez vos symptômes via notre assistant IA.",
    },
    {
      title: "Mes ordonnances",
      icon: <ClipboardList className="h-5 w-5 text-teal-500" />,
      link: "/patient/prescriptions",
      color: "from-indigo-500 to-cyan-500",
      description: "Accédez à vos prescriptions et traitements.",
    },
    {
      title: "Mes rendez-vous",
      icon: <CalendarDays className="h-5 w-5 text-cyan-500" />,
      link: "/booking",
      color: "from-cyan-500 to-blue-500",
      description: "Gérez vos rendez-vous médicaux.",
    },
    {
      title: "Mon profil médical",
      icon: <Heart className="h-5 w-5 text-red-500" />,
      link: "/patient/dashboard", // Reste sur le dashboard
      color: "from-red-500 to-pink-500",
      description:
        "Gérez vos informations médicales et votre dossier de santé.",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
        Bienvenue sur votre espace patient 👋
      </h1>

      {/* === Statistiques principales === */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* 📅 Prochain rendez-vous */}
        <div className="card bg-white dark:bg-slate-900">
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Prochain rendez-vous
          </div>
          {loadingAppointment ? (
            <div className="mt-3 flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4 animate-spin" />
              <span className="text-sm">Chargement...</span>
            </div>
          ) : nextAppointmentData?.appointment ? (
            <>
              <div className="mt-1 font-medium">
                {new Date(
                  nextAppointmentData.appointment.scheduled_at
                ).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                •{" "}
                {new Date(
                  nextAppointmentData.appointment.scheduled_at
                ).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {nextAppointmentData.appointment.doctor_name ||
                  `Dr ${nextAppointmentData.appointment.doctor_id}`}
              </div>
            </>
          ) : (
            <div className="mt-2 flex items-start gap-2 text-slate-400">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="text-sm">
                Aucun rendez-vous prévu pour le moment
              </span>
            </div>
          )}
          <button
            onClick={handleAppointmentsClick}
            className="btn-secondary mt-3 w-full"
          >
            Voir mes rendez-vous
          </button>
        </div>

        {/* 💊 Médicaments du jour */}
        <div className="card bg-white dark:bg-slate-900">
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Médicaments du jour
          </div>
          {loadingMedications ? (
            <div className="mt-3 flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4 animate-spin" />
              <span className="text-sm">Chargement...</span>
            </div>
          ) : medicationsData?.items && medicationsData.items.length > 0 ? (
            <ul className="mt-2 text-sm space-y-1">
              {medicationsData.items.map((med, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-1">•</span>
                  <span>
                    {med.name} {med.dosage}
                    {med.times && med.times.length > 0 && (
                      <span className="text-slate-500 ml-1">
                        — {med.times.join(", ")}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2 flex items-start gap-2 text-slate-400">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="text-sm">
                Aucun médicament à prendre aujourd'hui
              </span>
            </div>
          )}
          <button
            onClick={handlePrescriptionsClick}
            className="btn-secondary mt-3 w-full"
          >
            Voir mes ordonnances
          </button>
        </div>

        {/* 🔔 Notifications */}
        <div className="card bg-white dark:bg-slate-900">
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Notifications
          </div>
          {loadingNotifications ? (
            <div className="mt-3 flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4 animate-spin" />
              <span className="text-sm">Chargement...</span>
            </div>
          ) : notificationsData?.count > 0 ? (
            <div className="mt-2 text-sm">
              <span className="font-semibold text-cyan-600">
                {notificationsData.count}
              </span>{" "}
              {notificationsData.count === 1
                ? "nouveau message non lu"
                : "nouveaux messages non lus"}
            </div>
          ) : (
            <div className="mt-2 text-sm text-slate-400">
              Aucune nouvelle notification
            </div>
          )}
          <button
            onClick={handleNotificationsClick}
            className="btn-secondary mt-3 w-full"
          >
            Ouvrir
          </button>
        </div>
      </div>

      {/* === Carrousel des docteurs === */}
      <div className="mt-10">
        {isLoadingDoctors ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-slate-500">
              <Clock className="h-5 w-5 animate-spin" />
              <span>Chargement des médecins...</span>
            </div>
          </div>
        ) : errorDoctors ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">
              Erreur lors du chargement des médecins
            </p>
            <button
              onClick={fetchDoctors}
              className="btn-secondary"
              disabled={isLoadingDoctors}
            >
              {isLoadingDoctors ? "Chargement..." : "Réessayer"}
            </button>
          </div>
        ) : doctors && doctors.length > 0 ? (
          <DoctorCarousel
            doctors={doctors}
            title="Nos médecins recommandés"
            renderCard={(doctor) => <DoctorCard doctor={doctor} />}
          />
        ) : (
          <div className="text-center py-8">
            <div className="text-slate-500">
              <Stethoscope className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>Aucun médecin disponible pour le moment</p>
              <p className="text-sm text-slate-400 mt-1">
                Réessayez plus tard ou contactez le support
              </p>
            </div>
          </div>
        )}
      </div>

      {/* === Profil Médical === */}
      <div className="mt-10">
        <PatientMedicalProfile />
      </div>

      {/* === Raccourcis rapides === */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
          Actions rapides
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shortcuts.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className={`card border-t-4 bg-white dark:bg-slate-900 border-gradient-to-r ${item.color}`}
            >
              <div className="flex items-start gap-3">
                <div className="p-3 bg-cyan-50 dark:bg-slate-800 rounded-xl">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                  <Link
                    to={item.link}
                    className="text-cyan-600 text-sm font-medium hover:underline mt-2 inline-block"
                  >
                    Ouvrir →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
