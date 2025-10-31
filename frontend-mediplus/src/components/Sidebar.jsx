// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useUIStore } from "../store/uiStore.js";
import { Fragment } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Home,
    Search,
    Video,
    Brain,
    CalendarDays,
    FileText,
    User,
    Users,
    Pill,
    Stethoscope,
    Settings,
    BarChart3,
    Shield,
    Hospital,
    DollarSign,
} from "lucide-react"; // ✅ Icônes modernes

const baseLink =
    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition";
const active =
    "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200";

export default function Sidebar({
    section = "patient",
    className = "",
    setActiveView, // ✅ Permet d'afficher directement un composant
    activeView,
}) {
    const { sidebarOpen, toggleSidebar } = useUIStore();
    const groups = getGroupsBySection(section);

    const handleClick = (item) => {
        // ✅ Si on veut navigation interne : setActiveView()
        if (setActiveView) {
            setActiveView(item.key);
        }
    };

    return (
        <aside
            className={`transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm ${sidebarOpen ? "w-64" : "w-16"
                } ${className}`}
        >
            <div className="sticky top-0 p-3 flex flex-col h-screen">
                {/* ✅ Bouton icône pour ouvrir/réduire */}
                <button
                    onClick={toggleSidebar}
                    className="mb-4 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 p-2"
                    title={sidebarOpen ? "Réduire" : "Ouvrir"}
                >
                    {sidebarOpen ? (
                        <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    ) : (
                        <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    )}
                </button>

                {/* ✅ Navigation */}
                <nav className="space-y-4 overflow-y-auto">
                    {groups.map((g) => (
                        <Fragment key={g.title}>
                            {sidebarOpen && (
                                <div className="px-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                    {g.title}
                                </div>
                            )}
                            <div className="mt-1 space-y-1">
                                {g.items.map((it) => {
                                    const isActive =
                                        activeView === it.key || false;
                                    return setActiveView ? (
                                        <div
                                            key={it.key}
                                            onClick={() => handleClick(it)}
                                            className={`${baseLink} ${isActive
                                                    ? active
                                                    : "text-slate-700 dark:text-slate-200"
                                                }`}
                                            title={it.label}
                                        >
                                            <span className="text-lg">{it.icon}</span>
                                            {sidebarOpen && <span>{it.label}</span>}
                                        </div>
                                    ) : (
                                        <NavLink
                                            key={it.to}
                                            to={it.to}
                                            className={({ isActive }) =>
                                                `${baseLink} ${isActive
                                                    ? active
                                                    : "text-slate-700 dark:text-slate-200"
                                                }`
                                            }
                                            title={it.label}
                                        >
                                            <span className="text-lg">{it.icon}</span>
                                            {sidebarOpen && <span>{it.label}</span>}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </Fragment>
                    ))}
                </nav>
            </div>
        </aside>
    );
}

/**
 * ✅ Liste des groupes par type d'utilisateur
 */
function getGroupsBySection(section) {
    if (section === "pro") {
        return [
            {
                title: "Pratique",
                items: [
                    { key: "dashboard", to: "/pro/dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
                    { key: "calendar", to: "/pro/calendar", label: "Calendrier", icon: <CalendarDays size={18} /> },
                    { key: "patients", to: "/pro/patients", label: "Mes patients", icon: <Users size={18} /> },
                    { key: "prescriptions", to: "/pro/prescriptions", label: "Prescriptions", icon: <FileText size={18} /> },
                    { key: "teleconsult", to: "/pro/teleconsult", label: "Téléconsultation", icon: <Video size={18} /> },
                ],
            },
            {
                title: "Compte",
                items: [
                    { key: "profile", to: "/pro/profile", label: "Profil", icon: <Stethoscope size={18} /> },
                    { key: "settings", to: "/pro/settings", label: "Paramètres", icon: <Settings size={18} /> },
                    { key: "billing", to: "/pro/billing", label: "Revenus", icon: <DollarSign size={18} /> },
                ],
            },
        ];
    }

    if (section === "admin") {
        return [
            {
                title: "Pilotage",
                items: [
                    { key: "dashboard", to: "/admin/dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
                    { key: "users", to: "/admin/users", label: "Utilisateurs", icon: <Users size={18} /> },
                    { key: "catalog", to: "/admin/catalog", label: "Catalogue santé", icon: <Hospital size={18} /> },
                    { key: "monetization", to: "/admin/monetization", label: "Monétisation", icon: <DollarSign size={18} /> },
                    { key: "reports", to: "/admin/reports", label: "Rapports", icon: <FileText size={18} /> },
                    { key: "moderation", to: "/admin/moderation", label: "Modération", icon: <Shield size={18} /> },
                    { key: "settings", to: "/admin/settings", label: "Paramètres", icon: <Settings size={18} /> },
                ],
            },
        ];
    }

    // ✅ Patient par défaut (amélioré)
    return [
        {
            title: "Patient",
            items: [
                { key: "dashboard", to: "/patient/dashboard", label: "Tableau de bord", icon: <Home size={18} /> },
                { key: "search", to: "/search", label: "Trouver un pro", icon: <Search size={18} /> },
                { key: "teleconsult", to: "/teleconsult", label: "Téléconsultation", icon: <Video size={18} /> },
                { key: "triage", to: "/triage", label: "Triage IA", icon: <Brain size={18} /> },
                { key: "booking", to: "/booking", label: "Mes rendez-vous", icon: <CalendarDays size={18} /> },
                { key: "prescriptions", to: "/patient/prescriptions", label: "Ordonnances", icon: <Pill size={18} /> },
                { key: "profile", to: "/patient/profile", label: "Mon profil", icon: <User size={18} /> },
            ],
        },
    ];
}
