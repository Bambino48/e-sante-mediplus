<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // POST /api/register
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'in:patient,doctor,admin',
            'phone' => 'nullable|string|max:30',
            'photo' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['role'] = $data['role'] ?? 'patient';

        $user = User::create($data);

        // NE PAS connecter automatiquement après l'inscription
        // L'utilisateur doit se connecter manuellement

        return response()->json([
            'message' => 'Inscription réussie. Veuillez vous connecter.',
            'user' => $user,
            'redirect_to' => 'login'
        ], 201);
    }

    // POST /api/login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    // GET /api/profile
    public function profile(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    // PUT /api/profile
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'sometimes|string|max:120',
            'phone' => 'sometimes|string|max:30|nullable',
            'photo' => 'sometimes|nullable', // Accepte fichier ou string
            'latitude' => 'sometimes|numeric|nullable',
            'longitude' => 'sometimes|numeric|nullable',
        ]);

        // Traitement de la photo
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            // Cas 1: Upload de fichier (multipart/form-data)
            $file = $request->file('photo');

            // Validation du type d'image
            $request->validate([
                'photo' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            // Supprimer l'ancienne photo si elle existe
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }

            $path = $file->store('avatars', 'public');
            $data['photo'] = $path;
        } elseif (!empty($data['photo']) && is_string($data['photo']) && Str::startsWith($data['photo'], 'data:')) {
            // Cas 2: Upload base64 (data URI)
            if (preg_match('/^data:image\/(\w+);base64,/', $data['photo'], $type)) {
                $imageData = substr($data['photo'], strpos($data['photo'], ',') + 1);
                $imageData = base64_decode($imageData);

                if ($imageData === false) {
                    return response()->json(['message' => 'Données image base64 invalides.'], 422);
                }

                $extension = $type[1] === 'jpeg' ? 'jpg' : $type[1];

                // Validation de l'extension
                if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
                    return response()->json(['message' => 'Type d\'image non supporté.'], 422);
                }

                // Supprimer l'ancienne photo si elle existe
                if ($user->photo) {
                    Storage::disk('public')->delete($user->photo);
                }

                $filename = 'avatars/' . $user->id . '_' . time() . '.' . $extension;
                Storage::disk('public')->put($filename, $imageData);
                $data['photo'] = $filename;
            } else {
                return response()->json(['message' => 'Format d\'image base64 invalide.'], 422);
            }
        } elseif (array_key_exists('photo', $data)) {
            // Cas 3: Chaîne vide ou null - supprimer la photo
            if ($data['photo'] === '' || $data['photo'] === null) {
                if ($user->photo) {
                    Storage::disk('public')->delete($user->photo);
                }
                $data['photo'] = null;
            }
        }

        $user->update($data);

        return response()->json(['message' => 'Profil mis à jour', 'user' => $user]);
    }
}
