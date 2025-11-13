<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;

$columns = Schema::getColumnListing('doctor_profiles');
echo "Colonnes de la table doctor_profiles:\n";
echo "=====================================\n";
foreach ($columns as $column) {
    echo "- $column\n";
}
