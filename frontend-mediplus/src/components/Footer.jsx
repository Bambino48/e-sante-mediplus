export default function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div>
                    <div className="text-lg font-bold text-cyan-600">MediPlus</div>
                    <p className="text-slate-500 mt-2 leading-relaxed">
                        Plateforme e-Santé intelligente : RDV, téléconsultation,
                        prescriptions et plus.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Patients</h3>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                        <li><a href="/search" className="hover:underline">Trouver un médecin</a></li>
                        <li><a href="/triage" className="hover:underline">Triage IA</a></li>
                        <li><a href="/patient/prescriptions" className="hover:underline">Mes ordonnances</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Professionnels</h3>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                        <li><a href="/pro/dashboard" className="hover:underline">Tableau de bord</a></li>
                        <li><a href="/pro/billing" className="hover:underline">Revenus</a></li>
                        <li><a href="/pro/prescriptions" className="hover:underline">Prescriptions</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Légal</h3>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                        <li><a href="#" className="hover:underline">CGU & Confidentialité</a></li>
                        <li><a href="#" className="hover:underline">Sécurité & conformité</a></li>
                        <li><a href="#" className="hover:underline">Contact</a></li>
                    </ul>
                </div>
            </div>

            <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700">
                © {new Date().getFullYear()} MediPlus — Tous droits réservés.
            </div>
        </footer>
    );
}
