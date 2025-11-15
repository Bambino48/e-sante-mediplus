<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Models\Appointment;
use App\Models\NotificationCustom;
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

        // Ajouter le nom du docteur directement dans chaque rendez-vous
        $appointments->each(function ($appointment) {
            if ($appointment->doctor) {
                $appointment->doctor_name = $appointment->doctor->name;
            }
        });

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

        // Ajouter le nom du docteur directement dans la réponse
        if ($nextAppointment && $nextAppointment->doctor) {
            $nextAppointment->doctor_name = $nextAppointment->doctor->name;
        }

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

        // Créer une notification pour le médecin
        NotificationCustom::create([
            'user_id' => $validated['doctor_id'],
            'type' => 'appointment_requested',
            'data' => [
                'appointment_id' => $appointment->id,
                'patient_name' => $user->name,
                'scheduled_at' => $appointment->scheduled_at,
                'reason' => $appointment->reason,
                'message' => 'Un nouveau rendez-vous a été demandé'
            ]
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

        // Créer une notification pour le patient
        NotificationCustom::create([
            'user_id' => $appointment->patient_id,
            'type' => 'appointment_confirmed',
            'data' => [
                'appointment_id' => $appointment->id,
                'doctor_name' => $user->name,
                'scheduled_at' => $appointment->scheduled_at,
                'message' => 'Votre rendez-vous a été confirmé par le médecin'
            ]
        ]);

        return response()->json(['message' => 'Rendez-vous confirmé', 'appointment' => $appointment]);
    }

    // POST /api/pro/appointments/{id}/reject
    public function reject(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $appointment = Appointment::where('id', $id)
            ->where('doctor_id', $user->id)
            ->firstOrFail();

        $appointment->update(['status' => 'cancelled']);

        // Créer une notification pour le patient
        NotificationCustom::create([
            'user_id' => $appointment->patient_id,
            'type' => 'appointment_rejected',
            'data' => [
                'appointment_id' => $appointment->id,
                'doctor_name' => $user->name,
                'scheduled_at' => $appointment->scheduled_at,
                'message' => 'Votre rendez-vous a été refusé par le médecin'
            ]
        ]);

        return response()->json(['message' => 'Rendez-vous refusé', 'appointment' => $appointment]);
    }

    // GET /api/pro/appointments
    public function doctorAppointments(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $appointments = Appointment::where('doctor_id', $user->id)
            ->with(['patient:id,name,email', 'doctor:id,name,email'])
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

    /**
     * GET /api/patient/appointments/upcoming
     * Liste des rendez-vous à venir pour le patient
     */
    public function upcoming(Request $request)
    {
        $user = $request->user();
        if (!$user->isPatient()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $upcomingAppointments = Appointment::where('patient_id', $user->id)
            ->where('scheduled_at', '>', now())
            ->where('status', '!=', 'cancelled')
            ->with('doctor')
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return response()->json([
            'message' => 'Rendez-vous à venir récupérés avec succès',
            'appointments' => $upcomingAppointments
        ]);
    }
}
