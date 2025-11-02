<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ComprehensiveRoutesTest extends TestCase
{
    protected $routesContent;

    protected function setUp(): void
    {
        parent::setUp();

        // Charger l'autoloader si nécessaire
        if (!class_exists('Illuminate\Foundation\Application')) {
            require_once __DIR__ . '/../../vendor/autoload.php';
        }

        // Charger le contenu des routes une seule fois
        $this->routesContent = file_get_contents(__DIR__ . '/../../routes/api.php');
    }

    /**
     * Test que toutes les routes d'authentification existent
     */
    public function test_authentication_routes_exist()
    {
        $authRoutes = [
            "Route::post('/register'" => 'Route d\'inscription',
            "Route::post('/login'" => 'Route de connexion',
            "Route::post('/logout'" => 'Route de déconnexion',
            "Route::get('/profile'" => 'Route du profil utilisateur',
            "Route::put('/profile'" => 'Route de mise à jour du profil'
        ];

        foreach ($authRoutes as $route => $description) {
            $this->assertStringContainsString(
                $route,
                $this->routesContent,
                "La {$description} devrait exister dans api.php"
            );
        }
    }

    /**
     * Test que toutes les routes médecin existent
     */
    public function test_doctor_routes_exist()
    {
        $doctorRoutes = [
            '/doctor/profile' => 'Profil médecin',
            '/pro/availability' => 'Disponibilités médecin',
            '/pro/billing' => 'Facturation médecin'
        ];

        foreach ($doctorRoutes as $route => $description) {
            $this->assertStringContainsString(
                $route,
                $this->routesContent,
                "La route {$description} ({$route}) devrait exister"
            );
        }
    }

    /**
     * Test que toutes les routes patient existent
     */
    public function test_patient_routes_exist()
    {
        $patientRoutes = [
            '/patient/appointments' => 'Rendez-vous patient',
            '/search' => 'Recherche de médecins',
            '/specialties' => 'Spécialités médicales'
        ];

        foreach ($patientRoutes as $route => $description) {
            $this->assertStringContainsString(
                $route,
                $this->routesContent,
                "La route {$description} ({$route}) devrait exister"
            );
        }
    }

    /**
     * Test que toutes les routes admin existent
     */
    public function test_admin_routes_exist()
    {
        $adminRoutes = [
            '/admin/users' => 'Gestion des utilisateurs',
            '/admin/catalog' => 'Catalogue admin',
            '/admin/reports' => 'Rapports admin'
        ];

        foreach ($adminRoutes as $route => $description) {
            $this->assertStringContainsString(
                $route,
                $this->routesContent,
                "La route {$description} ({$route}) devrait exister"
            );
        }
    }

    /**
     * Test que toutes les routes de téléconsultation existent
     */
    public function test_teleconsult_routes_exist()
    {
        $teleconsultRoutes = [
            '/teleconsult/create' => 'Création salle téléconsultation',
            '/teleconsult/token' => 'Token téléconsultation',
            '/teleconsult/end' => 'Fin téléconsultation'
        ];

        foreach ($teleconsultRoutes as $route => $description) {
            $this->assertStringContainsString(
                $route,
                $this->routesContent,
                "La route {$description} ({$route}) devrait exister"
            );
        }
    }

    /**
     * Test que toutes les routes de paiement existent
     */
    public function test_payment_routes_exist()
    {
        $paymentRoutes = [
            '/payment/create' => 'Création paiement',
            '/billing' => 'Facturation'
        ];

        foreach ($paymentRoutes as $route => $description) {
            $this->assertStringContainsString(
                $route,
                $this->routesContent,
                "La route {$description} ({$route}) devrait exister"
            );
        }
    }

    /**
     * Test que toutes les routes de triage existent
     */
    public function test_triage_routes_exist()
    {
        $triageRoutes = [
            '/triage' => 'Triage médical',
            '/triage/history' => 'Historique triage'
        ];

        foreach ($triageRoutes as $route => $description) {
            $this->assertStringContainsString(
                $route,
                $this->routesContent,
                "La route {$description} ({$route}) devrait exister"
            );
        }
    }

    /**
     * Test que toutes les routes de notifications existent
     */
    public function test_notification_routes_exist()
    {
        $notificationRoutes = [
            '/notifications' => 'Notifications utilisateur'
        ];

        foreach ($notificationRoutes as $route => $description) {
            $this->assertStringContainsString(
                $route,
                $this->routesContent,
                "La route {$description} ({$route}) devrait exister"
            );
        }
    }

    /**
     * Test que toutes les routes de configuration existent
     */
    public function test_config_routes_exist()
    {
        $configRoutes = [
            '/config/settings' => 'Configuration des paramètres',
            '/config/languages' => 'Configuration des langues'
        ];

        foreach ($configRoutes as $route => $description) {
            $this->assertStringContainsString(
                $route,
                $this->routesContent,
                "La route {$description} ({$route}) devrait exister"
            );
        }
    }

    /**
     * Test que tous les contrôleurs sont importés
     */
    public function test_all_controllers_are_imported()
    {
        $controllers = [
            'AuthController' => 'Contrôleur d\'authentification',
            'DoctorController' => 'Contrôleur des médecins',
            'AvailabilityController' => 'Contrôleur des disponibilités',
            'AppointmentController' => 'Contrôleur des rendez-vous',
            'TeleconsultController' => 'Contrôleur de téléconsultation',
            'PrescriptionController' => 'Contrôleur des prescriptions',
            'TriageController' => 'Contrôleur de triage',
            'PaymentController' => 'Contrôleur des paiements',
            'AdminController' => 'Contrôleur admin',
            'NotificationController' => 'Contrôleur des notifications',
            'ConfigController' => 'Contrôleur de configuration',
            'PatientProfileController' => 'Contrôleur du profil patient'
        ];

        foreach ($controllers as $controller => $description) {
            $this->assertStringContainsString(
                $controller,
                $this->routesContent,
                "Le {$description} ({$controller}) devrait être importé"
            );
        }
    }

    /**
     * Test que les middlewares de sécurité sont utilisés
     */
    public function test_security_middlewares_are_used()
    {
        $middlewares = [
            'auth:sanctum' => 'Middleware d\'authentification Sanctum',
            'middleware(' => 'Utilisation de middlewares',
            'group(function' => 'Groupes de routes'
        ];

        foreach ($middlewares as $middleware => $description) {
            $this->assertStringContainsString(
                $middleware,
                $this->routesContent,
                "Le {$description} devrait être utilisé"
            );
        }
    }

    /**
     * Test que toutes les méthodes HTTP sont utilisées
     */
    public function test_http_methods_are_comprehensive()
    {
        $httpMethods = [
            'Route::get(' => 'Méthode GET pour la lecture',
            'Route::post(' => 'Méthode POST pour la création',
            'Route::put(' => 'Méthode PUT pour la mise à jour',
            'Route::delete(' => 'Méthode DELETE pour la suppression'
        ];

        foreach ($httpMethods as $method => $description) {
            $this->assertStringContainsString(
                $method,
                $this->routesContent,
                "La {$description} devrait être utilisée"
            );
        }
    }

    /**
     * Test de structure globale des routes
     */
    public function test_routes_structure_is_organized()
    {
        // Vérifier la présence de commentaires d'organisation
        $organizationPatterns = [
            'Phase 1' => 'Organisation par phases',
            'Phase 2' => 'Phase 2 de développement',
            'Phase 3' => 'Phase 3 de développement',
            '===' => 'Séparateurs de sections'
        ];

        foreach ($organizationPatterns as $pattern => $description) {
            $this->assertStringContainsString(
                $pattern,
                $this->routesContent,
                "La {$description} devrait être présente pour l'organisation"
            );
        }
    }

    /**
     * Méthode utilitaire pour afficher un résumé des routes trouvées
     */
    public function test_display_routes_summary()
    {
        // Compter les routes par méthode HTTP
        $getMethods = substr_count($this->routesContent, 'Route::get(');
        $postMethods = substr_count($this->routesContent, 'Route::post(');
        $putMethods = substr_count($this->routesContent, 'Route::put(');
        $deleteMethods = substr_count($this->routesContent, 'Route::delete(');

        // Afficher un résumé
        $summary = "
=== RÉSUMÉ DES ROUTES API ===
GET routes: {$getMethods}
POST routes: {$postMethods}
PUT routes: {$putMethods}
DELETE routes: {$deleteMethods}
Total estimé: " . ($getMethods + $postMethods + $putMethods + $deleteMethods) . "
=============================
        ";

        // Ce test passe toujours, mais affiche des informations utiles
        $this->assertTrue(true, $summary);
    }
}
