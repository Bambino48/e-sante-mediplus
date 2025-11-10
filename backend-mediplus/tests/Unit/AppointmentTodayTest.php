<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class AppointmentTodayTest extends TestCase
{
    use RefreshDatabase;

    public function test_doctor_can_get_today_appointments()
    {
        // Créer un médecin
        $doctor = User::factory()->create(['role' => 'doctor']);

        // Créer un patient
        $patient = User::factory()->create(['role' => 'patient']);

        // Créer des rendez-vous pour aujourd'hui et demain
        $today = Carbon::today();
        $tomorrow = Carbon::tomorrow();

        Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'scheduled_at' => $today->copy()->setTime(9, 0),
            'status' => 'scheduled'
        ]);

        Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'scheduled_at' => $today->copy()->setTime(14, 0),
            'status' => 'scheduled'
        ]);

        Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'scheduled_at' => $tomorrow->copy()->setTime(10, 0),
            'status' => 'scheduled'
        ]);

        // Se connecter en tant que médecin
        $this->actingAs($doctor, 'sanctum');

        // Appeler l'endpoint
        $response = $this->getJson('/api/doctor/appointments/today');

        // Vérifier la réponse
        $response->assertStatus(200)
                ->assertJsonStructure(['appointments'])
                ->assertJsonCount(2, 'appointments'); // Seulement les 2 rendez-vous d'aujourd'hui
    }
}
