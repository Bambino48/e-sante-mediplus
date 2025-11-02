<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PatientProfile;

class PatientProfileController extends Controller
{
    /**
     * 🔹 GET /api/patient/profile
     * Récupérer le profil patient du user connecté
     */
    public function show()
    {
        $user = Auth::user();

        if ($user->role !== 'patient') {
            return response()->json(['message' => 'Accès réservé aux patients.'], 403);
        }

        $profile = $user->patientProfile;

        if (!$profile) {
            return response()->json(['message' => 'Aucun profil patient trouvé.'], 404);
        }

        return response()->json([
            'message' => 'Profil patient récupéré avec succès.',
            'patient_profile' => $profile
        ], 200);
    }

    /**
     * 🔹 POST /api/patient/profile
     * Créer un profil patient
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'patient') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($user->patientProfile) {
            return response()->json(['message' => 'Profil patient déjà existant.'], 400);
        }

        $validated = $request->validate([
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'blood_group' => 'nullable|string|max:5',
            'height' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'allergies' => 'nullable|string',
            'chronic_diseases' => 'nullable|string',
            'medications' => 'nullable|string',
            'emergency_contact' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
        ]);

        $profile = PatientProfile::create([
            'user_id' => $user->id,
            ...$validated
        ]);

        return response()->json([
            'message' => 'Profil patient créé avec succès.',
            'patient_profile' => $profile
        ], 201);
    }

    /**
     * 🔹 PUT /api/patient/profile
     * Mettre à jour le profil patient
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'patient') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'blood_group' => 'nullable|string|max:5',
            'height' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'allergies' => 'nullable|string',
            'chronic_diseases' => 'nullable|string',
            'medications' => 'nullable|string',
            'emergency_contact' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
        ]);

        $profile = PatientProfile::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return response()->json([
            'message' => 'Profil patient mis à jour avec succès.',
            'patient_profile' => $profile
        ], 200);
    }

    /**
     * 🔹 DELETE /api/patient/profile
     * Supprimer un profil patient
     */
    public function destroy()
    {
        $user = Auth::user();

        if ($user->role !== 'patient') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $profile = $user->patientProfile;

        if (!$profile) {
            return response()->json(['message' => 'Aucun profil à supprimer.'], 404);
        }

        $profile->delete();

        return response()->json(['message' => 'Profil patient supprimé avec succès.']);
    }
}
