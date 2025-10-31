/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar.jsx";
import {
    CalendarDays,
    DollarSign,
    FileText,
    UserCog,
    Settings,
    Video,
    Users,
    ClipboardCheck,
} from "lucide-react";

export default function ProDashboard() {
    // === Liens rapides vers les fonctionnalités ===
    const shortcuts = [
        {
            title: "Calendrier",
            icon: <CalendarDays className="h-5 w-5 text-cyan-500" />,
            link: "/pro/calendar",
            color: "from-cyan-500 to-teal-500",
            description: "Gérez vos rendez-vous et vos disponibilités.",
        },
        {
            title: "Patients",
            icon: <Users className="h-5 w-5 text-cyan-500" />,
            link: "/pro/patients",
            color: "from-blue-500 to-cyan-500",
            description: "Consultez les dossiers de vos patients.",
        },
        {
            title: "Ordonnances",
            icon: <FileText className="h-5 w-5 text-emerald-500" />,
            link: "/pro/prescriptions",
            color: "from-emerald-500 to-teal-500",
            description: "Accédez à vos prescriptions médicales.",
        },
        {
            title: "Nouvelle prescription",
            icon: <ClipboardCheck className="h-5 w-5 text-cyan-500" />,
            link: "/pro/prescriptions/editor",
            color: "from-cyan-500 to-indigo-500",
            description: "Rédigez et signez une nouvelle ordonnance.",
        },
        {
            title: "Téléconsultation",
            icon: <Video className="h-5 w-5 text-blue-500" />,
            link: "/pro/teleconsult",
            color: "from-blue-500 to-cyan-500",
            description: "Lancez une téléconsultation sécurisée.",
        },
        {
            title: "Facturation",
            icon: <DollarSign className="h-5 w-5 text-amber-500" />,
            link: "/pro/billing",
            color: "from-amber-500 to-orange-500",
            description: "Suivez vos paiements et revenus mensuels.",
        },
        {
            title: "Mon profil",
            icon: <UserCog className="h-5 w-5 text-cyan-500" />,
            link: "/pro/profile",
            color: "from-slate-500 to-slate-700",
            description: "Mettez à jour vos informations professionnelles.",
        },
        {
            title: "Paramètres",
            icon: <Settings className="h-5 w-5 text-slate-500" />,
            link: "/pro/settings",
            color: "from-slate-600 to-slate-900",
            description: "Personnalisez votre compte et vos préférences.",
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            {/* === Sidebar === */}
            <Sidebar section="pro" className="shrink-0 border-r border-slate-200 dark:border-slate-800" />

            {/* === Contenu principal === */}
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
                <h1 className="text-2xl font-semibold mb-4">Tableau de bord professionnel 🩺</h1>

                {/* === Statistiques principales === */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="card">
                        <div className="text-sm text-slate-500">RDV du jour</div>
                        <div className="mt-1 font-medium text-lg">5 rendez-vous planifiés</div>
                        <Link to="/pro/calendar" className="btn-secondary mt-3 w-full">
                            Voir le calendrier
                        </Link>
                    </div>

                    <div className="card">
                        <div className="text-sm text-slate-500">Revenus du mois</div>
                        <div className="mt-1 font-medium text-lg text-emerald-600 dark:text-emerald-400">
                            145 000 FCFA
                        </div>
                        <Link to="/pro/billing" className="btn-secondary mt-3 w-full">
                            Voir la facturation
                        </Link>
                    </div>

                    <div className="card">
                        <div className="text-sm text-slate-500">Tâches à faire</div>
                        <div className="mt-2 text-sm">1 ordonnance à signer</div>
                        <Link to="/pro/prescriptions" className="btn-secondary mt-3 w-full">
                            Voir les tâches
                        </Link>
                    </div>
                </div>

                {/* === Raccourcis rapides === */}
                <div className="mt-10">
                    <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
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
                                        <h3 className="font-semibold">{item.title}</h3>
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
