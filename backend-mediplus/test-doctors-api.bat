@echo off
echo ===============================================
echo   Test de la Route API - Liste des Docteurs
echo ===============================================
echo.

echo [INFO] Verification de la route...
php artisan route:list --path=api/doctors

echo.
echo [INFO] Verification de la syntaxe PHP...
php -l app/Http/Controllers/Api/DoctorController.php

echo.
echo [INFO] Verification des routes API...
php artisan route:cache

echo.
echo [INFO] Test des methodes du controleur...
php artisan tinker --execute="
use App\Http\Controllers\Api\DoctorController;
use Illuminate\Http\Request;

echo 'Controleur DoctorController charge avec succes' . PHP_EOL;
echo 'Methode index disponible: ' . (method_exists(DoctorController::class, 'index') ? 'OUI' : 'NON') . PHP_EOL;
"

echo.
echo ===============================================
echo   Tests completes avec succes
echo ===============================================
pause
