<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    // GET /api/doctor/availabilities
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $availabilities = Availability::where('doctor_id', $user->id)->get();
        return response()->json(['availabilities' => $availabilities]);
    }

    // POST /api/doctor/availabilities
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

        // Validation métier : cohérence entre is_recurring, date et day_of_week
        if (($data['is_recurring'] ?? true) && isset($data['date'])) {
            return response()->json([
                'message' => 'Une disponibilité récurrente ne peut pas avoir de date spécifique'
            ], 422);
        }

        if (!(($data['is_recurring'] ?? true)) && !isset($data['date'])) {
            return response()->json([
                'message' => 'Une disponibilité non récurrente doit avoir une date spécifique'
            ], 422);
        }

        if (($data['is_recurring'] ?? true) && !isset($data['day_of_week'])) {
            return response()->json([
                'message' => 'Une disponibilité récurrente doit avoir un jour de la semaine'
            ], 422);
        }

        if (!(($data['is_recurring'] ?? true)) && isset($data['day_of_week'])) {
            return response()->json([
                'message' => 'Une disponibilité non récurrente ne peut pas avoir de jour de la semaine'
            ], 422);
        }

        $availability = Availability::create([
            'doctor_id' => $user->id,
            ...$data
        ]);

        return response()->json([
            'message' => 'Disponibilité ajoutée avec succès',
            'availability' => $availability
        ], 201);
    }

    // PUT /api/doctor/availabilities/:id
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $availability = Availability::where('doctor_id', $user->id)->findOrFail($id);

        $data = $request->validate([
            'day_of_week' => 'nullable|integer|min:1|max:7',
            'date' => 'nullable|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'is_recurring' => 'boolean',
        ]);

        // Validation métier : cohérence entre is_recurring, date et day_of_week
        if (($data['is_recurring'] ?? $availability->is_recurring) && isset($data['date'])) {
            return response()->json([
                'message' => 'Une disponibilité récurrente ne peut pas avoir de date spécifique'
            ], 422);
        }

        if (!(($data['is_recurring'] ?? $availability->is_recurring)) && !isset($data['date']) && is_null($availability->date)) {
            return response()->json([
                'message' => 'Une disponibilité non récurrente doit avoir une date spécifique'
            ], 422);
        }

        if (($data['is_recurring'] ?? $availability->is_recurring) && !isset($data['day_of_week']) && is_null($availability->day_of_week)) {
            return response()->json([
                'message' => 'Une disponibilité récurrente doit avoir un jour de la semaine'
            ], 422);
        }

        if (!(($data['is_recurring'] ?? $availability->is_recurring)) && isset($data['day_of_week'])) {
            return response()->json([
                'message' => 'Une disponibilité non récurrente ne peut pas avoir de jour de la semaine'
            ], 422);
        }

        $availability->update($data);

        return response()->json([
            'message' => 'Disponibilité mise à jour avec succès',
            'availability' => $availability
        ]);
    }

    // DELETE /api/doctor/availabilities/:id
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $availability = Availability::where('doctor_id', $user->id)->findOrFail($id);
        $availability->delete();

        return response()->json([
            'message' => 'Disponibilité supprimée avec succès'
        ]);
    }
}
