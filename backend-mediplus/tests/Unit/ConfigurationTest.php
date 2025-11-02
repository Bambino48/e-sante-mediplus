<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ConfigurationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Charger l'autoloader si nécessaire
        if (!class_exists('Illuminate\Foundation\Application')) {
            require_once __DIR__ . '/../../vendor/autoload.php';
        }
    }

    public function test_application_can_be_created()
    {
        // Test que l'application peut être créée
        $app = require __DIR__ . '/../../bootstrap/app.php';

        $this->assertInstanceOf(\Illuminate\Foundation\Application::class, $app);
    }

    public function test_environment_configuration_exists()
    {
        // Test que les fichiers de configuration existent
        $this->assertTrue(
            file_exists(__DIR__ . '/../../.env'),
            'Le fichier .env devrait exister'
        );

        $this->assertTrue(
            file_exists(__DIR__ . '/../../.env.testing'),
            'Le fichier .env.testing devrait exister'
        );
    }

    public function test_database_configuration_exists()
    {
        $this->assertTrue(
            file_exists(__DIR__ . '/../../config/database.php'),
            'Le fichier de configuration database.php devrait exister'
        );
    }

    public function test_models_exist()
    {
        // Test que les modèles principaux existent
        $models = [
            'User',
            'DoctorProfile',
            'Appointment',
            'Specialty',
            'Availability'
        ];

        foreach ($models as $model) {
            $modelPath = __DIR__ . "/../../app/Models/{$model}.php";
            $this->assertTrue(
                file_exists($modelPath),
                "Le modèle {$model} devrait exister à {$modelPath}"
            );
        }
    }

    public function test_controllers_exist()
    {
        // Test que les contrôleurs principaux existent
        $controllers = [
            'AuthController',
            'DoctorController',
            'AppointmentController',
            'AdminController'
        ];

        foreach ($controllers as $controller) {
            $controllerPath = __DIR__ . "/../../app/Http/Controllers/Api/{$controller}.php";
            $this->assertTrue(
                file_exists($controllerPath),
                "Le contrôleur {$controller} devrait exister à {$controllerPath}"
            );
        }
    }

    public function test_migrations_exist()
    {
        // Test que les migrations principales existent
        $migrationDir = __DIR__ . '/../../database/migrations';
        $this->assertTrue(
            is_dir($migrationDir),
            'Le dossier des migrations devrait exister'
        );

        $migrations = glob($migrationDir . '/*.php');
        $this->assertGreaterThan(
            0,
            count($migrations),
            'Il devrait y avoir au moins une migration'
        );

        // Vérifier que certaines migrations importantes existent
        $migrationNames = array_map('basename', $migrations);
        $migrationContent = implode(' ', $migrationNames);

        $this->assertStringContainsString(
            'create_users_table',
            $migrationContent,
            'La migration users devrait exister'
        );
        $this->assertStringContainsString(
            'create_sessions_table',
            $migrationContent,
            'La migration sessions devrait exister'
        );
    }
}
