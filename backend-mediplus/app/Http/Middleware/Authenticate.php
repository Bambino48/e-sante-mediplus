<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Gère les utilisateurs non authentifiés.
     */
    protected function redirectTo($request)
    {
        // ✅ Si l’utilisateur s’attend à une réponse JSON (API), on ne redirige pas
        if ($request->expectsJson()) {
            return null;
        }

        // ✅ Par sécurité, on renvoie null dans tous les cas d’API
        return null;
    }
}
