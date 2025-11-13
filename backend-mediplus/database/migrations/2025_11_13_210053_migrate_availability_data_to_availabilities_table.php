<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\DoctorProfile;
use App\Models\Availability;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Mapping des jours français vers les numéros de jour de la semaine (1=Lundi, 7=Dimanche)
        $dayMapping = [
            'Lundi' => 1,
            'Mardi' => 2,
            'Mercredi' => 3,
            'Jeudi' => 4,
            'Vendredi' => 5,
            'Samedi' => 6,
            'Dimanche' => 7,
        ];

        // Récupérer tous les profils avec des données availability
        $profiles = DoctorProfile::whereNotNull('availability')->get();

        foreach ($profiles as $profile) {
            $availabilityData = json_decode($profile->availability, true);

            if ($availabilityData && isset($availabilityData['schedules'])) {
                foreach ($availabilityData['schedules'] as $schedule) {
                    if (isset($schedule['day']) && isset($dayMapping[$schedule['day']])) {
                        Availability::create([
                            'doctor_id' => $profile->user_id,
                            'is_recurring' => true,
                            'day_of_week' => $dayMapping[$schedule['day']],
                            'start_time' => $schedule['start'],
                            'end_time' => $schedule['end'],
                            'date' => null,
                        ]);
                    }
                }
            }
        }

        // Supprimer la colonne availability
        Schema::table('doctor_profiles', function (Blueprint $table) {
            $table->dropColumn('availability');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remettre la colonne availability
        Schema::table('doctor_profiles', function (Blueprint $table) {
            $table->json('availability')->nullable()->after('bio');
        });

        // Note: Les données ne peuvent pas être restaurées automatiquement
        // car elles ont été transformées en structure normalisée
    }
};
