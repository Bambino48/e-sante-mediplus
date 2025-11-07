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
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import PatientMedicalProfile from "../../components/PatientMedicalProfile";
import {
  useNextAppointment,
  useTodayMedications,
  useUnreadNotifications,
} from "../../hooks/useDashboard.js";

export default function PatientDashboard() {
  const navigate = useNavigate();

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
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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

      {/* === Profil Médical === */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
          Mon profil médical
        </h2>
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
