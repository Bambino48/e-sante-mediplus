<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DoctorProfile;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function search(Request $request)
    {
        $query = User::where('role', 'doctor');

        // Filtre par spécialité
        if ($request->has('specialty')) {
            $specialty = $request->input('specialty');
            $query->whereHas('doctorProfile', function ($q) use ($specialty) {
                $q->where('specialty', $specialty);
            });
        }

        // Filtre par nom
        if ($request->has('name')) {
            $name = $request->input('name');
            $query->where('name', 'like', '%' . $name . '%');
        }

        $doctors = $query->with('doctorProfile')->paginate(15);

        return response()->json(['doctors' => $doctors]);
    }

    public function specialties()
    {
        $specialties = DoctorProfile::whereNotNull('specialty')
            ->distinct()
            ->pluck('specialty');

        return response()->json(['specialties' => $specialties]);
    }

    public function show($id)
    {
        $doctor = User::where('role', 'doctor')->findOrFail($id);
        $doctor->load('doctorProfile', 'availability');

        return response()->json(['doctor' => $doctor]);
    }
}
