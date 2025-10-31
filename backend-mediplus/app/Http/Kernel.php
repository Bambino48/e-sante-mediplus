<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * 🌍 Middleware global exécuté pour chaque requête HTTP.
     */
    protected $middleware = [
        // ✅ Active la gestion CORS native de Laravel (pas besoin de fruitcake)
        \Illuminate\Http\Middleware\HandleCors::class,

        // ✅ Autorise le trafic proxy (utile si reverse proxy ou hébergement)
        \App\Http\Middleware\TrustProxies::class,

        // ✅ Vérifie la taille des requêtes POST
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,

        // ✅ Définit les hôtes de confiance
        \Illuminate\Http\Middleware\TrustHosts::class,
    ];

    /**
     * 🚦 Groupes de middlewares (API et Web).
     * On garde seulement le groupe API pour notre backend.
     */
    protected $middlewareGroups = [
        'api' => [
            // ✅ Sanctum : gère les requêtes authentifiées du frontend (React)
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,

            // ✅ Limite les requêtes API par minute
            'throttle:api',

            // ✅ Gère les liaisons automatiques de modèles
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * 🧩 Middleware route spécifique (appliqué manuellement).
     */
    protected $routeMiddleware = [
        // 🔒 Authentification (via Sanctum)
        'auth' => \App\Http\Middleware\Authenticate::class,

        // 🔐 Vérification des rôles (admin, doctor, patient)
        'role' => \App\Http\Middleware\CheckRole::class,

        // 🔁 Autorisations policies
        'can' => \Illuminate\Auth\Middleware\Authorize::class,

        // 🚫 Redirection si connecté
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,

        // 🚦 Gestion des limites de requêtes
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,

        // 🔀 Binding automatique
        'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,

        'admin' => \App\Http\Middleware\AdminMiddleware::class,
    ];
}
