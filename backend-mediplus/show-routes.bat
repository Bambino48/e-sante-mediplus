@echo off
echo ================================================================================
echo                           RAPPORT DES ROUTES MEDIPLUS
echo ================================================================================
echo.

echo Execution du rapport des routes...
vendor\bin\phpunit tests/Unit/RoutesReportTest.php --testdox

echo.
echo Verification du fichier routes/api.php...
echo.
echo Contenu du fichier api.php:
echo ================================================================================
type routes\api.php

echo.
echo ================================================================================
echo                              FIN DU RAPPORT
echo ================================================================================
pause
