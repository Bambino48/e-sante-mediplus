// src/pages/admin/Settings.jsx
import { useState } from "react";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        allowNewUsers: true,
        notifyAdmins: true,
        dataRetention: 12,
    });

    const update = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

    return (
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-xl font-semibold">Paramètres de la plateforme</h1>

            <div className="card space-y-3">
                <label className="flex items-center justify-between">
                    <span>Mode maintenance</span>
                    <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => update("maintenanceMode", e.target.checked)}
                    />
                </label>

                <label className="flex items-center justify-between">
                    <span>Autoriser les nouvelles inscriptions</span>
                    <input
                        type="checkbox"
                        checked={settings.allowNewUsers}
                        onChange={(e) => update("allowNewUsers", e.target.checked)}
                    />
                </label>

                <label className="flex items-center justify-between">
                    <span>Notifier les administrateurs</span>
                    <input
                        type="checkbox"
                        checked={settings.notifyAdmins}
                        onChange={(e) => update("notifyAdmins", e.target.checked)}
                    />
                </label>

                <label className="flex items-center justify-between">
                    <span>Durée de conservation des données (mois)</span>
                    <input
                        type="number"
                        className="input w-24"
                        value={settings.dataRetention}
                        onChange={(e) => update("dataRetention", e.target.value)}
                    />
                </label>
            </div>

            <button className="btn-primary">Enregistrer</button>
        </main>
    );
}
