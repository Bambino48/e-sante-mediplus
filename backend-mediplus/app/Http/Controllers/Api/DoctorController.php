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
