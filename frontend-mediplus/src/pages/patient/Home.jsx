/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, MapPin, Stethoscope, Video, AlertTriangle } from "lucide-react";

export default function PatientHome() {
    return (
        <main className="pt-4 pb-12">
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-5xl font-bold tracking-tight"
                            >
                                Trouvez, réservez, consultez —
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-teal-500"> en quelques clics</span>
                            </motion.h1>
                            <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-xl">
                                Plateforme e‑Santé intelligente pour patients et professionnels : RDV, téléconsultation,
                                ordonnances numériques et rappels médicaments.
                            </p>

                            {/* Search bar */}
                            <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm">
                                <div className="grid md:grid-cols-3 gap-3">
                                    <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                                        <Search className="h-5 w-5 text-slate-400" />
                                        <input placeholder="Symptômes, spécialité, nom" className="bg-transparent outline-none w-full text-sm" />
                                    </div>
                                    <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                        <input placeholder="Abobo, Treichville…" className="bg-transparent outline-none w-full text-sm" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to="/search" className="btn-primary flex-1">Rechercher</Link>
                                        {/* <Link to="/teleconsult" className="btn-ghost hidden md:inline-flex"><Video className="h-4 w-4" /> Téléconsultation</Link> */}
                                    </div>
                                </div>
                            </div>

                            {/* Quick CTAs */}
                            <div className="mt-6 grid sm:grid-cols-3 gap-3">
                                <CTA icon={<Stethoscope />} title="Prendre RDV" to="/search" />
                                <CTA icon={<Video />} title="Téléconsultation maintenant" to="/teleconsult" />
                                <CTA icon={<AlertTriangle />} title="Besoin d'urgence ?" to="/triage" variant="warning" />
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative">
                            <div className="aspect-4/3 rounded-3xl bg-linear-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/20 border border-slate-200 dark:border-slate-800 shadow-inner" />
                            <div className="absolute inset-6 rounded-3xl border border-dashed border-cyan-300/50 dark:border-cyan-700/40" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Near me cards */}
            <section className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Près de moi</h2>
                        <Link to="/search" className="text-sm text-cyan-600">Voir tout</Link>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="card">
                                <div className="h-36 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl" />
                                <div className="mt-3">
                                    <div className="font-medium">Dr Kouassi — Cardiologue</div>
                                    <div className="text-sm text-slate-500">2.3 km · Dès 10:30</div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Link className="btn-secondary flex-1" to="/doctor/1">Détails</Link>
                                    <Link className="btn-primary flex-1" to="/booking/1">Réserver</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

function CTA({ icon, title, to, variant }) {
    const base = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm";
    const styles = variant === "warning"
        ? "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800"
        : "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-100 dark:border-slate-700";
    return (
        <Link to={to} className={`${base} ${styles}`}>
            <span className="shrink-0">{icon}</span>
            <span className="font-medium">{title}</span>
        </Link>
    );
}