<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeleconsultRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TeleconsultController extends Controller
{
    // POST /api/teleconsult/create
    public function create(Request $request)
    {
        $data = $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'patient_id' => 'required|exists:users,id',
        ]);

        $roomId = 'room_' . Str::random(10);

        $room = TeleconsultRoom::create([
            'room_id' => $roomId,
            'doctor_id' => $data['doctor_id'],
            'patient_id' => $data['patient_id'],
            'status' => 'active',
            'started_at' => now(),
        ]);

        return response()->json(['room' => $room]);
    }

    // GET /api/teleconsult/token/{roomId}
    public function token($roomId)
    {
        $room = TeleconsultRoom::where('room_id', $roomId)->firstOrFail();
        $token = Str::uuid();

        return response()->json(['room_id' => $roomId, 'token' => $token]);
    }

    // POST /api/teleconsult/end/{roomId}
    public function end($roomId)
    {
        $room = TeleconsultRoom::where('room_id', $roomId)->firstOrFail();
        $room->update(['status' => 'ended', 'ended_at' => now()]);
        return response()->json(['message' => 'Session terminée']);
    }
}
