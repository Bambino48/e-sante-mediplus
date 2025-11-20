<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Http\Request;

echo "=== TEST API ADMIN PROFILE ===\n";

try {
    // Simuler un utilisateur admin
    $user = User::where('email', 'admin@mediplus.com')->first();
    if (!$user) {
        echo "Utilisateur admin non trouvé. Création d'un utilisateur de test...\n";
        $user = User::first(); // Utiliser le premier utilisateur disponible
    }

    echo "Utilisateur test: " . $user->name . " (" . $user->email . ")\n";

    // Créer une requête simulée
    $request = new Request();
    $request->setUserResolver(function () use ($user) {
        return $user;
    });

    // Appeler le contrôleur
    $controller = new AdminController();
    $response = $controller->getProfile($request);

    // Afficher le résultat
    $result = json_decode($response->getContent(), true);
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Résultat de l'API /api/admin/profile :\n";
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
}

echo "\n=== FIN DU TEST ===\n";
