/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FileChartColumn,
  Hospital,
  Pill,
  Settings,
  Shield,
  Store,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import { listPharmacies, listUsers } from "../../api/admin.js";
import AdminCard from "../../components/AdminCard.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import { useUIStore } from "../../store/uiStore.js";

export default function AdminDashboard() {
  const { sidebarOpen, setSidebar } = useUIStore();

  // S'assurer que la sidebar est ouverte par défaut dans le dashboard admin
  useEffect(() => {
    if (!sidebarOpen) {
      setSidebar(true);
    }
  }, [sidebarOpen, setSidebar]);

  const { data: users } = useQuery({ queryKey: ["users"], queryFn: listUsers });
  const { data: pharmacies } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: listPharmacies,
  });

  const totalDoctors =
    users?.items?.filter((u) => u.role === "doctor").length || 0;
  const totalPatients =
    users?.items?.filter((u) => u.role === "patient").length || 0;

  const shortcuts = [
    {
      title: "Gestion des utilisateurs",
      icon: <Users className="h-5 w-5 text-cyan-500" />,
      link: "/admin/users",
      color: "from-cyan-500 to-blue-500",
      description: "Gérez les comptes médecins, patients et administrateurs.",
    },
    {
      title: "Catalogue santé",
      icon: <Store className="h-5 w-5 text-emerald-500" />,
      link: "/admin/catalog",
      color: "from-emerald-500 to-teal-500",
      description:
        "Consultez et modifiez les structures médicales partenaires.",
    },
    {
      title: "Monétisation",
      icon: <Wallet className="h-5 w-5 text-amber-500" />,
      link: "/admin/monetization",
      color: "from-amber-500 to-orange-500",
      description: "Suivez les paiements et les revenus de la plateforme.",
    },
    {
      title: "Rapports",
      icon: <FileChartColumn className="h-5 w-5 text-indigo-500" />,
      link: "/admin/reports",
      color: "from-indigo-500 to-purple-500",
      description: "Analysez les statistiques globales de MediPlus.",
    },
    {
      title: "Modération",
      icon: <Shield className="h-5 w-5 text-rose-500" />,
      link: "/admin/moderation",
      color: "from-rose-500 to-pink-500",
      description: "Surveillez et modérez les activités suspectes.",
    },
    {
      title: "Paramètres",
      icon: <Settings className="h-5 w-5 text-slate-500" />,
      link: "/admin/settings",
      color: "from-slate-500 to-slate-800",
      description: "Personnalisez les préférences du tableau de bord.",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* === Sidebar === */}
      <Sidebar
        section="admin"
        className="shrink-0 border-r border-slate-200 dark:border-slate-800"
      />

      {/* === Contenu principal === */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">
          Tableau de bord administrateur 🧭
        </h1>

        {/* === Statistiques principales === */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminCard
            title="Médecins inscrits"
            value={totalDoctors}
            icon={<UserCog className="h-5 w-5 text-cyan-500" />}
          />
          <AdminCard
            title="Patients inscrits"
            value={totalPatients}
            icon={<Users className="h-5 w-5 text-blue-500" />}
          />
          <AdminCard
            title="Pharmacies"
            value={pharmacies?.items?.length || 0}
            icon={<Pill className="h-5 w-5 text-emerald-500" />}
          />
          <AdminCard
            title="Centres santé"
            value={3}
            icon={<Hospital className="h-5 w-5 text-rose-500" />}
          />
        </div>

        {/* === Raccourcis rapides === */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">
            Gestion & Administration
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
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                    <a
                      href={item.link}
                      className="text-cyan-600 text-sm font-medium hover:underline mt-2 inline-block"
                    >
                      Ouvrir →
                    </a>
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
