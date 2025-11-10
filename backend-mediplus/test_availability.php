<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Test de création d'une disponibilité avec date...\n";

$data = [
    'doctor_id' => 1,
    'is_recurring' => false,
    'date' => '2025-11-15',
    'start_time' => '09:00',
    'end_time' => '17:00'
];

try {
    $availability = App\Models\Availability::create($data);
    echo '✅ Création réussie!' . PHP_EOL;
    echo 'ID: ' . $availability->id . PHP_EOL;
    echo 'Date: ' . $availability->date . PHP_EOL;
    echo 'is_recurring: ' . ($availability->is_recurring ? 'true' : 'false') . PHP_EOL;
    echo 'start_time: ' . $availability->start_time . PHP_EOL;
    echo 'end_time: ' . $availability->end_time . PHP_EOL;
} catch (Exception $e) {
    echo '❌ Erreur: ' . $e->getMessage() . PHP_EOL;
}

echo "\nTest de création d'une disponibilité récurrente...\n";

$data2 = [
    'doctor_id' => 1,
    'is_recurring' => true,
    'day_of_week' => 1,
    'start_time' => '09:00',
    'end_time' => '17:00'
];

try {
    $availability2 = App\Models\Availability::create($data2);
    echo '✅ Création réussie!' . PHP_EOL;
    echo 'ID: ' . $availability2->id . PHP_EOL;
    echo 'Date: ' . ($availability2->date ?? 'null') . PHP_EOL;
    echo 'day_of_week: ' . $availability2->day_of_week . PHP_EOL;
    echo 'is_recurring: ' . ($availability2->is_recurring ? 'true' : 'false') . PHP_EOL;
} catch (Exception $e) {
    echo '❌ Erreur: ' . $e->getMessage() . PHP_EOL;
}
