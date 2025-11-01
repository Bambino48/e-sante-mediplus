<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Specialty;
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
        return response()->json(['specialties' => Specialty::all()]);
    }

    // GET /api/admin/reports
    public function reports()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_doctors' => User::where('role', 'doctor')->count(),
            'total_patients' => User::where('role', 'patient')->count(),
        ]);
    }
}
