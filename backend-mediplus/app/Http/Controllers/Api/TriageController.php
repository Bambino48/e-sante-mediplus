<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TriageSession;
use Illuminate\Http\Request;

class TriageController extends Controller
{
    // POST /api/triage
    public function analyze(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'symptoms' => 'required|array',
        ]);

        // Simule un diagnostic IA
        $result = [
            'diagnostic' => 'Infection virale probable',
            'urgence' => 'faible',
            'recommendations' => ['Reposez-vous', 'Hydratez-vous bien'],
        ];

        $session = TriageSession::create([
            'patient_id' => $user->id,
            'symptoms' => $data['symptoms'],
            'result' => $result,
        ]);

        return response()->json(['triage' => $session]);
    }

    // GET /api/triage/history
    public function history(Request $request)
    {
        $user = $request->user();
        $sessions = TriageSession::where('patient_id', $user->id)->get();
        return response()->json(['history' => $sessions]);
    }
}
