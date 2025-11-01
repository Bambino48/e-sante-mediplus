<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    // GET /api/pro/availability
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $availabilities = Availability::where('doctor_id', $user->id)->get();
        return response()->json(['availabilities' => $availabilities]);
    }

    // POST /api/pro/availability
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $data = $request->validate([
            'day_of_week' => 'nullable|integer|min:1|max:7',
            'date' => 'nullable|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'is_recurring' => 'boolean',
        ]);

        $availability = Availability::create([
            'doctor_id' => $user->id,
            ...$data
        ]);

        return response()->json([
            'message' => 'Disponibilité ajoutée avec succès',
            'availability' => $availability
        ], 201);
    }
}
