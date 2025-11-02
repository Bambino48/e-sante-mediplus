<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class BasicPHPUnitTest extends TestCase
{
    public function testBasicAssertion()
    {
        $this->assertTrue(true);
    }

    public function testApplicationBootstrap()
    {
        // Charger l'autoloader
        require_once __DIR__ . '/../../vendor/autoload.php';

        // Charger l'application
        $app = require __DIR__ . '/../../bootstrap/app.php';

        $this->assertInstanceOf(\Illuminate\Foundation\Application::class, $app);
    }
}
