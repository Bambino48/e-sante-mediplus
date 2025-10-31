/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    CalendarDays,
    Pill,
    Bell,
    Search,
    Video,
    Stethoscope,
    User,
    ClipboardList,
} from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx"; // ✅ Import de la Sidebar

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
            title: "Mon profil",
            icon: <User className="h-5 w-5 text-cyan-500" />,
            link: "/patient/profile",
            color: "from-slate-500 to-slate-700",
            description: "Consultez et modifiez vos informations personnelles.",
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* === Sidebar à gauche === */}
            <Sidebar section="patient" className="border-r border-slate-200 dark:border-slate-800" />

            {/* === Contenu principal === */}
            <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
                    Bienvenue sur votre espace patient 👋
                </h1>

                {/* === Statistiques principales === */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="card">
                        <div className="text-sm text-slate-500">Prochain rendez-vous</div>
                        <div className="mt-1 font-medium">Demain • 10h30 avec Dr Kouassi</div>
                        <Link className="btn-secondary mt-3 w-full" to="/booking">
                            Voir mes rendez-vous
                        </Link>
                    </div>

                    <div className="card">
                        <div className="text-sm text-slate-500">Médicaments du jour</div>
                        <ul className="mt-2 text-sm list-disc ml-5">
                            <li>Paracétamol 500mg — 08:00</li>
                            <li>Atorvastatine 20mg — 21:00</li>
                        </ul>
                        <Link className="btn-secondary mt-3 w-full" to="/patient/prescriptions">
                            Voir mes ordonnances
                        </Link>
                    </div>

                    <div className="card">
                        <div className="text-sm text-slate-500">Notifications</div>
                        <div className="mt-2 text-sm">2 nouveaux messages non lus</div>
                        <Link className="btn-secondary mt-3 w-full" to="/notifications">
                            Ouvrir
                        </Link>
                    </div>
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
            </main>
        </div>
    );
}
