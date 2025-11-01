<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ConfigController extends Controller
{
    public function settings()
    {
        $settings = config('mediplus');

        return response()->json(['settings' => $settings]);
    }

    public function updateSettings(Request $request)
    {
        // Mettre à jour les paramètres (implémentation selon votre structure)

        return response()->json(['message' => 'Settings updated']);
    }

    public function languages()
    {
        $languages = [
            'en' => 'English',
            'fr' => 'Français',
        ];

        return response()->json(['languages' => $languages]);
    }
}
