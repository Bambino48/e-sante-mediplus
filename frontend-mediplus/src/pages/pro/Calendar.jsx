// src/pages/pro/Calendar.jsx
import { useAppointments } from "../../hooks/useAppointments.js";

export default function Calendar() {
    const { data, isLoading } = useAppointments({ role: "doctor" });

    return (
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-xl font-semibold">Calendrier des rendez-vous</h1>
            {isLoading ? (
                <div className="card grid place-items-center py-16">Chargement…</div>
            ) : (
                <div className="card overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th>Date</th>
                                <th>Heure</th>
                                <th>Patient</th>
                                <th>Mode</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((a) => (
                                <tr key={a.id} className="border-b last:border-none">
                                    <td>{a.date}</td>
                                    <td>{a.time}</td>
                                    <td>{a.patient}</td>
                                    <td>{a.mode}</td>
                                    <td>{a.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
