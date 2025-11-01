<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $availability = Availability::where('doctor_id', $user->id)
            ->orderBy('date')
            ->get();

        return response()->json(['availability' => $availability]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'doctor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'max_patients' => 'required|integer|min:1',
        ]);

        $availability = Availability::create([
            'doctor_id' => $user->id,
            ...$validated,
        ]);

        return response()->json(['availability' => $availability], 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $availability = Availability::findOrFail($id);

        if ($availability->doctor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'max_patients' => 'sometimes|integer|min:1',
        ]);

        $availability->update($validated);

        return response()->json(['availability' => $availability]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $availability = Availability::findOrFail($id);

        if ($availability->doctor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $availability->delete();

        return response()->json(['message' => 'Availability deleted']);
    }
}
