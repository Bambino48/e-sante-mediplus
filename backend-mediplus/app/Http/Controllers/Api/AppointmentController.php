<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    // GET /api/patient/appointments
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->isPatient()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $appointments = Appointment::where('patient_id', $user->id)
            ->with('doctor')
            ->orderByDesc('scheduled_at')
            ->get();

        return response()->json(['appointments' => $appointments]);
    }

    // POST /api/patient/appointments
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->isPatient()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $data = $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'scheduled_at' => 'required|date',
            'reason' => 'nullable|string',
        ]);

        $appointment = Appointment::create([
            'patient_id' => $user->id,
            'doctor_id' => $data['doctor_id'],
            'scheduled_at' => $data['scheduled_at'],
            'reason' => $data['reason'] ?? null,
        ]);

        return response()->json(['message' => 'Rendez-vous réservé', 'appointment' => $appointment], 201);
    }

    // POST /api/pro/appointments/{id}/confirm
    public function confirm(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $appointment = Appointment::where('id', $id)
            ->where('doctor_id', $user->id)
            ->firstOrFail();

        $appointment->update(['status' => 'confirmed']);
        return response()->json(['message' => 'Rendez-vous confirmé', 'appointment' => $appointment]);
    }
}
