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
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->isPatient()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $appointment = Appointment::where('id', $id)
            ->where('patient_id', $user->id)
            ->firstOrFail();

        // Ne peut pas modifier un rendez-vous déjà terminé ou annulé
        if (in_array($appointment->status, ['completed', 'cancelled'])) {
            return response()->json(['message' => 'Impossible de modifier ce rendez-vous'], 422);
        }

        $data = $request->validate([
            'scheduled_at' => 'sometimes|date|after:now',
            'reason' => 'nullable|string',
        ]);

        $appointment->update($data);

        return response()->json(['message' => 'Rendez-vous modifié', 'appointment' => $appointment]);
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

        // Ne peut pas annuler un rendez-vous déjà terminé
        if ($appointment->status === 'completed') {
            return response()->json(['message' => 'Impossible d\'annuler un rendez-vous terminé'], 422);
        }

        // Ne peut pas annuler un rendez-vous déjà annulé
        if ($appointment->status === 'cancelled') {
            return response()->json(['message' => 'Ce rendez-vous est déjà annulé'], 422);
        }

        $appointment->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Rendez-vous annulé', 'appointment' => $appointment]);
    }
}
