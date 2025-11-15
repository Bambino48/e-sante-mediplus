<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // POST /api/payment/create
    public function create(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'amount' => 'required|integer|min:500',
        ]);

        $payment = Payment::create([
            'patient_id' => $user->id,
            'doctor_id' => $data['doctor_id'],
            'amount' => $data['amount'],
            'status' => 'initiated',
            'provider' => 'MoneyFusion',
        ]);

        return response()->json(['payment' => $payment]);
    }

    // POST /api/payment/verify
    public function verify(Request $request)
    {
        $data = $request->validate([
            'reference' => 'required|string',
        ]);

        $payment = Payment::where('reference', $data['reference'])->firstOrFail();
        $payment->update(['status' => 'success']);

        return response()->json(['message' => 'Paiement confirmé', 'payment' => $payment]);
    }

    // GET /api/pro/billing
    public function billing(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $payments = Payment::where('doctor_id', $user->id)
            ->where('status', 'success')
            ->get();

        $total = $payments->sum('amount');

        return response()->json([
            'total_revenu' => $total,
            'paiements' => $payments
        ]);
    }

    /**
     * GET /api/patient/payments/pending
     * Liste des paiements en attente pour le patient
     */
    public function pending(Request $request)
    {
        $user = $request->user();
        if (!$user->isPatient()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $pendingPayments = Payment::where('patient_id', $user->id)
            ->where('status', 'initiated')
            ->get();

        return response()->json([
            'message' => 'Paiements en attente récupérés avec succès',
            'items' => $pendingPayments
        ]);
    }
}
