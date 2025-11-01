<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class ConfigController extends Controller
{
    // GET /api/config/settings
    public function index()
    {
        $settings = Setting::pluck('value', 'key');
        return response()->json(['settings' => $settings]);
    }

    // PUT /api/config/settings
    public function update(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        return response()->json(['message' => 'Paramètres mis à jour']);
    }

    // GET /api/config/languages
    public function languages()
    {
        $langs = Setting::where('key', 'languages')->first();
        return response()->json(['languages' => $langs ? $langs->value : ['fr']]);
    }
}
