// src/pages/admin/Monetization.jsx
import { useState } from "react";

export default function Monetization() {
    const [plans, setPlans] = useState([
        { id: 1, name: "Basic", price: 0, desc: "Gratuit, accès standard" },
        { id: 2, name: "Pro", price: 5000, desc: "Accès prioritaire, support médical IA" },
        { id: 3, name: "Premium", price: 10000, desc: "Téléconsultation illimitée + support IA" },
    ]);

    const updatePrice = (id, price) => {
        setPlans((p) => p.map((x) => (x.id === id ? { ...x, price } : x)));
    };

    return (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-xl font-semibold">Monétisation & abonnements</h1>

            <div className="grid sm:grid-cols-3 gap-3">
                {plans.map((p) => (
                    <div key={p.id} className="card text-center space-y-3">
                        <div className="text-lg font-medium">{p.name}</div>
                        <div className="text-sm text-slate-500">{p.desc}</div>
                        <input
                            type="number"
                            className="input w-24 mx-auto text-center"
                            value={p.price}
                            onChange={(e) => updatePrice(p.id, e.target.value)}
                        />
                        <div className="text-slate-500 text-xs">FCFA / mois</div>
                    </div>
                ))}
            </div>

            <button className="btn-primary">Mettre à jour les tarifs</button>
        </main>
    );
}
