<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Si l'utilisateur est déjà connecté, on bloque l'accès aux routes invitées.
     */
    public function handle(Request $request, Closure $next, ...$guards): Response
    {
        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                // Pour une API, on ne redirige pas mais on renvoie une réponse JSON
                return response()->json([
                    'message' => 'Déjà authentifié',
                    'user' => Auth::user(),
                ], 200);
            }
        }

        return $next($request);
    }
}
