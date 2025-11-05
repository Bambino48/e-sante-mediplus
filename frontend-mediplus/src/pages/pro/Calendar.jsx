// src/pages/pro/Calendar.jsx
import { useAppointments } from "../../hooks/useAppointments.js";
import ProLayout from "../../layouts/ProLayout.jsx";

export default function Calendar() {
    const { data, isLoading } = useAppointments({ role: "doctor" });

    return (
        <ProLayout title="Calendrier des rendez-vous">
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
        </ProLayout>
    );
}
