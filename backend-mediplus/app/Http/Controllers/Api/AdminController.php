<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Pharmacy;
use App\Models\DoctorProfile;
use App\Models\PatientProfile;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // GET /api/admin/users
    public function users()
    {
        $users = User::select('id', 'name', 'email', 'role')->get();
        return response()->json(['users' => $users]);
    }

    // PUT /api/admin/users/{id}
    public function updateRole(Request $request, $id)
    {
        $data = $request->validate([
            'role' => 'required|in:patient,doctor,admin',
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $data['role']]);

        return response()->json(['message' => 'Rôle mis à jour', 'user' => $user]);
    }

    // GET /api/admin/catalog
    public function catalog()
    {
        $pharmacies = Pharmacy::select('id', 'name', 'address', 'phone', 'is_active')->get();
        return response()->json(['items' => $pharmacies, 'total' => $pharmacies->count()]);
    }

    // GET /api/admin/reports
    public function reports()
    {
        $totalUsers = User::count();
        $totalDoctors = User::where('role', 'doctor')->count();
        $totalPatients = User::where('role', 'patient')->count();
        $totalPharmacies = Pharmacy::count();

        // Profils incomplets : doctors sans doctor_profile ou patients sans patient_profile
        $incompleteProfiles = User::where(function ($query) {
            $query->where('role', 'doctor')
                ->whereDoesntHave('doctorProfile')
                ->orWhere('role', 'patient')
                ->whereDoesntHave('patientProfile');
        })->count();

        // Éléments à valider : appointments en attente ou payments en attente
        $pendingItems = Appointment::where('status', 'pending')->count() +
            \App\Models\Payment::where('status', 'pending')->count();

        // Signalements récents : hardcodé pour l'instant (à implémenter avec une table reports)
        $recentReports = 1;

        return response()->json([
            'total_users' => $totalUsers,
            'total_doctors' => $totalDoctors,
            'total_patients' => $totalPatients,
            'total_pharmacies' => $totalPharmacies,
            'incomplete_profiles' => $incompleteProfiles,
            'pending_items' => $pendingItems,
            'recent_reports' => $recentReports,
        ]);
    }
}
