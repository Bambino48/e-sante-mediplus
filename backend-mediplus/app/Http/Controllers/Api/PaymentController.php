<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function create(Request $request)
    {
        $validated = $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:card,mobile_money,bank',
        ]);

        $payment = Payment::create([
            'user_id' => $request->user()->id,
            'appointment_id' => $validated['appointment_id'],
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'status' => 'pending',
            'transaction_id' => uniqid(),
        ]);

        return response()->json(['payment' => $payment], 201);
    }

    public function verify(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:payments,transaction_id',
        ]);

        $payment = Payment::where('transaction_id', $validated['transaction_id'])->firstOrFail();

        // Vérifier auprès du gateway de paiement
        $payment->update(['status' => 'completed']);

        return response()->json(['payment' => $payment]);
    }

    public function history(Request $request)
    {
        $payments = Payment::where('user_id', $request->user()->id)
            ->paginate(15);

        return response()->json(['payments' => $payments]);
    }

    public function billing(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'doctor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $billing = Payment::whereHas('appointment', function ($q) use ($user) {
            $q->where('doctor_id', $user->id);
        })->sum('amount');

        return response()->json(['total_revenue' => $billing]);
    }
}
