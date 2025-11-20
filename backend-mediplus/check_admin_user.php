<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

echo '=== VÉRIFICATION UTILISATEUR ADMIN ===' . PHP_EOL;

$user = User::where('role', 'admin')->first();

if ($user) {
    echo 'Utilisateur admin trouvé:' . PHP_EOL;
    echo 'ID: ' . $user->id . PHP_EOL;
    echo 'Name: ' . $user->name . PHP_EOL;
    echo 'Email: ' . $user->email . PHP_EOL;
    echo 'Phone: ' . ($user->phone ?? 'null') . PHP_EOL;
    echo 'Photo: ' . ($user->photo ?? 'null') . PHP_EOL;
    echo 'Role: ' . $user->role . PHP_EOL;
    echo 'Created: ' . $user->created_at . PHP_EOL;
    echo 'Updated: ' . $user->updated_at . PHP_EOL;
} else {
    echo 'Aucun utilisateur admin trouvé' . PHP_EOL;
}

echo PHP_EOL . '=== FIN DE LA VÉRIFICATION ===' . PHP_EOL;
