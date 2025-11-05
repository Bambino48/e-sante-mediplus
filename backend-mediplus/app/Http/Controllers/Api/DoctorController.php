<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DoctorProfile;
use App\Models\Specialty;
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
        $specialty = $request->input('specialty');
        $hasProfile = $request->input('has_profile', true);

        // Validation des paramètres de tri
        $allowedSortFields = ['name', 'created_at', 'rating', 'fees'];
        $sortBy = in_array($sortBy, $allowedSortFields) ? $sortBy : 'name';
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'asc';

        $query = User::where('role', 'doctor')
            ->with([
                'doctorProfile',
                'specialties:id,name'
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

        if ($specialty) {
            $query->whereHas('specialties', function ($q) use ($specialty) {
                $q->where('name', 'like', "%{$specialty}%");
            })->orWhereHas('doctorProfile', function ($q) use ($specialty) {
                $q->where('primary_specialty', 'like', "%{$specialty}%");
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
                    'phone' => $profile->phone,
                    'availability' => $profile->availability,
                ] : null,
                'specialties' => $doctor->specialties->pluck('name')->toArray(),
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
                    'specialty' => $specialty,
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
        $specialty = $request->input('specialty');
        $city = $request->input('city');

        $doctors = User::query()
            ->where('role', 'doctor')
            ->with(['doctorProfile', 'specialties'])
            ->when($q, function ($qry) use ($q) {
                $qry->where('name', 'like', "%$q%")
                    ->orWhereHas('doctorProfile', function ($qq) use ($q) {
                        $qq->where('bio', 'like', "%$q%")
                            ->orWhere('address', 'like', "%$q%");
                    });
            })
            ->when($specialty, function ($qry) use ($specialty) {
                $qry->whereHas('doctorProfile', function ($qq) use ($specialty) {
                    $qq->where('primary_specialty', 'like', "%$specialty%");
                })->orWhereHas('specialties', function ($qq) use ($specialty) {
                    $qq->where('name', 'like', "%$specialty%");
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
            ->with(['doctorProfile', 'specialties'])
            ->findOrFail($id);

        return response()->json(['doctor' => $doctor]);
    }

    // GET /api/specialties
    public function specialties()
    {
        $list = Specialty::orderBy('name')->pluck('name')->values();
        return response()->json(['specialties' => $list]);
    }

    // POST /api/doctor/profile (doctor connecté)
    public function storeProfile(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) return response()->json(['message' => 'Accès refusé'], 403);

        if ($user->doctorProfile) {
            return response()->json(['message' => 'Profil déjà existant'], 400);
        }

        $data = $request->validate([
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:30',
            'fees' => 'nullable|integer|min:0',
            'bio' => 'nullable|string|max:4000',
            'availability' => 'nullable|array',
            'primary_specialty' => 'nullable|string|max:120',
            'specialties' => 'array', // ex: ["Cardiologie","Dermatologie"]
        ]);

        $profile = DoctorProfile::create([
            'user_id' => $user->id,
            'city' => $data['city'] ?? null,
            'address' => $data['address'] ?? null,
            'phone' => $data['phone'] ?? null,
            'fees' => $data['fees'] ?? 0,
            'bio' => $data['bio'] ?? null,
            'availability' => $data['availability'] ?? null,
            'primary_specialty' => $data['primary_specialty'] ?? null,
        ]);

        // sync specialties
        if (!empty($data['specialties'])) {
            $ids = [];
            foreach ($data['specialties'] as $name) {
                $spec = Specialty::firstOrCreate(['name' => $name]);
                $ids[] = $spec->id;
            }
            $user->specialties()->sync($ids);
        }

        return response()->json(['message' => 'Profil créé', 'doctor_profile' => $profile], 201);
    }

    // PUT /api/doctor/profile (doctor connecté)
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) return response()->json(['message' => 'Accès refusé'], 403);

        $data = $request->validate([
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:30',
            'fees' => 'nullable|integer|min:0',
            'bio' => 'nullable|string|max:4000',
            'availability' => 'nullable|array',
            'primary_specialty' => 'nullable|string|max:120',
            'rating' => 'nullable|numeric|min:0|max:5',
            'specialties' => 'array',
        ]);

        $profile = DoctorProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'city' => $data['city'] ?? null,
                'address' => $data['address'] ?? null,
                'phone' => $data['phone'] ?? null,
                'fees' => $data['fees'] ?? 0,
                'bio' => $data['bio'] ?? null,
                'availability' => $data['availability'] ?? null,
                'primary_specialty' => $data['primary_specialty'] ?? null,
                'rating' => $data['rating'] ?? 0,
            ]
        );

        if (array_key_exists('specialties', $data)) {
            $ids = [];
            foreach ($data['specialties'] as $name) {
                $spec = Specialty::firstOrCreate(['name' => $name]);
                $ids[] = $spec->id;
            }
            $user->specialties()->sync($ids);
        }

        return response()->json(['message' => 'Profil mis à jour', 'doctor_profile' => $profile]);
    }

    // GET /api/doctor/profile (doctor connecté)
    public function myProfile(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) return response()->json(['message' => 'Accès refusé'], 403);

        $profile = $user->doctorProfile;
        if (!$profile) return response()->json(['message' => 'Aucun profil trouvé'], 404);

        $user->load('specialties');
        $profile->load('user');

        return response()->json([
            'doctor_profile' => $profile,
            'specialties' => $user->specialties->pluck('name')->values(),
        ]);
    }
}
