import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx"; // ✅ ajouté

// 🩺 Pages Patient
import PatientHome from "../pages/patient/Home.jsx";
import PatientDashboard from "../pages/patient/Dashboard.jsx";
import Profile from "../pages/patient/Profile.jsx";

// 👨‍⚕️ Professionnel
import ProDashboard from "../pages/pro/Dashboard.jsx";
import Billing from "../pages/pro/Billing.jsx";
import PrescriptionsEditor from "../pages/pro/PrescriptionsEditor.jsx";

// 🧑‍💼 Administrateur
import AdminDashboard from "../pages/admin/Dashboard.jsx";
import Users from "../pages/admin/Users.jsx";
import Catalog from "../pages/admin/Catalog.jsx";

// 🔐 Authentification
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

// 🔍 Fonctionnalités patient
import Search from "../pages/patient/Search.jsx";
import Booking from "../pages/patient/Booking.jsx";
import Teleconsult from "../pages/patient/Teleconsult.jsx";
import PatientPrescriptions from "../pages/patient/Prescriptions.jsx";
import Checkout from "../pages/patient/Checkout.jsx";
import Triage from "../pages/patient/Triage.jsx";
import Doctor from "../pages/patient/Doctor.jsx";

// 📄 Pages statiques
import Pricing from "../pages/static/Pricing.jsx";
import About from "../pages/static/About.jsx";
import Contact from "../pages/static/Contact.jsx";

export default function AppRouter() {
    return (
        <>
            <Navbar /> {/* ✅ toujours visible */}
            <Routes>
                {/* Public */}
                <Route path="/" element={<PatientHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Pages statiques */}
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Patient */}
                <Route path="/search" element={<Search />} />
                <Route path="/booking/:doctorId" element={<Booking />} />
                <Route path="/teleconsult/:roomId" element={<Teleconsult />} />
                <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
                <Route path="/checkout/:appointmentId" element={<Checkout />} />
                <Route path="/triage" element={<Triage />} />
                <Route path="/doctor/:id" element={<Doctor />} />
                <Route path="/patient/profile" element={<Profile />} />

                <Route
                    path="/patient/dashboard"
                    element={
                        <ProtectedRoute roles={["patient"]}>
                            <PatientDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Professionnel */}
                <Route
                    path="/pro/dashboard"
                    element={
                        <ProtectedRoute roles={["doctor", "nurse", "pro"]}>
                            <ProDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pro/prescriptions/new"
                    element={
                        <ProtectedRoute roles={["doctor", "nurse", "pro"]}>
                            <PrescriptionsEditor />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pro/billing"
                    element={
                        <ProtectedRoute roles={["doctor", "nurse", "pro"]}>
                            <Billing />
                        </ProtectedRoute>
                    }
                />

                {/* Admin */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute roles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute roles={["admin"]}>
                            <Users />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/catalog"
                    element={
                        <ProtectedRoute roles={["admin"]}>
                            <Catalog />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}
