<?php

use Laravel\Sanctum\Sanctum;

return [

    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Ici, on définit les domaines autorisés à envoyer des requêtes avec
    | cookies / tokens (SPA). Inclure le frontend React local et le backend.
    |
    | Exemple : ton React tourne sur http://localhost:5173
    | et ton API sur http://127.0.0.1:8000
    |
    */

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', implode(',', [
        'localhost',
        'localhost:5173',
        '127.0.0.1',
        '127.0.0.1:5173',
        '127.0.0.1:8000',
        '::1',
    ]))),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    |
    | On garde "web" pour la compatibilité Laravel Sanctum.
    | Les routes API protégées utilisent "auth:sanctum".
    |
    */

    'guard' => ['sanctum'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | Durée de validité des tokens. null = jamais expiré.
    | Tu peux fixer une durée, par ex. 60 (minutes).
    |
    */

    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    |
    | Optionnel : préfixe des tokens pour détecter les fuites accidentelles.
    |
    */

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    |
    | Middleware utilisés par Sanctum pour authentifier ton SPA (React).
    |
    */

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],

];
