// src/pages/pro/Settings.jsx
import { useState } from "react";

export default function Settings() {
    const [settings, setSettings] = useState({
        notifications: true,
        autoConfirm: false,
        theme: "light",
    });

    const update = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

    return (
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-xl font-semibold">Paramètres du compte</h1>

            <div className="card space-y-3">
                <label className="flex items-center justify-between">
                    <span>Notifications</span>
                    <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => update("notifications", e.target.checked)}
                    />
                </label>
                <label className="flex items-center justify-between">
                    <span>Confirmation automatique des RDV</span>
                    <input
                        type="checkbox"
                        checked={settings.autoConfirm}
                        onChange={(e) => update("autoConfirm", e.target.checked)}
                    />
                </label>
                <label className="flex items-center justify-between">
                    <span>Thème</span>
                    <select
                        className="input w-40"
                        value={settings.theme}
                        onChange={(e) => update("theme", e.target.value)}
                    >
                        <option value="light">Clair</option>
                        <option value="dark">Sombre</option>
                    </select>
                </label>
            </div>

            <button className="btn-primary">Enregistrer</button>
        </main>
    );
}
