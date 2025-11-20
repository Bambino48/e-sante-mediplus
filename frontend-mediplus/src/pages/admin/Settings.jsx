// src/pages/admin/Settings.jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useToast } from "../../hooks/useToast.js";

async function getSettings() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/settings`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
        },
    });
    if (!response.ok) throw new Error('Erreur lors du chargement des paramètres');
    return response.json();
}

async function updateSettings(settings) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Erreur lors de la sauvegarde des paramètres');
    return response.json();
}

export default function AdminSettings() {
    const { showSuccess, showError } = useToast();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-settings'],
        queryFn: getSettings,
    });

    const mutation = useMutation({
        mutationFn: updateSettings,
        onSuccess: () => {
            showSuccess('Paramètres sauvegardés avec succès');
            queryClient.invalidateQueries(['admin-settings']);
        },
        onError: (err) => {
            showError(err.message || 'Erreur lors de la sauvegarde');
        },
    });

    const [localSettings, setLocalSettings] = useState({});

    // Synchroniser les données chargées avec l'état local
    React.useEffect(() => {
        if (data?.settings) {
            setLocalSettings(data.settings);
        }
    }, [data]);

    const handleUpdate = (key, value) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        mutation.mutate(localSettings);
    };

    if (isLoading) return <div className="card grid place-items-center py-16">Chargement…</div>;
    if (error) return <div className="card text-red-600 p-4">Erreur: {error.message}</div>;

    const settings = localSettings;

    return (
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-xl font-semibold">Paramètres de la plateforme</h1>

            <div className="card space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center justify-between">
                        <span>Mode maintenance</span>
                        <input
                            type="checkbox"
                            checked={settings.maintenance_mode || false}
                            onChange={(e) => handleUpdate("maintenance_mode", e.target.checked)}
                            disabled={mutation.isLoading}
                        />
                    </label>

                    <label className="flex items-center justify-between">
                        <span>Autoriser les nouvelles inscriptions</span>
                        <input
                            type="checkbox"
                            checked={settings.allow_new_users ?? true}
                            onChange={(e) => handleUpdate("allow_new_users", e.target.checked)}
                            disabled={mutation.isLoading}
                        />
                    </label>

                    <label className="flex items-center justify-between">
                        <span>Notifier les administrateurs</span>
                        <input
                            type="checkbox"
                            checked={settings.notify_admins ?? true}
                            onChange={(e) => handleUpdate("notify_admins", e.target.checked)}
                            disabled={mutation.isLoading}
                        />
                    </label>

                    <label className="flex items-center justify-between">
                        <span>Durée de conservation des données (jours)</span>
                        <input
                            type="number"
                            className="input w-24"
                            value={settings.data_retention_days || 365}
                            onChange={(e) => handleUpdate("data_retention_days", parseInt(e.target.value))}
                            disabled={mutation.isLoading}
                        />
                    </label>
                </div>

                <div className="border-t pt-4">
                    <label className="block space-y-2">
                        <span className="font-medium">Nom de la plateforme</span>
                        <input
                            type="text"
                            className="input w-full"
                            value={settings.platform_name || ''}
                            onChange={(e) => handleUpdate("platform_name", e.target.value)}
                            disabled={mutation.isLoading}
                        />
                    </label>
                </div>

                <div>
                    <label className="block space-y-2">
                        <span className="font-medium">Email de support</span>
                        <input
                            type="email"
                            className="input w-full"
                            value={settings.support_email || ''}
                            onChange={(e) => handleUpdate("support_email", e.target.value)}
                            disabled={mutation.isLoading}
                        />
                    </label>
                </div>
            </div>

            <button
                className="btn-primary"
                onClick={handleSave}
                disabled={mutation.isLoading}
            >
                {mutation.isLoading ? 'Sauvegarde...' : 'Enregistrer les paramètres'}
            </button>
        </main>
    );
}
