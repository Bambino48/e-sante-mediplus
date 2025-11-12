<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use App\Models\User;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    // GET /api/doctor/availabilities
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $availabilities = Availability::where('doctor_id', $user->id)->get();
        return response()->json(['availabilities' => $availabilities]);
    }

    // POST /api/doctor/availabilities
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $data = $request->validate([
            'day_of_week' => 'nullable|integer|min:1|max:7',
            'date' => 'nullable|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'is_recurring' => 'boolean',
        ]);

        // Validation métier : cohérence entre is_recurring, date et day_of_week
        if (($data['is_recurring'] ?? true) && isset($data['date'])) {
            return response()->json([
                'message' => 'Une disponibilité récurrente ne peut pas avoir de date spécifique'
            ], 422);
        }

        if (!(($data['is_recurring'] ?? true)) && !isset($data['date'])) {
            return response()->json([
                'message' => 'Une disponibilité non récurrente doit avoir une date spécifique'
            ], 422);
        }

        if (($data['is_recurring'] ?? true) && !isset($data['day_of_week'])) {
            return response()->json([
                'message' => 'Une disponibilité récurrente doit avoir un jour de la semaine'
            ], 422);
        }

        if (!(($data['is_recurring'] ?? true)) && isset($data['day_of_week'])) {
            return response()->json([
                'message' => 'Une disponibilité non récurrente ne peut pas avoir de jour de la semaine'
            ], 422);
        }

        $availability = Availability::create([
            'doctor_id' => $user->id,
            ...$data
        ]);

        return response()->json([
            'message' => 'Disponibilité ajoutée avec succès',
            'availability' => $availability
        ], 201);
    }

    // PUT /api/doctor/availabilities/:id
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $availability = Availability::where('doctor_id', $user->id)->findOrFail($id);

        $data = $request->validate([
            'day_of_week' => 'nullable|integer|min:1|max:7',
            'date' => 'nullable|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'is_recurring' => 'boolean',
        ]);

        // Validation métier : cohérence entre is_recurring, date et day_of_week
        if (($data['is_recurring'] ?? $availability->is_recurring) && isset($data['date'])) {
            return response()->json([
                'message' => 'Une disponibilité récurrente ne peut pas avoir de date spécifique'
            ], 422);
        }

        if (!(($data['is_recurring'] ?? $availability->is_recurring)) && !isset($data['date']) && is_null($availability->date)) {
            return response()->json([
                'message' => 'Une disponibilité non récurrente doit avoir une date spécifique'
            ], 422);
        }

        if (($data['is_recurring'] ?? $availability->is_recurring) && !isset($data['day_of_week']) && is_null($availability->day_of_week)) {
            return response()->json([
                'message' => 'Une disponibilité récurrente doit avoir un jour de la semaine'
            ], 422);
        }

        if (!(($data['is_recurring'] ?? $availability->is_recurring)) && isset($data['day_of_week'])) {
            return response()->json([
                'message' => 'Une disponibilité non récurrente ne peut pas avoir de jour de la semaine'
            ], 422);
        }

        $availability->update($data);

        return response()->json([
            'message' => 'Disponibilité mise à jour avec succès',
            'availability' => $availability
        ]);
    }

    // DELETE /api/doctor/availabilities/:id
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $availability = Availability::where('doctor_id', $user->id)->findOrFail($id);
        $availability->delete();

        return response()->json([
            'message' => 'Disponibilité supprimée avec succès'
        ]);
    }

    // GET /api/doctors/{doctorId}/availabilities - Route publique pour les patients
    public function show($doctorId)
    {
        // Récupérer les informations du médecin
        $doctor = User::where('role', 'doctor')
            ->with('doctorProfile')
            ->findOrFail($doctorId);

        // Récupérer les disponibilités du médecin
        $availabilities = Availability::where('doctor_id', $doctorId)->get();

        // Générer les slots pour les 7 prochains jours
        $slots = $this->generateAvailableSlots($availabilities);

        return response()->json([
            'doctor' => [
                'id' => $doctor->id,
                'name' => $doctor->name,
                'specialty' => $doctor->doctorProfile?->specialty ?? $doctor->doctorProfile?->primary_specialty ?? 'Médecine générale',
                'fees' => $doctor->doctorProfile?->fees ?? 0
            ],
            'slots' => $slots
        ]);
    }

    private function generateAvailableSlots($availabilities)
    {
        $slots = [];
        $now = now();
        $endDate = now()->addDays(7);

        // Pour chaque jour de la semaine prochaine
        for ($date = $now->copy(); $date->lte($endDate); $date->addDay()) {
            $dayOfWeek = $date->dayOfWeekIso; // 1 = Lundi, 7 = Dimanche
            $dateKey = $date->toDateString();

            $daySlots = [];

            // Trouver les disponibilités pour ce jour
            foreach ($availabilities as $availability) {
                if ($availability->is_recurring && $availability->day_of_week == $dayOfWeek) {
                    // Disponibilité récurrente
                    $daySlots = array_merge($daySlots, $this->generateTimeSlots(
                        $availability->start_time,
                        $availability->end_time
                    ));
                } elseif (!$availability->is_recurring && $availability->date == $dateKey) {
                    // Disponibilité ponctuelle
                    $daySlots = array_merge($daySlots, $this->generateTimeSlots(
                        $availability->start_time,
                        $availability->end_time
                    ));
                }
            }

            // Trier et dédupliquer les slots
            $daySlots = array_unique($daySlots);
            sort($daySlots);

            // Pour aujourd'hui, filtrer les slots passés
            if ($date->isToday()) {
                $currentTime = $now->format('H:i');
                $daySlots = array_filter($daySlots, function ($slot) use ($currentTime) {
                    return $slot > $currentTime;
                });
            }

            if (!empty($daySlots)) {
                $slots[$dateKey] = array_values($daySlots);
            }
        }

        return $slots;
    }

    private function generateTimeSlots($startTime, $endTime)
    {
        $slots = [];
        $start = \Carbon\Carbon::createFromFormat('H:i:s', $startTime);
        $end = \Carbon\Carbon::createFromFormat('H:i:s', $endTime);

        while ($start->lt($end)) {
            $slots[] = $start->format('H:i');
            $start->addMinutes(30); // Slots de 30 minutes
        }

        return $slots;
    }
}
