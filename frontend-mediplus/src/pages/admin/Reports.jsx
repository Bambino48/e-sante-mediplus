// src/pages/admin/Reports.jsx
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

async function fetchStats() {
    return {
        users: 1542,
        doctors: 127,
        consultations: 892,
        revenue: 14250000,
        activity: [
            { month: "Jan", consultations: 70, revenue: 800000 },
            { month: "Fév", consultations: 120, revenue: 1100000 },
            { month: "Mar", consultations: 150, revenue: 1500000 },
            { month: "Avr", consultations: 200, revenue: 2300000 },
            { month: "Mai", consultations: 180, revenue: 2000000 },
            { month: "Juin", consultations: 220, revenue: 2500000 },
        ],
    };
}

export default function Reports() {
    const { data, isLoading } = useQuery({ queryKey: ["stats"], queryFn: fetchStats });

    if (isLoading) return <div className="card grid place-items-center py-16">Chargement…</div>;

    return (
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <h1 className="text-xl font-semibold">Rapports et statistiques</h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="card text-center">
                    <div className="text-2xl font-semibold">{data.users}</div>
                    <div className="text-sm text-slate-500">Utilisateurs</div>
                </div>
                <div className="card text-center">
                    <div className="text-2xl font-semibold">{data.doctors}</div>
                    <div className="text-sm text-slate-500">Médecins</div>
                </div>
                <div className="card text-center">
                    <div className="text-2xl font-semibold">{data.consultations}</div>
                    <div className="text-sm text-slate-500">Consultations</div>
                </div>
                <div className="card text-center">
                    <div className="text-2xl font-semibold">{data.revenue.toLocaleString()} FCFA</div>
                    <div className="text-sm text-slate-500">Revenus</div>
                </div>
            </div>

            <div className="card">
                <h2 className="font-medium mb-3">Évolution mensuelle</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data.activity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="consultations" stroke="#14b8a6" />
                        <Line type="monotone" dataKey="revenue" stroke="#0284c7" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </main>
    );
}
