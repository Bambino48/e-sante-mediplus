// src/pages/pro/Profile.jsx
import { useState } from "react";

export default function Profile() {
    const [form, setForm] = useState({
        name: "Dr. Marie Kouassi",
        specialty: "Cardiologie",
        experience: 10,
        fees: 15000,
        bio: "Cardiologue expérimentée spécialisée en prévention cardiovasculaire.",
    });

    const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    return (
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-xl font-semibold">Profil professionnel</h1>
            <div className="card space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                    <input
                        className="input"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Nom complet"
                    />
                    <input
                        className="input"
                        value={form.specialty}
                        onChange={(e) => update("specialty", e.target.value)}
                        placeholder="Spécialité"
                    />
                    <input
                        className="input"
                        type="number"
                        value={form.experience}
                        onChange={(e) => update("experience", e.target.value)}
                        placeholder="Années d’expérience"
                    />
                    <input
                        className="input"
                        type="number"
                        value={form.fees}
                        onChange={(e) => update("fees", e.target.value)}
                        placeholder="Tarif (FCFA)"
                    />
                </div>
                <textarea
                    className="input min-h-[100px]"
                    value={form.bio}
                    onChange={(e) => update("bio", e.target.value)}
                    placeholder="Présentation"
                />
                <button className="btn-primary">Mettre à jour</button>
            </div>
        </main>
    );
}
