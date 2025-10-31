<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\DoctorProfile;

class DoctorController extends Controller
{
    /**
     * 🔹 GET /api/search
     * Recherche de médecins selon nom, spécialité, ville
     */
    public function search(Request $request)
    {
        $query = $request->input('q');
        $specialty = $request->input('specialty');
        $city = $request->input('city');

        $doctors = User::where('role', 'doctor')
            ->with('doctorProfile')
            ->whereHas('doctorProfile', function ($q) use ($query, $specialty, $city) {
                if ($query) {
                    $q->where('bio', 'like', "%{$query}%")
                        ->orWhere('address', 'like', "%{$query}%");
                }
                if ($specialty) {
                    $q->where('specialty', 'like', "%{$specialty}%");
                }
                if ($city) {
                    $q->where('city', 'like', "%{$city}%");
                }
            })
            ->get();

        Log::info("🔍 Recherche de médecins effectuée", [
            'query' => $query,
            'specialty' => $specialty,
            'city' => $city,
            'count' => $doctors->count()
        ]);

        return response()->json([
            'count' => $doctors->count(),
            'doctors' => $doctors,
        ]);
    }

    /**
     * 🔹 GET /api/doctor/{id}
     * Détails d’un médecin
     */
    public function show($id)
    {
        $doctor = User::where('role', 'doctor')
            ->with('doctorProfile')
            ->findOrFail($id);

        Log::info("📄 Affichage du profil médecin public", ['doctor_id' => $id]);

        return response()->json(['doctor' => $doctor]);
    }

    /**
     * 🔹 GET /api/specialties
     * Liste des spécialités distinctes
     */
    public function specialties()
    {
        $specialties = DoctorProfile::whereNotNull('specialty')
            ->distinct()
            ->pluck('specialty')
            ->values();

        Log::info("📚 Liste des spécialités récupérée", [
            'total' => count($specialties)
        ]);

        return response()->json(['specialties' => $specialties]);
    }

    /**
     * 🔹 POST /api/doctor/profile
     * Crée un nouveau profil médecin
     */
    public function storeProfile(Request $request)
    {
        $user = auth('sanctum')->user();

        if (!$user || $user->role !== 'doctor') {
            Log::warning("🚫 Tentative de création de profil par un utilisateur non médecin", [
                'user_id' => $user?->id
            ]);
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($user->doctorProfile) {
            return response()->json(['message' => 'Profil déjà existant.'], 400);
        }

        $validated = $request->validate([
            'specialty' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'fees' => 'nullable|integer|min:0',
            'bio' => 'nullable|string|max:2000',
            'availability' => 'nullable|array',
        ]);

        $profile = DoctorProfile::create([
            'user_id' => $user->id,
            ...$validated,
        ]);

        Log::info("✅ Profil médecin créé avec succès", [
            'doctor_id' => $user->id,
            'specialty' => $validated['specialty']
        ]);

        return response()->json([
            'message' => 'Profil médecin créé avec succès.',
            'doctor_profile' => $profile,
        ], 201);
    }

    /**
     * 🔹 PUT /api/doctor/profile
     * Met à jour le profil du médecin connecté
     */
    public function updateProfile(Request $request)
    {
        $user = auth('sanctum')->user();

        if (!$user || $user->role !== 'doctor') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'specialty' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'fees' => 'nullable|integer|min:0',
            'bio' => 'nullable|string|max:2000',
            'availability' => 'nullable|array',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $profile = DoctorProfile::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        Log::info("🛠️ Profil médecin mis à jour", [
            'doctor_id' => $user->id,
            'updated_fields' => array_keys($validated)
        ]);

        return response()->json([
            'message' => 'Profil médecin mis à jour avec succès.',
            'doctor_profile' => $profile
        ]);
    }

    /**
     * 🔹 GET /api/doctor/profile
     * Récupère le profil du médecin connecté (corrigée)
     */
    public function myProfile(Request $request)
    {
        // 🔍 Debug avancé
        Log::debug('=== DEBUG DOCTOR PROFILE ===', [
            'auth_header' => $request->header('Authorization'),
            'sanctum_user' => auth('sanctum')->user(),
            'auth_user' => $request->user(),
            'guard_user' => Auth::guard('sanctum')->user(),
        ]);
        // ✅ Authentification explicite via Sanctum pour Bearer token
        $user = auth('sanctum')->user();

        if (!$user) {
            Log::warning("❌ Token invalide ou utilisateur non authentifié", [
                'ip' => $request->ip(),
                'headers' => $request->headers->all(),
            ]);
            return response()->json(['message' => 'Utilisateur non authentifié.'], 401);
        }

        if ($user->role !== 'doctor') {
            Log::warning("🚫 Accès refusé — utilisateur non médecin", ['user_id' => $user->id]);
            return response()->json(['message' => 'Accès refusé (non médecin).'], 403);
        }

        $profile = $user->doctorProfile;

        if (!$profile) {
            Log::notice("⚠️ Aucun profil trouvé pour le médecin", ['doctor_id' => $user->id]);
            return response()->json([
                'message' => "Aucun profil trouvé pour le médecin connecté (#{$user->id})"
            ], 404);
        }

        $profile->load('user');

        Log::info("✅ Profil médecin récupéré avec succès", [
            'doctor_id' => $user->id,
            'specialty' => $profile->specialty,
        ]);

        return response()->json([
            'message' => 'Profil médecin trouvé avec succès.',
            'doctor_profile' => $profile,
        ], 200);
    }
}
