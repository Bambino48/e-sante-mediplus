<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DoctorProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DoctorController extends Controller
{
    /**
     * Récupère la liste complète des docteurs avec leurs profils
     * Route publique pour affichage frontend
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);
        $sortBy = $request->input('sort_by', 'name');
        $sortOrder = $request->input('sort_order', 'asc');
        $city = $request->input('city');
        $hasProfile = $request->input('has_profile', true);

        // Validation des paramètres de tri
        $allowedSortFields = ['name', 'created_at', 'rating', 'fees'];
        $sortBy = in_array($sortBy, $allowedSortFields) ? $sortBy : 'name';
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'asc';

        $query = User::where('role', 'doctor')
            ->with([
                'doctorProfile'
            ])
            ->select([
                'users.id',
                'users.name',
                'users.email',
                'users.phone',
                'users.photo',
                'users.latitude',
                'users.longitude',
                'users.created_at'
            ]);

        // Filtrer uniquement les docteurs ayant un profil complet
        if ($hasProfile) {
            $query->has('doctorProfile');
        }

        // Filtres optionnels
        if ($city) {
            $query->whereHas('doctorProfile', function ($q) use ($city) {
                $q->where('city', 'like', "%{$city}%");
            });
        }

        // Tri personnalisé
        if ($sortBy === 'rating' || $sortBy === 'fees') {
            // Utiliser une sous-requête pour le tri au lieu de leftJoin
            $query->whereHas('doctorProfile')
                ->orderBy(
                    DoctorProfile::select($sortBy)
                        ->whereColumn('doctor_profiles.user_id', 'users.id')
                        ->limit(1),
                    $sortOrder
                );
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $doctors = $query->paginate($perPage);

        // Formatage des données pour le frontend
        $formattedDoctors = $doctors->getCollection()->map(function ($doctor) {
            $profile = $doctor->doctorProfile;

            return [
                'id' => $doctor->id,
                'name' => $doctor->name,
                'email' => $doctor->email,
                'phone' => $doctor->phone,
                'photo' => $doctor->photo,
                'location' => [
                    'latitude' => $doctor->latitude,
                    'longitude' => $doctor->longitude,
                    'city' => $profile?->city,
                    'address' => $profile?->address,
                ],
                'profile' => $profile ? [
                    'bio' => $profile->bio,
                    'fees' => $profile->fees,
                    'rating' => $profile->rating,
                    'primary_specialty' => $profile->primary_specialty,
                    'professional_document' => $profile->professional_document,
                    'phone' => $profile->phone,
                ] : null,
                'specialties' => [],
                'member_since' => $doctor->created_at->format('Y-m-d'),
                'has_complete_profile' => (bool) $profile,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'doctors' => $formattedDoctors,
                'pagination' => [
                    'total' => $doctors->total(),
                    'per_page' => $doctors->perPage(),
                    'current_page' => $doctors->currentPage(),
                    'last_page' => $doctors->lastPage(),
                    'from' => $doctors->firstItem(),
                    'to' => $doctors->lastItem(),
                ],
                'filters' => [
                    'city' => $city,
                    'has_profile' => $hasProfile,
                ],
                'sorting' => [
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                ],
            ],
            'message' => 'Liste des médecins récupérée avec succès'
        ]);
    }

    // GET /api/search
    public function search(Request $request)
    {
        $q = $request->input('q');
        $city = $request->input('city');

        $doctors = User::query()
            ->where('role', 'doctor')
            ->with(['doctorProfile'])
            ->when($q, function ($qry) use ($q) {
                $qry->where('name', 'like', "%$q%")
                    ->orWhereHas('doctorProfile', function ($qq) use ($q) {
                        $qq->where('bio', 'like', "%$q%")
                            ->orWhere('address', 'like', "%$q%");
                    });
            })
            ->when($city, function ($qry) use ($city) {
                $qry->whereHas('doctorProfile', fn($qq) => $qq->where('city', 'like', "%$city%"));
            })
            ->get();

        return response()->json([
            'count' => $doctors->count(),
            'doctors' => $doctors,
        ]);
    }

    // GET /api/doctor/{id}
    public function show($id)
    {
        $doctor = User::where('role', 'doctor')
            ->with(['doctorProfile'])
            ->findOrFail($id);

        return response()->json(['doctor' => $doctor]);
    }

    // POST /api/doctor/profile (doctor connecté)
    public function storeProfile(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) return response()->json(['message' => 'Accès refusé'], 403);

        if ($user->doctorProfile) {
            return response()->json(['message' => 'Profil déjà existant'], 400);
        }

        try {
            $data = $request->validate([
                'city' => 'nullable|string|max:100',
                'address' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:30',
                'fees' => 'nullable|numeric|min:0',
                'bio' => 'nullable|string|max:4000',
                'primary_specialty' => 'nullable|string|max:120',
                'professional_document' => 'nullable|string|max:255',
                'specialties' => 'nullable|array', // ex: ["Cardiologie","Dermatologie"]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Données invalides',
                'errors' => $e->errors()
            ], 422);
        }

        $profile = DoctorProfile::create([
            'user_id' => $user->id,
            'city' => $data['city'] ?? null,
            'address' => $data['address'] ?? null,
            'phone' => $data['phone'] ?? null,
            'fees' => $data['fees'] ?? 0,
            'bio' => $data['bio'] ?? null,
            'primary_specialty' => $data['primary_specialty'] ?? null,
            'professional_document' => $data['professional_document'] ?? null,
        ]);

        return response()->json(['message' => 'Profil créé', 'doctor_profile' => $profile], 201);
    }

    // PUT /api/doctor/profile (doctor connecté)
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) return response()->json(['message' => 'Accès refusé'], 403);

        try {
            $data = $request->validate([
                'city' => 'nullable|string|max:100',
                'address' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:30',
                'fees' => 'nullable|numeric|min:0', // Changé integer vers numeric pour accepter floats
                'bio' => 'nullable|string|max:4000',
                'primary_specialty' => 'nullable|string|max:120',
                'rating' => 'nullable|numeric|min:0|max:5',
                'professional_document' => 'nullable|string|max:255',
                'specialties' => 'nullable|array',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Données invalides',
                'errors' => $e->errors()
            ], 422);
        }

        $profile = DoctorProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'city' => $data['city'] ?? null,
                'address' => $data['address'] ?? null,
                'phone' => $data['phone'] ?? null,
                'fees' => $data['fees'] ?? 0,
                'bio' => $data['bio'] ?? null,
                'primary_specialty' => $data['primary_specialty'] ?? null,
                'rating' => $data['rating'] ?? 0,
                'professional_document' => $data['professional_document'] ?? null,
            ]
        );

        return response()->json(['message' => 'Profil mis à jour', 'doctor_profile' => $profile]);
    }

    // GET /api/doctor/profile (doctor connecté)
    public function myProfile(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) return response()->json(['message' => 'Accès refusé'], 403);

        $profile = $user->doctorProfile;

        // Si pas de profil, retourner un profil vide au lieu d'une erreur 404
        if (!$profile) {
            return response()->json([
                'doctor_profile' => null,
                'has_profile' => false,
                'message' => 'Profil non configuré'
            ]);
        }

        $profile->load('user');

        return response()->json([
            'doctor_profile' => $profile,
            'has_profile' => true
        ]);
    }

    // GET /api/doctor/stats (statistiques du dashboard)
    public function stats(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) return response()->json(['message' => 'Accès refusé'], 403);

        // Statistiques des rendez-vous
        $totalAppointments = \App\Models\Appointment::where('doctor_id', $user->id)->count();
        $todayAppointments = \App\Models\Appointment::where('doctor_id', $user->id)
            ->whereDate('scheduled_at', today())
            ->count();
        $weekAppointments = \App\Models\Appointment::where('doctor_id', $user->id)
            ->whereBetween('scheduled_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->count();

        // Statistiques des patients (patients uniques)
        $totalPatients = \App\Models\Appointment::where('doctor_id', $user->id)
            ->distinct('patient_id')
            ->count('patient_id');

        // Rendez-vous aujourd'hui avec détails
        $todayAppointmentsDetails = \App\Models\Appointment::where('doctor_id', $user->id)
            ->whereDate('scheduled_at', today())
            ->with('patient:id,name,email')
            ->orderBy('scheduled_at')
            ->get(['id', 'scheduled_at', 'status', 'patient_id']);

        // Revenus (si il y a un système de paiement) - du mois en cours
        $monthlyRevenue = \App\Models\Payment::whereHas('appointment', function ($q) use ($user) {
            $q->where('doctor_id', $user->id)
                ->where('status', 'completed')
                ->whereMonth('scheduled_at', now()->month)
                ->whereYear('scheduled_at', now()->year);
        })->sum('amount') ?? 0;

        // Tâches en attente (prescriptions non signées, etc.)
        $pendingTasks = \App\Models\Prescription::where('doctor_id', $user->id)
            ->where('status', 'pending')
            ->count();

        return response()->json([
            'appointments_today' => $todayAppointments,
            'revenue_month' => $monthlyRevenue,
            'pending_tasks' => $pendingTasks,
        ]);
    }
}
