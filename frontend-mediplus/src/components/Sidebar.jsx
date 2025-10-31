import { NavLink } from "react-router-dom";
import { useUIStore } from "../store/uiStore.js";
import { Fragment } from "react";
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    FileText,
    Video,
    UserCog,
    Settings,
    CreditCard,
    Hospital,
    Shield,
    LineChart,
    Bot,
    Pill,
    Search,
    Home,
} from "lucide-react";

const baseLink =
    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800";
const active =
    "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200 shadow-sm";

export default function Sidebar({ section = "patient", className = "" }) {
    const { sidebarOpen, toggleSidebar } = useUIStore();
    const groups = getGroupsBySection(section);

    return (
        <aside
            className={`transition-all duration-300 border-r border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm ${sidebarOpen ? "w-64" : "w-20"
                } ${className}`}
        >
            <div className="sticky top-0 p-3 flex flex-col h-screen">
                {/* === Bouton d'ouverture / réduction === */}
                <button
                    onClick={toggleSidebar}
                    className="mb-4 w-full rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                    {sidebarOpen ? "⬅️ Réduire" : "➡️"}
                </button>

                {/* === Navigation === */}
                <nav className="space-y-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                    {groups.map((g) => (
                        <Fragment key={g.title}>
                            {sidebarOpen && (
                                <div className="px-2 text-xs font-semibold uppercase text-slate-400 tracking-wide">
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
                                        <it.icon className="h-4 w-4 shrink-0" />
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

function getGroupsBySection(section) {
    if (section === "pro") {
        return [
            {
                title: "Pratique médicale",
                items: [
                    { to: "/pro/dashboard", label: "Dashboard", icon: LayoutDashboard },
                    { to: "/pro/calendar", label: "Calendrier", icon: CalendarDays },
                    { to: "/pro/patients", label: "Mes patients", icon: Users },
                    { to: "/pro/prescriptions", label: "Prescriptions", icon: Pill },
                    {
                        to: "/pro/prescriptions/editor",
                        label: "Nouvelle ordonnance",
                        icon: FileText,
                    },
                    { to: "/pro/teleconsult", label: "Téléconsultation", icon: Video },
                ],
            },
            {
                title: "Mon compte",
                items: [
                    { to: "/pro/profile", label: "Profil", icon: UserCog },
                    { to: "/pro/settings", label: "Paramètres", icon: Settings },
                    { to: "/pro/billing", label: "Revenus", icon: CreditCard },
                ],
            },
        ];
    }

    if (section === "admin") {
        return [
            {
                title: "Pilotage",
                items: [
                    { to: "/admin/dashboard", label: "Dashboard", icon: LineChart },
                    { to: "/admin/users", label: "Utilisateurs", icon: Users },
                    { to: "/admin/catalog", label: "Catalogue santé", icon: Hospital },
                    { to: "/admin/monetization", label: "Monétisation", icon: CreditCard },
                    { to: "/admin/reports", label: "Rapports", icon: FileText },
                    { to: "/admin/moderation", label: "Modération", icon: Shield },
                    { to: "/admin/settings", label: "Paramètres", icon: Settings },
                ],
            },
        ];
    }

    // === Section patient par défaut ===
    return [
        {
            title: "Espace patient",
            items: [
                { to: "/patient/dashboard", label: "Tableau de bord", icon: Home },
                { to: "/search", label: "Trouver un pro", icon: Search },
                { to: "/patient/prescriptions", label: "Ordonnances", icon: Pill },
                { to: "/triage", label: "Triage IA", icon: Bot },
            ],
        },
    ];
}
