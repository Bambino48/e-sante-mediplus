import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar.jsx"; // ✅ ajouté

// 🩺 Pages Patient
import PatientAppointments from "../pages/patient/Appointments.jsx";
import DashboardContainer from "../pages/patient/DashboardContainer.jsx";
import PatientHome from "../pages/patient/Home.jsx";
import Profile from "../pages/patient/Profile.jsx";

// 👨‍⚕️ Professionnel
import Availabilities from "../pages/pro/Availabilities.jsx";
import Billing from "../pages/pro/Billing.jsx";
import ProCalendar from "../pages/pro/Calendar.jsx";
import ProDashboard from "../pages/pro/Dashboard.jsx";
import ProPatients from "../pages/pro/Patients.jsx";
import ProPrescriptions from "../pages/pro/Prescriptions.jsx";
import PrescriptionsEditor from "../pages/pro/PrescriptionsEditor.jsx";
import ProProfile from "../pages/pro/Profile.jsx";
import Profilpro from "../pages/pro/Profilpro.jsx";
import ProSettings from "../pages/pro/Settings.jsx";
import ProTeleconsult from "../pages/pro/Teleconsult.jsx";

// 🧑‍💼 Administrateur
import Catalog from "../pages/admin/Catalog.jsx";
import AdminDashboard from "../pages/admin/Dashboard.jsx";
import Users from "../pages/admin/Users.jsx";

// 🔐 Authentification
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

// 🔍 Fonctionnalités patient
import Notifications from "../pages/notifications/Notifications.jsx";
import Booking from "../pages/patient/Booking.jsx";
import Checkout from "../pages/patient/Checkout.jsx";
import Doctor from "../pages/patient/Doctor.jsx";
import PatientPrescriptions from "../pages/patient/Prescriptions.jsx";
import Search from "../pages/patient/Search.jsx";
import Teleconsult from "../pages/patient/Teleconsult.jsx";
import Triage from "../pages/patient/Triage.jsx";

// 📄 Pages statiques
import About from "../pages/static/About.jsx";
import Contact from "../pages/static/Contact.jsx";
import Pricing from "../pages/static/Pricing.jsx";

// 🔧 Containers

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
        <Route
          path="/patient/prescriptions"
          element={<PatientPrescriptions />}
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute roles={["patient"]}>
              <PatientAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute roles={["patient"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route path="/checkout/:appointmentId" element={<Checkout />} />
        <Route path="/triage" element={<Triage />} />
        <Route path="/doctor/:id" element={<Doctor />} />
        <Route path="/patient/profile" element={<Profile />} />
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute roles={["patient"]}>
              <DashboardContainer />
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
          path="/pro/calendar"
          element={
            <ProtectedRoute roles={["doctor", "nurse", "pro"]}>
              <ProCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pro/availabilities"
          element={
            <ProtectedRoute roles={["doctor", "nurse", "pro"]}>
              <Availabilities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pro/patients"
          element={
            <ProtectedRoute roles={["doctor", "nurse", "pro"]}>
              <ProPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pro/prescriptions"
          element={
            <ProtectedRoute roles={["doctor", "nurse", "pro"]}>
              <ProPrescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pro/prescriptions/editor"
          element={
            <ProtectedRoute roles={["doctor", "nurse", "pro"]}>
              <PrescriptionsEditor />
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
          path="/pro/teleconsult"
          element={
            <ProtectedRoute roles={["doctor", "nurse", "pro"]}>
              <ProTeleconsult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pro/profile"
          element={
            <ProtectedRoute roles={["doctor", "nurse", "pro"]}>
              <ProProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pro/profilpro"
          element={
            <ProtectedRoute roles={["doctor", "nurse", "pro"]}>
              <Profilpro />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pro/settings"
          element={
            <ProtectedRoute roles={["doctor", "nurse", "pro"]}>
              <ProSettings />
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
