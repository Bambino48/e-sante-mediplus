<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Specialty;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users()
    {
        $users = User::paginate(20);

        return response()->json(['users' => $users]);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'role' => 'sometimes|in:patient,doctor,admin',
            'status' => 'sometimes|in:active,inactive,suspended',
        ]);

        $user->update($validated);

        return response()->json(['user' => $user]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function catalog()
    {
        $specialties = Specialty::paginate(20);

        return response()->json(['specialties' => $specialties]);
    }

    public function storeCatalog(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:specialties',
            'description' => 'nullable|string',
        ]);

        $specialty = Specialty::create($validated);

        return response()->json(['specialty' => $specialty], 201);
    }

    public function reports()
    {
        $stats = [
            'total_users' => User::count(),
            'total_doctors' => User::where('role', 'doctor')->count(),
            'total_patients' => User::where('role', 'patient')->count(),
            'total_appointments' => \App\Models\Appointment::count(),
        ];

        return response()->json(['stats' => $stats]);
    }
}
