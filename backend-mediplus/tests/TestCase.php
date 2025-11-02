<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function createApplication()
    {
        // L'autoloader devrait déjà être chargé par PHPUnit, mais on s'assure
        if (!class_exists('Illuminate\Foundation\Application')) {
            require_once __DIR__ . '/../vendor/autoload.php';
        }

        $app = require __DIR__ . '/../bootstrap/app.php';

        return $app;
    }
}
