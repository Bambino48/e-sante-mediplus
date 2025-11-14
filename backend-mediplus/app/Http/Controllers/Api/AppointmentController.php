<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
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

    // GET /api/patient/appointments/next
    public function next(Request $request)
    {
        $user = $request->user();
        if (!$user->isPatient()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $nextAppointment = Appointment::where('patient_id', $user->id)
            ->where('scheduled_at', '>', now())
            ->where('status', '!=', 'cancelled')
            ->with('doctor')
            ->orderBy('scheduled_at', 'asc')
            ->first();

        return response()->json(['appointment' => $nextAppointment]);
    }

    // POST /api/patient/appointments
    public function store(StoreAppointmentRequest $request)
    {
        $user = $request->user();
        if (!$user->isPatient()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $validated = $request->validated();

        $appointment = Appointment::create([
            'patient_id' => $user->id,
            'doctor_id' => $validated['doctor_id'],
            'scheduled_at' => $validated['scheduled_at'],
            'reason' => $validated['reason'],
            'mode' => $validated['mode'],
            'duration' => $validated['duration'] ?? 30, // durée par défaut 30 minutes
        ]);

        return response()->json([
            'message' => 'Rendez-vous réservé avec succès',
            'appointment' => $appointment->load('doctor')
        ], 201);
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

    // GET /api/pro/appointments
    public function doctorAppointments(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $appointments = Appointment::where('doctor_id', $user->id)
            ->with('patient')
            ->orderByDesc('scheduled_at')
            ->get();

        return response()->json(['appointments' => $appointments]);
    }

    // GET /api/doctor/appointments/today
    public function doctorAppointmentsToday(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $today = now()->toDateString();

        $appointments = Appointment::where('doctor_id', $user->id)
            ->whereDate('scheduled_at', $today)
            ->with('patient')
            ->orderBy('scheduled_at')
            ->get();

        return response()->json(['appointments' => $appointments]);
    }

    // PUT /api/patient/appointments/{id}
    public function update(UpdateAppointmentRequest $request, $id)
    {
        $user = $request->user();
        if (!$user->isPatient()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $appointment = Appointment::where('id', $id)
            ->where('patient_id', $user->id)
            ->firstOrFail();

        // Vérifier si le rendez-vous peut être modifié
        if (!$appointment->canBeRescheduled()) {
            return response()->json([
                'message' => 'Ce rendez-vous ne peut plus être modifié'
            ], 422);
        }

        $validated = $request->validated();
        $appointment->update($validated);

        return response()->json([
            'message' => 'Rendez-vous modifié avec succès',
            'appointment' => $appointment->load('doctor')
        ]);
    }

    // DELETE /api/patient/appointments/{id}
    public function cancel(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->isPatient()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $appointment = Appointment::where('id', $id)
            ->where('patient_id', $user->id)
            ->firstOrFail();

        // Vérifier si le rendez-vous peut être annulé
        if (!$appointment->canBeCancelled()) {
            return response()->json([
                'message' => 'Ce rendez-vous ne peut plus être annulé'
            ], 422);
        }

        $reason = $request->input('cancellation_reason');
        $appointment->cancel($reason);

        return response()->json([
            'message' => 'Rendez-vous annulé avec succès',
            'appointment' => $appointment->load('doctor')
        ]);
    }
}
