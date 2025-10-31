// src/pages/admin/Moderation.jsx
import { useState } from "react";

export default function Moderation() {
    const [reports, setReports] = useState([
        {
            id: 1,
            type: "Avis signalé",
            reporter: "Aïcha K.",
            message: "Langage inapproprié dans un commentaire.",
            date: "2025-10-25",
            status: "ouvert",
        },
        {
            id: 2,
            type: "Profil suspect",
            reporter: "Système IA",
            message: "Activité anormale sur un compte professionnel.",
            date: "2025-10-27",
            status: "en cours",
        },
    ]);

    const updateStatus = (id, newStatus) =>
        setReports((r) => r.map((x) => (x.id === id ? { ...x, status: newStatus } : x)));

    return (
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-xl font-semibold">Modération & signalements</h1>

            <div className="card overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b text-left">
                            <th>ID</th>
                            <th>Type</th>
                            <th>Message</th>
                            <th>Signaleur</th>
                            <th>Date</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((r) => (
                            <tr key={r.id} className="border-b last:border-none">
                                <td>{r.id}</td>
                                <td>{r.type}</td>
                                <td>{r.message}</td>
                                <td>{r.reporter}</td>
                                <td>{r.date}</td>
                                <td>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${r.status === "ouvert"
                                                ? "bg-red-100 text-red-600"
                                                : r.status === "en cours"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-green-100 text-green-600"
                                            }`}
                                    >
                                        {r.status}
                                    </span>
                                </td>
                                <td>
                                    {r.status !== "fermé" && (
                                        <button
                                            className="btn-ghost text-xs"
                                            onClick={() => updateStatus(r.id, "fermé")}
                                        >
                                            Clôturer
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
