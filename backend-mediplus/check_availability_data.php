<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$profiles = \App\Models\DoctorProfile::whereNotNull('availability')->take(3)->get();

echo "Profils avec disponibilités:\n";
echo "===========================\n";

foreach ($profiles as $profile) {
    $user = \App\Models\User::find($profile->user_id);
    echo "\n{$user->name} ({$profile->primary_specialty}):\n";
    echo "Availability: " . $profile->availability . "\n";

    $availability = json_decode($profile->availability, true);
    if ($availability && isset($availability['schedules'])) {
        foreach ($availability['schedules'] as $schedule) {
            echo "  {$schedule['day']}: {$schedule['start']} - {$schedule['end']}\n";
        }
    }
}
