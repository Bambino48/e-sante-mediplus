// src/pages/patient/DashboardContainer.jsx
import { useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import PatientDashboard from "./Dashboard.jsx";
import PatientProfile from "./Profile.jsx";
import Teleconsult from "./Teleconsult.jsx";
import Triage from "./Triage.jsx";
import Prescriptions from "./Prescriptions.jsx";
import Booking from "./Booking.jsx";

export default function DashboardContainer() {
    const [activeView, setActiveView] = useState("dashboard");

    // Dictionnaire des composants internes
    const views = {
        dashboard: <PatientDashboard />,
        profile: <PatientProfile />,
        teleconsult: <Teleconsult />,
        triage: <Triage />,
        prescriptions: <Prescriptions />,
        booking: <Booking />,
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* ✅ Sidebar unique ici */}
            <Sidebar
                section="patient"
                setActiveView={setActiveView}
                activeView={activeView}
                className="border-r border-slate-200 dark:border-slate-800"
            />

            {/* ✅ Zone principale dynamique */}
            <main className="flex-1 p-6 overflow-y-auto">
                {views[activeView] || <PatientDashboard />}
            </main>
        </div>
    );
}
