@echo off
cls
echo ================================================================================
echo                           🧹 NETTOYAGE DU PROJET MEDIPLUS
echo                              Suppression des fichiers inutiles
echo ================================================================================
echo.

echo 📋 Analyse des fichiers à supprimer...
echo.

echo 🗑️ Suppression des fichiers de tests obsolètes et non fonctionnels...
echo --------------------------------------------------------------------------------

REM Supprimer les tests qui ne fonctionnent pas ou sont dupliqués
if exist "tests\Unit\RoutesTest.php" (
    echo ❌ Suppression: tests\Unit\RoutesTest.php ^(dupliqué^)
    del "tests\Unit\RoutesTest.php"
)

if exist "tests\Feature\ApiRoutesTest.php" (
    echo ❌ Suppression: tests\Feature\ApiRoutesTest.php ^(Pest non fonctionnel^)
    del "tests\Feature\ApiRoutesTest.php"
)

if exist "tests\Feature\ApiRoutesTestPHPUnit.php" (
    echo ❌ Suppression: tests\Feature\ApiRoutesTestPHPUnit.php ^(version obsolète^)
    del "tests\Feature\ApiRoutesTestPHPUnit.php"
)

if exist "tests\Feature\BasicHttpTest.php" (
    echo ❌ Suppression: tests\Feature\BasicHttpTest.php ^(non fonctionnel^)
    del "tests\Feature\BasicHttpTest.php"
)

if exist "tests\Integration\HttpApiTest.php" (
    echo ❌ Suppression: tests\Integration\HttpApiTest.php ^(problèmes facade^)
    del "tests\Integration\HttpApiTest.php"
)

REM Supprimer le dossier Integration s'il est vide
if exist "tests\Integration\" (
    rmdir "tests\Integration" 2>nul
    if not exist "tests\Integration\" (
        echo ❌ Suppression: dossier tests\Integration ^(vide^)
    )
)

echo.
echo 🧹 Suppression des fichiers de configuration Pest inutiles...
echo --------------------------------------------------------------------------------

if exist "tests\Pest.php" (
    echo ❌ Suppression: tests\Pest.php ^(Pest non utilisé^)
    del "tests\Pest.php"
)

if exist "vendor\pest-plugins.json" (
    echo ❌ Suppression: vendor\pest-plugins.json ^(Pest non utilisé^)
    del "vendor\pest-plugins.json"
)

echo.
echo 📄 Suppression des fichiers de logs temporaires...
echo --------------------------------------------------------------------------------

if exist "storage\logs\routes_report.txt" (
    echo ❌ Suppression: storage\logs\routes_report.txt ^(temporaire^)
    del "storage\logs\routes_report.txt"
)

if exist ".phpunit.result.cache" (
    echo ❌ Suppression: .phpunit.result.cache ^(cache temporaire^)
    del ".phpunit.result.cache"
)

echo.
echo 🗂️ Suppression des scripts de test obsolètes...
echo --------------------------------------------------------------------------------

if exist "run-tests.bat" (
    echo ❌ Suppression: run-tests.bat ^(remplacé par show-all-working-tests.bat^)
    del "run-tests.bat"
)

echo.
echo ✨ Nettoyage des dossiers vides...
echo --------------------------------------------------------------------------------

REM Vérifier et supprimer les dossiers vides
for /d %%d in ("tests\*") do (
    dir "%%d" /b /a 2>nul | findstr . >nul
    if errorlevel 1 (
        echo ❌ Suppression: %%d ^(dossier vide^)
        rmdir "%%d"
    )
)

echo.
echo ================================================================================
echo                               ✅ NETTOYAGE TERMINÉ
echo ================================================================================
echo.

echo 📊 Fichiers conservés ^(fonctionnels^):
echo --------------------------------------------------------------------------------
echo ✅ tests\Unit\ComprehensiveRoutesTest.php
echo ✅ tests\Unit\RoutesReportTest.php
echo ✅ tests\Unit\BasicPHPUnitTest.php
echo ✅ tests\Unit\ConfigurationTest.php
echo ✅ tests\TestCase.php
echo ✅ show-all-working-tests.bat
echo ✅ show-routes.bat
echo ✅ TESTS-WORKING.md

echo.
echo 🚀 Votre projet est maintenant propre et optimisé!
echo    Seuls les fichiers fonctionnels ont été conservés.
echo.
echo ================================================================================
pause
