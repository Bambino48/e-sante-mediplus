<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class AuthController extends Controller
{
    // ✅ Enregistrement
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string|in:patient,doctor,admin',
            'phone' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Utilisateur enregistré avec succès.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // ✅ Connexion
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Identifiants invalides.'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // ✅ Déconnexion
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    // ✅ Profil utilisateur
    public function profile(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    // ✅ Mise à jour du profil (avec upload photo propre)
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'phone' => 'sometimes|string|max:20',
            'photo' => 'sometimes|nullable|string', // Base64 encodé ou chemin
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        // 🔹 Gestion de la photo (Base64 -> stockage fichier)
        if ($request->filled('photo') && str_starts_with($request->photo, 'data:image')) {
            // Extraire l’extension du fichier
            preg_match('/^data:image\/(\w+);base64,/', $request->photo, $type);
            $extension = $type[1] ?? 'jpg';
            $image = substr($request->photo, strpos($request->photo, ',') + 1);
            $image = str_replace(' ', '+', $image);

            // Nom unique du fichier
            $fileName = 'profile_' . $user->id . '_' . time() . '.' . $extension;

            // Stockage dans storage/app/public/photos/
            Storage::disk('public')->put('photos/' . $fileName, base64_decode($image));

            // Suppression de l’ancienne photo si existante
            if ($user->photo && Storage::disk('public')->exists($user->photo)) {
                Storage::disk('public')->delete($user->photo);
            }

            // Enregistrement du chemin relatif
            $validated['photo'] = 'photos/' . $fileName;
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user' => $user,
        ]);
    }
}
