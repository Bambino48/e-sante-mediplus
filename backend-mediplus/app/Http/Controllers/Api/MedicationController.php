<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medication;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MedicationController extends Controller
{
    /**
     * GET /api/medications
     * Récupérer tous les médicaments (avec filtres optionnels)
     */
    public function index(Request $request)
    {
        $query = Medication::with('prescription');

        // Filtre par prescription_id
        if ($request->has('prescription_id')) {
            $query->where('prescription_id', $request->prescription_id);
        }

        // Filtre par patient (via prescription)
        if ($request->has('patient_id')) {
            $query->whereHas('prescription', function ($q) use ($request) {
                $q->where('patient_id', $request->patient_id);
            });
        }

        $medications = $query->get();

        return response()->json([
            'message' => 'Médicaments récupérés avec succès.',
            'medications' => $medications
        ]);
    }

    /**
     * GET /api/medications/today
     * Récupérer les médicaments du jour pour le patient connecté
     */
    public function today(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'patient') {
            return response()->json(['message' => 'Accès réservé aux patients.'], 403);
        }

        $today = now()->toDateString();

        // Récupérer tous les médicaments actifs aujourd'hui
        $medications = Medication::whereHas('prescription', function ($q) use ($user) {
            $q->where('patient_id', $user->id);
        })
            ->whereDate('start_date', '<=', $today)
            ->whereRaw('DATE_ADD(start_date, INTERVAL duration_days DAY) >= ?', [$today])
            ->with('prescription')
            ->get();

        return response()->json([
            'message' => 'Médicaments du jour récupérés avec succès.',
            'date' => $today,
            'medications' => $medications
        ]);
    }

    /**
     * GET /api/medications/{id}
     * Récupérer un médicament spécifique
     */
    public function show($id)
    {
        $medication = Medication::with('prescription')->find($id);

        if (!$medication) {
            return response()->json(['message' => 'Médicament non trouvé.'], 404);
        }

        return response()->json([
            'message' => 'Médicament récupéré avec succès.',
            'medication' => $medication
        ]);
    }

    /**
     * POST /api/medications
     * Créer un nouveau médicament
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'prescription_id' => 'required|exists:prescriptions,id',
            'name' => 'required|string|max:255',
            'dosage' => 'required|string|max:100',
            'frequency' => 'required|integer|min:1',
            'times' => 'nullable|array',
            'times.*' => 'string|regex:/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/', // Format HH:MM
            'duration_days' => 'required|integer|min:1',
            'start_date' => 'required|date',
        ]);

        // Vérifier que le user a accès à cette prescription (optionnel selon votre logique métier)
        $prescription = Prescription::find($validated['prescription_id']);
        $user = Auth::user();

        if ($user->role === 'doctor' && $prescription->doctor_id !== $user->id) {
            return response()->json(['message' => 'Vous ne pouvez pas ajouter de médicaments à cette prescription.'], 403);
        }

        $medication = Medication::create($validated);

        return response()->json([
            'message' => 'Médicament créé avec succès.',
            'medication' => $medication
        ], 201);
    }

    /**
     * PUT /api/medications/{id}
     * Mettre à jour un médicament
     */
    public function update(Request $request, $id)
    {
        $medication = Medication::find($id);

        if (!$medication) {
            return response()->json(['message' => 'Médicament non trouvé.'], 404);
        }

        $validated = $request->validate([
            'prescription_id' => 'sometimes|exists:prescriptions,id',
            'name' => 'sometimes|string|max:255',
            'dosage' => 'sometimes|string|max:100',
            'frequency' => 'sometimes|integer|min:1',
            'times' => 'nullable|array',
            'times.*' => 'string|regex:/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/',
            'duration_days' => 'sometimes|integer|min:1',
            'start_date' => 'sometimes|date',
        ]);

        $medication->update($validated);

        return response()->json([
            'message' => 'Médicament mis à jour avec succès.',
            'medication' => $medication
        ]);
    }

    /**
     * DELETE /api/medications/{id}
     * Supprimer un médicament
     */
    public function destroy($id)
    {
        $medication = Medication::find($id);

        if (!$medication) {
            return response()->json(['message' => 'Médicament non trouvé.'], 404);
        }

        $medication->delete();

        return response()->json(['message' => 'Médicament supprimé avec succès.']);
    }

    /**
     * GET /api/prescriptions/{prescriptionId}/medications
     * Récupérer tous les médicaments d'une prescription
     */
    public function byPrescription($prescriptionId)
    {
        $prescription = Prescription::find($prescriptionId);

        if (!$prescription) {
            return response()->json(['message' => 'Prescription non trouvée.'], 404);
        }

        $medications = $prescription->medications;

        return response()->json([
            'message' => 'Médicaments de la prescription récupérés avec succès.',
            'prescription_id' => $prescriptionId,
            'medications' => $medications
        ]);
    }
}
