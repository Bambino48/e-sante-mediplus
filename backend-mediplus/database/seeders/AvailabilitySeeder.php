<?php

namespace Database\Seeders;

use App\Models\Availability;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AvailabilitySeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Trouver un médecin existant ou en créer un
        $doctor = User::where('email', 'test@example.com')->first();
        if (!$doctor) {
            $doctor = User::factory()->create([
                'name' => 'Dr Marie Kouassi',
                'email' => 'marie.kouassi@example.com',
            ]);
        }

        // Créer des disponibilités récurrentes (lundi à vendredi, 9h-17h)
        for ($day = 1; $day <= 5; $day++) { // Lundi = 1, Vendredi = 5
            Availability::create([
                'doctor_id' => $doctor->id,
                'is_recurring' => true,
                'day_of_week' => $day,
                'start_time' => '09:00:00',
                'end_time' => '17:00:00',
            ]);
        }

        // Créer quelques disponibilités ponctuelles pour les prochains jours
        $nextMonday = now()->next(1); // Prochain lundi
        Availability::create([
            'doctor_id' => $doctor->id,
            'is_recurring' => false,
            'date' => $nextMonday->toDateString(),
            'start_time' => '14:00:00',
            'end_time' => '18:00:00',
        ]);

        $this->command->info('Disponibilités créées pour le médecin: ' . $doctor->name);
    }
}
