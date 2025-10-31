/* eslint-disable no-unused-vars */
// src/pages/patient/Profile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";

export default function PatientProfile() {
    const { user, token, updateProfile } = useAuth(); // ✅ récupère updateProfile
    const [form, setForm] = useState({ name: "", email: "", phone: "" });

    // ✅ Remplit le formulaire avec les infos actuelles
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    // ✅ Soumission du formulaire
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(form); // 🔹 utilise la fonction du hook
            toast.success("Profil mis à jour avec succès !");
        } catch (err) {
            toast.error("Erreur lors de la mise à jour du profil.");
        }
    };

    // ✅ Si non connecté
    if (!user) {
        return (
            <div className="text-center mt-16 text-slate-500">
                Vous devez être connecté pour voir cette page.
            </div>
        );
    }

    // ✅ Formulaire principal
    return (
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-2xl font-semibold mb-4">Mon profil</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <input
                    className="input"
                    type="text"
                    placeholder="Nom complet"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Téléphone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <button type="submit" className="btn-primary w-full">
                    Mettre à jour
                </button>
            </form>
        </div>
    );
}
