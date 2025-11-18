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

        $prescriptions = Prescription::where('patient_id', $user->id)
            ->with(['doctor:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($prescription) {
                return [
                    'id' => $prescription->id,
                    'doctor_id' => $prescription->doctor_id,
                    'doctor_name' => $prescription->doctor->name ?? 'Médecin',
                    'created_at' => $prescription->created_at,
                    'medications' => $prescription->content ?? [],
                    'pdf_url' => $prescription->pdf_path ? asset('storage/' . $prescription->pdf_path) : null,
                    'qr_data' => $prescription->id,
                ];
            });

        return response()->json(['items' => $prescriptions]);
    }

    // GET /api/patient/prescriptions/{id}/download
    public function download($id)
    {
        $prescription = Prescription::findOrFail($id);
        // Simulation (dans la version finale tu génères un PDF)
        return response()->json(['message' => 'PDF prêt', 'file' => '/storage/prescriptions/' . $prescription->id . '.pdf']);
    }

    /**
     * GET /api/patient/prescriptions/active
     * Liste des prescriptions actives pour le patient
     */
    public function active(Request $request)
    {
        $user = $request->user();
        if (!$user->isPatient()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        // Récupérer les prescriptions du patient (pas de colonne status/end_date dans la table actuelle)
        $activePrescriptions = Prescription::where('patient_id', $user->id)
            ->with(['doctor:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($prescription) {
                return [
                    'id' => $prescription->id,
                    'doctor_id' => $prescription->doctor_id,
                    'doctor_name' => $prescription->doctor->name ?? 'Médecin',
                    'created_at' => $prescription->created_at,
                    'medications' => $prescription->content ?? [],
                    'pdf_url' => $prescription->pdf_path ? asset('storage/' . $prescription->pdf_path) : null,
                    'qr_data' => $prescription->id,
                ];
            });

        return response()->json([
            'message' => 'Prescriptions récupérées avec succès',
            'items' => $activePrescriptions
        ]);
    }

    /**
     * GET /api/pro/prescriptions
     * Liste des prescriptions créées par le docteur connecté
     */
    public function doctorList(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $prescriptions = Prescription::where('doctor_id', $user->id)
            ->with(['patient:id,name,email', 'doctor:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($prescription) {
                return [
                    'id' => $prescription->id,
                    'doctor_id' => $prescription->doctor_id,
                    'doctor_name' => $prescription->doctor->name ?? 'Médecin',
                    'patient_id' => $prescription->patient_id,
                    'patient_name' => $prescription->patient->name ?? 'Patient',
                    'created_at' => $prescription->created_at,
                    'medications' => $prescription->content ?? [],
                    'pdf_url' => $prescription->pdf_path ? asset('storage/' . $prescription->pdf_path) : null,
                    'qr_data' => $prescription->id,
                ];
            });

        return response()->json([
            'message' => 'Prescriptions récupérées avec succès',
            'items' => $prescriptions
        ]);
    }

    /**
     * PUT /api/pro/prescriptions/{id}
     * Modifier une prescription (médecin uniquement)
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $prescription = Prescription::where('doctor_id', $user->id)->findOrFail($id);

        $data = $request->validate([
            'patient_id' => 'sometimes|exists:users,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'content' => 'sometimes|array',
        ]);

        $prescription->update($data);

        return response()->json([
            'message' => 'Ordonnance mise à jour avec succès',
            'prescription' => $prescription
        ]);
    }

    /**
     * DELETE /api/pro/prescriptions/{id}
     * Supprimer une prescription (médecin uniquement)
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $prescription = Prescription::where('doctor_id', $user->id)->findOrFail($id);
        $prescription->delete();

        return response()->json(['message' => 'Ordonnance supprimée avec succès']);
    }

    /**
     * GET /api/pro/prescriptions/{id}
     * Afficher une prescription spécifique (médecin uniquement)
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $prescription = Prescription::where('doctor_id', $user->id)
            ->with(['patient:id,name,email', 'doctor:id,name,email'])
            ->findOrFail($id);

        return response()->json([
            'prescription' => [
                'id' => $prescription->id,
                'doctor_id' => $prescription->doctor_id,
                'doctor_name' => $prescription->doctor->name ?? 'Médecin',
                'patient_id' => $prescription->patient_id,
                'patient_name' => $prescription->patient->name ?? 'Patient',
                'created_at' => $prescription->created_at,
                'updated_at' => $prescription->updated_at,
                'medications' => $prescription->content ?? [],
                'pdf_url' => $prescription->pdf_path ? asset('storage/' . $prescription->pdf_path) : null,
                'qr_data' => $prescription->id,
            ]
        ]);
    }
}
