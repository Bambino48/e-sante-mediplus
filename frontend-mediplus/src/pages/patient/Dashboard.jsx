/* eslint-disable no-unused-vars */
// src/pages/patient/Dashboard.jsx
import { motion } from "framer-motion";
import {
  CalendarDays,
  ClipboardList,
  Heart,
  Search,
  Stethoscope,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import PatientMedicalProfile from "../../components/PatientMedicalProfile";

export default function PatientDashboard() {
  const shortcuts = [
    {
      title: "Trouver un médecin",
      icon: <Search className="h-5 w-5 text-cyan-500" />,
      link: "/search",
      color: "from-cyan-500 to-teal-500",
      description: "Réservez rapidement une consultation.",
    },
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
        <div className="card bg-white dark:bg-slate-900">
          <div className="text-sm text-slate-500">Prochain rendez-vous</div>
          <div className="mt-1 font-medium">Demain • 10h30 avec Dr Kouassi</div>
          <Link className="btn-secondary mt-3 w-full" to="/booking">
            Voir mes rendez-vous
          </Link>
        </div>

        <div className="card bg-white dark:bg-slate-900">
          <div className="text-sm text-slate-500">Médicaments du jour</div>
          <ul className="mt-2 text-sm list-disc ml-5">
            <li>Paracétamol 500mg — 08:00</li>
            <li>Atorvastatine 20mg — 21:00</li>
          </ul>
          <Link
            className="btn-secondary mt-3 w-full"
            to="/patient/prescriptions"
          >
            Voir mes ordonnances
          </Link>
        </div>

        <div className="card bg-white dark:bg-slate-900">
          <div className="text-sm text-slate-500">Notifications</div>
          <div className="mt-2 text-sm">2 nouveaux messages non lus</div>
          <Link className="btn-secondary mt-3 w-full" to="/notifications">
            Ouvrir
          </Link>
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
