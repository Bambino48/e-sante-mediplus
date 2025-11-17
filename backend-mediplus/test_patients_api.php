<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Http\Controllers\Api\DoctorController;
use Illuminate\Http\Request;

// Simuler un utilisateur médecin
$user = User::find(3);

// Créer une requête simulée
$request = new Request();
$request->setUserResolver(function () use ($user) {
    return $user;
});

// Appeler le contrôleur
$controller = new DoctorController();
$response = $controller->patients($request);

// Afficher le résultat
$result = json_decode($response->getContent(), true);
echo "Résultat de l'API /api/doctor/patients :\n";
echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
