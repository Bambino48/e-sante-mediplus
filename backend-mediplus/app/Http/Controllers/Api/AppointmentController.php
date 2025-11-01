<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Availability;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'patient') {
            return response()->json(['message' => 'Only patients can book appointments'], 403);
        }

        $validated = $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'availability_id' => 'required|exists:availabilities,id',
            'reason' => 'required|string',
        ]);

        $availability = Availability::findOrFail($validated['availability_id']);

        if ($availability->doctor_id !== $validated['doctor_id']) {
            return response()->json(['message' => 'Invalid availability'], 422);
        }

        $appointment = Appointment::create([
            'patient_id' => $user->id,
            'doctor_id' => $validated['doctor_id'],
            'availability_id' => $validated['availability_id'],
            'reason' => $validated['reason'],
            'status' => 'pending',
        ]);

        return response()->json(['appointment' => $appointment], 201);
    }

    public function patientList(Request $request)
    {
        $appointments = Appointment::where('patient_id', $request->user()->id)
            ->with('doctor', 'availability')
            ->paginate(15);

        return response()->json(['appointments' => $appointments]);
    }

    public function doctorList(Request $request)
    {
        $appointments = Appointment::where('doctor_id', $request->user()->id)
            ->with('patient', 'availability')
            ->paginate(15);

        return response()->json(['appointments' => $appointments]);
    }

    public function confirm(Request $request, $id)
    {
        $user = $request->user();
        $appointment = Appointment::findOrFail($id);

        if ($appointment->doctor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment->update(['status' => 'confirmed']);

        return response()->json(['appointment' => $appointment]);
    }

    public function reject(Request $request, $id)
    {
        $user = $request->user();
        $appointment = Appointment::findOrFail($id);

        if ($appointment->doctor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment->update(['status' => 'rejected']);

        return response()->json(['appointment' => $appointment]);
    }

    public function show($id)
    {
        $appointment = Appointment::with('doctor', 'patient', 'availability')->findOrFail($id);

        return response()->json(['appointment' => $appointment]);
    }
}
