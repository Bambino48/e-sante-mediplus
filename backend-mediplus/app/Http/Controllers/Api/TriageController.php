<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Triage;
use Illuminate\Http\Request;

class TriageController extends Controller
{
    public function analyze(Request $request)
    {
        $validated = $request->validate([
            'symptoms' => 'required|array',
            'duration' => 'required|string',
            'severity' => 'required|in:mild,moderate,severe',
        ]);

        // Appel à un service IA (exemple : OpenAI)
        $analysis = $this->callAIService($validated);

        $triage = Triage::create([
            'user_id' => $request->user()->id,
            'symptoms' => json_encode($validated['symptoms']),
            'duration' => $validated['duration'],
            'severity' => $validated['severity'],
            'analysis' => $analysis,
            'recommendation' => $this->getRecommendation($analysis),
        ]);

        return response()->json(['triage' => $triage], 201);
    }

    public function history(Request $request)
    {
        $history = Triage::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(15);

        return response()->json(['history' => $history]);
    }

    public function show($id)
    {
        $triage = Triage::findOrFail($id);

        return response()->json(['triage' => $triage]);
    }

    private function callAIService($data)
    {
        // Implémentation appel IA
        return "Based on symptoms, consider consulting a specialist.";
    }

    private function getRecommendation($analysis)
    {
        return "See a doctor";
    }
}
