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

    // POST /api/admin/users/{id}/toggle-verification
    public function toggleVerification($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_verified' => !$user->is_verified]);

        return response()->json([
            'message' => 'Statut de vérification mis à jour',
            'user' => $user
        ]);
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

        // Statistiques de consultations
        $totalConsultations = Appointment::count();
        $consultationsThisMonth = Appointment::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Statistiques de revenus (basé sur les paiements réussis)
        $totalRevenue = \App\Models\Payment::where('status', 'completed')->sum('amount') ?? 0;
        $revenueThisMonth = \App\Models\Payment::where('status', 'completed')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('amount') ?? 0;

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

        // Données d'activité mensuelle (6 derniers mois)
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $consultations = Appointment::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();
            $revenue = \App\Models\Payment::where('status', 'completed')
                ->whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->sum('amount') ?? 0;

            $monthlyData[] = [
                'month' => $date->format('M'),
                'consultations' => $consultations,
                'revenue' => $revenue,
            ];
        }

        return response()->json([
            'total_users' => $totalUsers,
            'total_doctors' => $totalDoctors,
            'total_patients' => $totalPatients,
            'total_pharmacies' => $totalPharmacies,
            'total_consultations' => $totalConsultations,
            'consultations_this_month' => $consultationsThisMonth,
            'total_revenue' => $totalRevenue,
            'revenue_this_month' => $revenueThisMonth,
            'incomplete_profiles' => $incompleteProfiles,
            'pending_items' => $pendingItems,
            'recent_reports' => $recentReports,
            'monthly_activity' => $monthlyData,
        ]);
    }

    // GET /api/admin/monetization
    public function monetization()
    {
        // Plans d'abonnement (hardcodé pour l'instant)
        $plans = [
            [
                'id' => 1,
                'name' => 'Basic',
                'price' => 0,
                'description' => 'Gratuit, accès standard',
                'active_users' => User::where('role', 'patient')->count(),
            ],
            [
                'id' => 2,
                'name' => 'Pro',
                'price' => 5000,
                'description' => 'Accès prioritaire, support médical IA',
                'active_users' => User::where('role', 'doctor')->count(),
            ],
            [
                'id' => 3,
                'name' => 'Premium',
                'price' => 10000,
                'description' => 'Téléconsultation illimitée + support IA',
                'active_users' => 0, // À calculer avec les paiements
            ],
        ];

        // Revenus totaux (hardcodé pour l'instant)
        $totalRevenue = 0; // À calculer avec les paiements

        return response()->json([
            'plans' => $plans,
            'total_revenue' => $totalRevenue,
        ]);
    }

    // PUT /api/admin/monetization/{id}
    public function updatePlanPrice(Request $request, $id)
    {
        $data = $request->validate([
            'price' => 'required|integer|min:0',
        ]);

        // Ici on pourrait sauvegarder dans une table plans
        // Pour l'instant, on retourne juste un succès
        return response()->json(['message' => 'Prix mis à jour']);
    }

    // GET /api/admin/moderation
    public function moderation()
    {
        // Signalements simulés basés sur les données réelles (à remplacer par une vraie table reports)
        $reports = [
            [
                'id' => 1,
                'type' => 'Contenu inapproprié',
                'category' => 'comment',
                'reporter' => 'Marie K.',
                'reported_user' => 'Dr. Jean Dupont',
                'message' => 'Commentaire contenant un langage offensant dans une consultation.',
                'content' => 'Ce médecin est nul, il ne sait rien faire !',
                'date' => now()->subDays(2)->toDateString(),
                'status' => 'ouvert',
                'priority' => 'high',
                'evidence' => ['screenshot1.jpg', 'chat_log.txt'],
            ],
            [
                'id' => 2,
                'type' => 'Profil suspect',
                'category' => 'profile',
                'reporter' => 'Système IA',
                'reported_user' => 'Dr. Ahmed Ben Ali',
                'message' => 'Activité suspecte détectée : création de compte avec informations potentiellement falsifiées.',
                'content' => null,
                'date' => now()->subDays(1)->toDateString(),
                'status' => 'en_cours',
                'priority' => 'medium',
                'evidence' => ['ip_analysis.pdf'],
            ],
            [
                'id' => 3,
                'type' => 'Spam',
                'category' => 'advertisement',
                'reporter' => 'Sophie M.',
                'reported_user' => 'Pharmacie Centrale',
                'message' => 'Publication répétée de publicités non sollicitées.',
                'content' => '🔥 PROMO SPECIALE : -50% sur tous les médicaments ! Contactez-nous...',
                'date' => now()->subDays(3)->toDateString(),
                'status' => 'resolu',
                'priority' => 'low',
                'evidence' => ['post_screenshots.zip'],
            ],
            [
                'id' => 4,
                'type' => 'Violation des CGU',
                'category' => 'behavior',
                'reporter' => 'Admin Système',
                'reported_user' => 'Patient Anonyme',
                'message' => 'Tentative de prise de rendez-vous frauduleuse détectée.',
                'content' => null,
                'date' => now()->subHours(6)->toDateString(),
                'status' => 'ouvert',
                'priority' => 'high',
                'evidence' => ['transaction_log.json'],
            ],
        ];

        // Statistiques des signalements
        $stats = [
            'total' => count($reports),
            'open' => count(array_filter($reports, fn($r) => $r['status'] === 'ouvert')),
            'in_progress' => count(array_filter($reports, fn($r) => $r['status'] === 'en_cours')),
            'resolved' => count(array_filter($reports, fn($r) => $r['status'] === 'resolu')),
            'high_priority' => count(array_filter($reports, fn($r) => $r['priority'] === 'high')),
        ];

        return response()->json([
            'reports' => $reports,
            'stats' => $stats,
        ]);
    }

    // PUT /api/admin/moderation/{id}/status
    public function updateReportStatus(Request $request, $id)
    {
        $data = $request->validate([
            'status' => 'required|in:ouvert,en_cours,resolu',
        ]);

        // Ici on mettrait à jour la table reports
        return response()->json(['message' => 'Statut mis à jour']);
    }

    // GET /api/admin/settings
    public function settings()
    {
        // Paramètres système (hardcodé pour l'instant)
        $settings = [
            'maintenance_mode' => false,
            'allow_new_users' => true,
            'notify_admins' => true,
            'data_retention_days' => 365,
            'platform_name' => 'MediPlus',
            'support_email' => 'support@mediplus.ci',
        ];

        return response()->json(['settings' => $settings]);
    }

    // PUT /api/admin/settings
    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'maintenance_mode' => 'boolean',
            'allow_new_users' => 'boolean',
            'notify_admins' => 'boolean',
            'data_retention_days' => 'integer|min:30|max:3650',
            'platform_name' => 'string|max:255',
            'support_email' => 'email',
        ]);

        // Ici on sauvegarderait dans une table settings
        return response()->json(['message' => 'Paramètres mis à jour']);
    }
}
