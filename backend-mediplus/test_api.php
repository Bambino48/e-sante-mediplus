<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Http;

echo '=== TEST API RENDEZ-VOUS ===' . PHP_EOL;

// Créer un token pour le patient ID 1
$user = App\Models\User::find(1);
$token = $user->createToken('test-token')->plainTextToken;
echo 'Token créé: ' . substr($token, 0, 20) . '...' . PHP_EOL;

// Tester l'API
try {
    $response = Http::withToken($token)->get('http://127.0.0.1:8000/api/patient/appointments/next');
    $data = $response->json();

    echo 'Status: ' . $response->status() . PHP_EOL;

    if (isset($data['appointment'])) {
        $appointment = $data['appointment'];
        echo 'Rendez-vous trouvé:' . PHP_EOL;
        echo '- ID: ' . $appointment['id'] . PHP_EOL;
        echo '- Docteur: ' . ($appointment['doctor_name'] ?? 'Dr ' . $appointment['doctor_id']) . PHP_EOL;
        echo '- Date: ' . $appointment['scheduled_at'] . PHP_EOL;
        echo '- Statut: ' . $appointment['status'] . PHP_EOL;
    } else {
        echo 'Aucun rendez-vous trouvé' . PHP_EOL;
    }
} catch (Exception $e) {
    echo 'Erreur: ' . $e->getMessage() . PHP_EOL;
}
