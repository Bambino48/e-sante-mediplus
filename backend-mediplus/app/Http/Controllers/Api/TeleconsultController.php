<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teleconsult;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TeleconsultController extends Controller
{
    public function create(Request $request)
    {
        $validated = $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
        ]);

        $teleconsult = Teleconsult::create([
            'user_id' => $request->user()->id,
            'appointment_id' => $validated['appointment_id'],
            'room_id' => Str::uuid(),
            'status' => 'active',
            'started_at' => now(),
        ]);

        return response()->json(['teleconsult' => $teleconsult], 201);
    }

    public function getToken(Request $request, $roomId)
    {
        $teleconsult = Teleconsult::where('room_id', $roomId)->firstOrFail();

        // Générer un token pour Jitsi/Agora (exemple)
        $token = hash_hmac('sha256', $roomId, env('TELECONSULT_SECRET'));

        return response()->json(['token' => $token, 'room_id' => $roomId]);
    }

    public function end(Request $request, $roomId)
    {
        $teleconsult = Teleconsult::where('room_id', $roomId)->firstOrFail();

        $teleconsult->update([
            'status' => 'ended',
            'ended_at' => now(),
        ]);

        return response()->json(['message' => 'Teleconsult ended', 'teleconsult' => $teleconsult]);
    }

    public function history(Request $request)
    {
        $history = Teleconsult::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(15);

        return response()->json(['history' => $history]);
    }
}
