// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useUIStore } from "../store/uiStore.js";
import { Fragment } from "react";

const baseLink =
    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-slate-800";
const active =
    "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200";

export default function Sidebar({ section = "patient", className = "" }) {
    const { sidebarOpen, toggleSidebar } = useUIStore();
    const groups = getGroupsBySection(section);

    return (
        <aside
            className={`transition-all ${sidebarOpen ? "w-64" : "w-16"} ${className}`}
        >
            <div className="sticky top-0 p-3">
                <button
                    onClick={toggleSidebar}
                    className="mb-4 w-full rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm"
                >
                    {sidebarOpen ? "Réduire" : "Ouvrir"}
                </button>

                <nav className="space-y-4">
                    {groups.map((g) => (
                        <Fragment key={g.title}>
                            {sidebarOpen && (
                                <div className="px-1 text-xs font-medium text-slate-500">
                                    {g.title}
                                </div>
                            )}
                            <div className="mt-1 space-y-1">
                                {g.items.map((it) => (
                                    <NavLink
                                        key={it.to}
                                        to={it.to}
                                        className={({ isActive }) =>
                                            `${baseLink} ${isActive ? active : ""}`
                                        }
                                        title={it.label}
                                    >
                                        <span className="text-lg">{it.icon}</span>
                                        {sidebarOpen && <span>{it.label}</span>}
                                    </NavLink>
                                ))}
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
 * Ici, on enrichit le menu "patient" sans rien casser pour les autres rôles
 */
function getGroupsBySection(section) {
    if (section === "pro") {
        return [
            {
                title: "Pratique",
                items: [
                    { to: "/pro/dashboard", label: "Dashboard", icon: "📊" },
                    { to: "/pro/calendar", label: "Calendrier", icon: "🗓️" },
                    { to: "/pro/patients", label: "Mes patients", icon: "👥" },
                    { to: "/pro/prescriptions", label: "Prescriptions", icon: "💊" },
                    { to: "/pro/teleconsult", label: "Téléconsultation", icon: "🎥" },
                ],
            },
            {
                title: "Compte",
                items: [
                    { to: "/pro/profile", label: "Profil", icon: "🧑‍⚕️" },
                    { to: "/pro/settings", label: "Paramètres", icon: "⚙️" },
                    { to: "/pro/billing", label: "Revenus", icon: "💳" },
                ],
            },
        ];
    }

    if (section === "admin") {
        return [
            {
                title: "Pilotage",
                items: [
                    { to: "/admin/dashboard", label: "Dashboard", icon: "📈" },
                    { to: "/admin/users", label: "Utilisateurs", icon: "👥" },
                    { to: "/admin/catalog", label: "Catalogue santé", icon: "🏥" },
                    { to: "/admin/monetization", label: "Monétisation", icon: "💰" },
                    { to: "/admin/reports", label: "Rapports", icon: "📊" },
                    { to: "/admin/moderation", label: "Modération", icon: "🛡️" },
                    { to: "/admin/settings", label: "Paramètres", icon: "⚙️" },
                ],
            },
        ];
    }

    // ✅ Patient par défaut (amélioré)
    return [
        {
            title: "Patient",
            items: [
                { to: "/patient/dashboard", label: "Tableau de bord", icon: "🏠" },
                { to: "/search", label: "Trouver un pro", icon: "🔍" },
                { to: "/teleconsult", label: "Téléconsultation", icon: "🎥" },
                { to: "/triage", label: "Triage IA", icon: "🤖" },
                { to: "/booking", label: "Mes rendez-vous", icon: "📅" },
                { to: "/patient/prescriptions", label: "Ordonnances", icon: "💊" },
                { to: "/patient/profile", label: "Mon profil", icon: "👤" },
            ],
        },
    ];
}
