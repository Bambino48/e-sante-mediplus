<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;
use PDF;

class PrescriptionController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'doctor') {
            return response()->json(['message' => 'Only doctors can create prescriptions'], 403);
        }

        $validated = $request->validate([
            'patient_id' => 'required|exists:users,id',
            'medications' => 'required|array',
            'medications.*.name' => 'required|string',
            'medications.*.dosage' => 'required|string',
            'medications.*.duration' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $prescription = Prescription::create([
            'doctor_id' => $user->id,
            'patient_id' => $validated['patient_id'],
            'medications' => json_encode($validated['medications']),
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json(['prescription' => $prescription], 201);
    }

    public function patientList(Request $request)
    {
        $prescriptions = Prescription::where('patient_id', $request->user()->id)
            ->with('doctor')
            ->paginate(15);

        return response()->json(['prescriptions' => $prescriptions]);
    }

    public function show($id)
    {
        $prescription = Prescription::with('doctor', 'patient')->findOrFail($id);

        return response()->json(['prescription' => $prescription]);
    }

    public function download($id)
    {
        $prescription = Prescription::findOrFail($id);

        $pdf = PDF::loadView('prescriptions.pdf', ['prescription' => $prescription]);

        return $pdf->download("prescription_{$id}.pdf");
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $prescription = Prescription::findOrFail($id);

        if ($prescription->doctor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'medications' => 'sometimes|array',
            'notes' => 'sometimes|string',
        ]);

        $prescription->update($validated);

        return response()->json(['prescription' => $prescription]);
    }
}
