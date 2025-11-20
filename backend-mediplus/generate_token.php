<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

$user = User::where('email', 'admin00@gmail.com')->first();

if ($user) {
    $token = $user->createToken('admin-token')->plainTextToken;
    echo "Token pour admin00@gmail.com: " . $token . "\n";
} else {
    echo "Utilisateur admin non trouvé\n";
}
