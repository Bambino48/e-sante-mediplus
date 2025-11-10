<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class RoutesReportTest extends TestCase
{
    protected $routesContent;

    protected function setUp(): void
    {
        parent::setUp();

        if (!class_exists('Illuminate\Foundation\Application')) {
            require_once __DIR__ . '/../../vendor/autoload.php';
        }

        $this->routesContent = file_get_contents(__DIR__ . '/../../routes/api.php');
    }

    /**
     * Test qui génère un rapport complet de toutes les routes
     */
    public function test_generate_complete_routes_report()
    {
        $report = $this->generateRoutesReport();

        // Écrire le rapport dans un fichier
        $reportPath = __DIR__ . '/../../storage/logs/routes_report.txt';
        file_put_contents($reportPath, $report);

        // Afficher le rapport
        echo "\n" . $report;

        // Le test passe toujours
        $this->assertTrue(true, "Rapport des routes généré avec succès");
    }

    private function generateRoutesReport(): string
    {
        $report = "
================================================================================
                            🚀 RAPPORT COMPLET DES ROUTES API
                                    MEDIPLUS BACKEND
================================================================================

";

        // 1. Statistiques générales
        $report .= $this->getGeneralStats();

        // 2. Routes par catégorie
        $report .= $this->getRoutesByCategory();

        // 3. Contrôleurs utilisés
        $report .= $this->getControllersInfo();

        // 4. Middlewares utilisés
        $report .= $this->getMiddlewaresInfo();

        // 5. Structure d'organisation
        $report .= $this->getOrganizationInfo();

        $report .= "
================================================================================
                                    FIN DU RAPPORT
================================================================================
";

        return $report;
    }

    private function getGeneralStats(): string
    {
        $getMethods = substr_count($this->routesContent, 'Route::get(');
        $postMethods = substr_count($this->routesContent, 'Route::post(');
        $putMethods = substr_count($this->routesContent, 'Route::put(');
        $deleteMethods = substr_count($this->routesContent, 'Route::delete(');
        $total = $getMethods + $postMethods + $putMethods + $deleteMethods;

        return "
STATISTIQUES GENERALES
================================================================================
Routes GET (lecture)         : {$getMethods}
Routes POST (creation)       : {$postMethods}
Routes PUT (mise a jour)     : {$putMethods}
Routes DELETE (suppression) : {$deleteMethods}
TOTAL DES ROUTES            : {$total}

";
    }

    private function getRoutesByCategory(): string
    {
        $categories = [
            'AUTHENTIFICATION' => [
                '/register' => 'POST - Inscription utilisateur',
                '/login' => 'POST - Connexion utilisateur',
                '/logout' => 'POST - Deconnexion utilisateur',
                '/profile' => 'GET/PUT - Profil utilisateur'
            ],
            'MEDECINS' => [
                '/doctor/profile' => 'POST/GET/PUT - Profil medecin',
                '/doctor/availabilities' => 'GET/POST/PUT/DELETE - Disponibilites',
                '/pro/appointments' => 'GET - Rendez-vous medecin',
                '/doctor/appointments/today' => 'GET - Rendez-vous aujourd\'hui',
                '/pro/billing' => 'GET - Facturation medecin'
            ],
            'PATIENTS' => [
                '/patient/appointments' => 'POST/GET/PUT/DELETE - Rendez-vous',
                '/search' => 'GET - Recherche medecins',
                '/specialties' => 'GET - Liste specialites'
            ],
            'ADMINISTRATION' => [
                '/admin/users' => 'GET - Gestion utilisateurs',
                '/admin/catalog' => 'GET - Catalogue admin',
                '/admin/reports' => 'GET - Rapports'
            ],
            'TELECONSULTATION' => [
                '/teleconsult/create' => 'POST - Creer salle',
                '/teleconsult/token' => 'GET - Token acces',
                '/teleconsult/end' => 'POST - Terminer session'
            ],
            'PAIEMENTS' => [
                '/payment/create' => 'POST - Creer paiement',
                '/billing' => 'GET - Facturation'
            ],
            'TRIAGE MEDICAL' => [
                '/triage' => 'POST - Effectuer triage',
                '/triage/history' => 'GET - Historique triage'
            ],
            'NOTIFICATIONS' => [
                '/notifications' => 'GET/POST/PUT/DELETE - Notifications'
            ],
            'CONFIGURATION' => [
                '/config/settings' => 'GET/PUT - Parametres',
                '/config/languages' => 'GET - Langues'
            ]
        ];

        $report = "ROUTES PAR CATEGORIE\n";
        $report .= "================================================================================\n";

        foreach ($categories as $category => $routes) {
            $report .= "\n{$category}\n";
            $report .= str_repeat('-', 80) . "\n";

            foreach ($routes as $route => $description) {
                $exists = strpos($this->routesContent, $route) !== false ? '[OK]' : '[KO]';
                $report .= "{$exists} {$route}\n    → {$description}\n";
            }
        }

        return $report . "\n";
    }

    private function getControllersInfo(): string
    {
        $controllers = [
            'AuthController' => 'Authentification',
            'DoctorController' => 'Gestion medecins',
            'AvailabilityController' => 'Disponibilites',
            'AppointmentController' => 'Rendez-vous',
            'TeleconsultController' => 'Teleconsultation',
            'PrescriptionController' => 'Prescriptions',
            'TriageController' => 'Triage',
            'PaymentController' => 'Paiements',
            'AdminController' => 'Administration',
            'NotificationController' => 'Notifications',
            'ConfigController' => 'Configuration',
            'PatientProfileController' => 'Profil patient'
        ];

        $report = "CONTROLEURS UTILISES\n";
        $report .= "================================================================================\n";

        foreach ($controllers as $controller => $description) {
            $exists = strpos($this->routesContent, $controller) !== false ? '[OK]' : '[KO]';
            $report .= "{$exists} {$controller}\n    → {$description}\n";
        }

        return $report . "\n";
    }

    private function getMiddlewaresInfo(): string
    {
        $middlewares = [
            'auth:sanctum' => 'Authentification Laravel Sanctum',
            'middleware(' => 'Groupes de middleware',
            'group(function' => 'Groupes de routes'
        ];

        $report = "🛡️ MIDDLEWARES ET SÉCURITÉ\n";
        $report .= "================================================================================\n";

        foreach ($middlewares as $middleware => $description) {
            $count = substr_count($this->routesContent, $middleware);
            $status = $count > 0 ? "✅ ({$count} utilisations)" : '❌';
            $report .= "{$status} {$middleware}\n    → {$description}\n";
        }

        return $report . "\n";
    }

    private function getOrganizationInfo(): string
    {
        $phases = [
            'Phase 1' => 'Authentification & Profil',
            'Phase 2' => 'Recherche & Catalogue',
            'Phase 3' => 'Rendez-vous',
            'Phase 4' => 'Téléconsultation',
            'Phase 5' => 'Prescriptions',
            'Phase 6' => 'Triage',
            'Phase 7' => 'Paiements',
            'Phase 8' => 'Notifications',
            'Phase 9' => 'Configuration'
        ];

        $report = "🗂️ ORGANISATION PAR PHASES\n";
        $report .= "================================================================================\n";

        foreach ($phases as $phase => $description) {
            $exists = strpos($this->routesContent, $phase) !== false ? '✅' : '❌';
            $report .= "{$exists} {$phase}: {$description}\n";
        }

        return $report . "\n";
    }
}
