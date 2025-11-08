<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    // GET /api/patient/consultations/recent
    public function recent(Request $request)
    {
        $user = $request->user();
        if (!$user->isPatient()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $recentConsultations = Consultation::where('patient_id', $user->id)
            ->where('status', 'completed')
            ->with(['doctor', 'appointment', 'teleconsultRoom'])
            ->orderByDesc('consultation_date')
            ->limit(10)
            ->get();

        return response()->json(['consultations' => $recentConsultations]);
    }
}
