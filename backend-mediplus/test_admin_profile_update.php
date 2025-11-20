<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Http;

echo '=== TEST API ADMIN PROFILE UPDATE ===' . PHP_EOL;

// Créer un token pour l'admin (simulé)
$user = (object) [
    'id' => 1,
    'name' => 'Administrateur MediPlus',
    'email' => 'admin@mediplus.ci'
];
$token = 'test-admin-token'; // Token simulé pour les tests

echo 'Token admin: ' . $token . PHP_EOL;

// Tester la mise à jour du profil avec photo (base64 simulé)
try {
    $testData = [
        'name' => 'Administrateur MediPlus',
        'email' => 'admin@mediplus.ci',
        'phone' => '+225 01 02 03 04 05',
        'bio' => 'Administrateur principal de la plateforme MediPlus.',
        'location' => 'Abidjan, Côte d\'Ivoire',
        'timezone' => 'Africa/Abidjan',
        'language' => 'fr',
        'notifications' => [
            'email' => true,
            'reports' => true,
            'system_alerts' => true,
            'user_registrations' => false,
        ],
        'photo' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' // Image PNG 1x1 pixel transparente
    ];

    $response = Http::withToken($token)->put('http://127.0.0.1:8000/api/admin/profile', $testData);
    $data = $response->json();

    echo 'Status: ' . $response->status() . PHP_EOL;

    if ($response->successful()) {
        echo 'Profil mis à jour avec succès!' . PHP_EOL;
        echo 'Message: ' . ($data['message'] ?? 'Aucun message') . PHP_EOL;
        if (isset($data['profile'])) {
            echo 'Photo URL: ' . ($data['profile']['photo_url'] ?? 'null') . PHP_EOL;
        }
    } else {
        echo 'Erreur lors de la mise à jour:' . PHP_EOL;
        echo 'Message: ' . ($data['message'] ?? 'Erreur inconnue') . PHP_EOL;
        if (isset($data['errors'])) {
            echo 'Erreurs de validation:' . PHP_EOL;
            foreach ($data['errors'] as $field => $errors) {
                echo "- $field: " . implode(', ', $errors) . PHP_EOL;
            }
        }
    }
} catch (Exception $e) {
    echo 'Erreur de connexion: ' . $e->getMessage() . PHP_EOL;
}

echo PHP_EOL . '=== FIN DU TEST ===' . PHP_EOL;
