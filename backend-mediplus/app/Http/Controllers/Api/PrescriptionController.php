<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    // POST /api/pro/prescriptions
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $data = $request->validate([
            'patient_id' => 'required|exists:users,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'content' => 'required|array',
        ]);

        $prescription = Prescription::create([
            'doctor_id' => $user->id,
            'patient_id' => $data['patient_id'],
            'appointment_id' => $data['appointment_id'] ?? null,
            'content' => $data['content'],
        ]);

        return response()->json(['message' => 'Ordonnance créée', 'prescription' => $prescription], 201);
    }

    // GET /api/patient/prescriptions
    public function patientList(Request $request)
    {
        $user = $request->user();
        if (!$user->isPatient()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $prescriptions = Prescription::where('patient_id', $user->id)->get();
        return response()->json(['prescriptions' => $prescriptions]);
    }

    // GET /api/patient/prescriptions/{id}/download
    public function download($id)
    {
        $prescription = Prescription::findOrFail($id);
        // Simulation (dans la version finale tu génères un PDF)
        return response()->json(['message' => 'PDF prêt', 'file' => '/storage/prescriptions/' . $prescription->id . '.pdf']);
    }
}
