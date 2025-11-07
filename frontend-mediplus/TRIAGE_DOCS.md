# 🧠 Documentation Backend - Système de Triage IA

Ce document fournit l'implémentation complète du système de Triage IA pour MediPlus, incluant le contrôleur Laravel, le modèle Eloquent, la migration de base de données, et les tests API.

---

## 📋 Table des Matières

1. [Vue d'ensemble du système](#vue-densemble-du-système)
2. [Structure de la base de données](#structure-de-la-base-de-données)
3. [Migration Laravel](#migration-laravel)
4. [Modèle Eloquent](#modèle-eloquent)
5. [Contrôleur TriageController](#contrôleur-triagecontroller)
6. [Intégration IA (optionnelle)](#intégration-ia-optionnelle)
7. [Routes API](#routes-api)
8. [Tests API avec curl](#tests-api-avec-curl)
9. [Sécurité et Validation](#sécurité-et-validation)
10. [Checklist d'implémentation](#checklist-dimplémentation)

---

## 🎯 Vue d'ensemble du système

Le système de **Triage IA** permet aux patients de :

- ✅ Décrire leurs symptômes via une interface de chat
- ✅ Recevoir une analyse automatique avec niveau d'urgence (haute, modérée, basse)
- ✅ Obtenir des recommandations médicales personnalisées
- ✅ Accéder à leur historique de sessions de triage
- ✅ Naviguer vers la téléconsultation ou la prise de rendez-vous selon les recommandations

### Flux utilisateur

```
Patient → Décrit symptômes → IA analyse → Résultat (triage + urgence + recommandation)
                                              ↓
                                    Actions contextuelles:
                                    - Téléconsultation immédiate
                                    - Prendre rendez-vous
```

---

## 📊 Structure de la base de données

Table : `triage_sessions`

| Colonne    | Type      | Description                                                |
| ---------- | --------- | ---------------------------------------------------------- |
| id         | BIGINT    | Clé primaire auto-incrémentée                              |
| patient_id | BIGINT    | Clé étrangère vers `users.id` (utilisateur patient)        |
| symptoms   | TEXT      | Description des symptômes fournie par le patient           |
| result     | JSON      | Résultat de l'analyse IA (triage, urgency, recommendation) |
| created_at | TIMESTAMP | Date/heure de création de la session                       |
| updated_at | TIMESTAMP | Date/heure de dernière modification                        |

**Contraintes :**

- `patient_id` : FOREIGN KEY → `users(id)` ON DELETE CASCADE
- Index sur `patient_id` pour optimiser les requêtes d'historique
- Index sur `created_at` pour trier chronologiquement

**Exemple de données `result` (JSON) :**

```json
{
  "triage": "Risque infection respiratoire",
  "urgency": "modérée",
  "recommendation": "Consulter un généraliste ou un pneumologue dans les 24-48h"
}
```

---

## 🔧 Migration Laravel

**Fichier :** `database/migrations/YYYY_MM_DD_create_triage_sessions_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('triage_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->text('symptoms');
            $table->json('result'); // {triage, urgency, recommendation}
            $table->timestamps();

            // Index pour optimiser les requêtes
            $table->index('patient_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('triage_sessions');
    }
};
```

**Exécution :**

```bash
php artisan migrate
```

---

## 📦 Modèle Eloquent

**Fichier :** `app/Models/TriageSession.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TriageSession extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'triage_sessions';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'patient_id',
        'symptoms',
        'result',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'result' => 'array', // Convertit automatiquement JSON <-> Array
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation : Une session de triage appartient à un patient (User)
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    /**
     * Scope : Sessions triées par date décroissante
     */
    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Scope : Sessions d'un patient spécifique
     */
    public function scopeForPatient($query, int $patientId)
    {
        return $query->where('patient_id', $patientId);
    }
}
```

**Ajout dans `User.php` (relation inverse) :**

```php
// app/Models/User.php

public function triageSessions()
{
    return $this->hasMany(TriageSession::class, 'patient_id');
}
```

---

## 🎛️ Contrôleur TriageController

**Fichier :** `app/Http/Controllers/Api/TriageController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TriageSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;

class TriageController extends Controller
{
    /**
     * GET /api/patient/triage
     * Récupère l'historique des sessions de triage du patient connecté
     */
    public function index()
    {
        $sessions = TriageSession::forPatient(Auth::id())
            ->recent()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $sessions,
        ], 200);
    }

    /**
     * POST /api/patient/triage
     * Crée une nouvelle session de triage avec analyse IA
     */
    public function store(Request $request)
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'symptoms' => 'required|string|min:10|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Analyse des symptômes (IA locale ou API externe)
        $analysisResult = $this->analyzeSymptoms($request->symptoms);

        // Création de la session
        $session = TriageSession::create([
            'patient_id' => Auth::id(),
            'symptoms' => $request->symptoms,
            'result' => $analysisResult,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Analyse effectuée avec succès',
            'data' => $session,
        ], 201);
    }

    /**
     * GET /api/patient/triage/{id}
     * Récupère le détail d'une session de triage spécifique
     */
    public function show($id)
    {
        $session = TriageSession::forPatient(Auth::id())
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $session,
        ], 200);
    }

    /**
     * Analyse les symptômes et retourne un diagnostic
     * @param string $symptoms
     * @return array {triage, urgency, recommendation}
     */
    private function analyzeSymptoms(string $symptoms): array
    {
        $lower = strtolower($symptoms);

        // Option 1 : Logique locale (règles médicales simples)
        if (str_contains($lower, 'douleur') && str_contains($lower, 'poitrine')) {
            return [
                'triage' => 'Symptômes cardiaques possibles',
                'urgency' => 'haute',
                'recommendation' => '⚠️ URGENT : Appelez immédiatement les urgences (15 / 112) ou contactez un cardiologue',
            ];
        }

        if (str_contains($lower, 'fièvre') || str_contains($lower, 'toux')) {
            return [
                'triage' => 'Risque infection respiratoire',
                'urgency' => 'modérée',
                'recommendation' => '🩺 Consulter un généraliste ou un pneumologue dans les 24-48h. Téléconsultation disponible.',
            ];
        }

        if (str_contains($lower, 'fatigue') || str_contains($lower, 'mal de tête')) {
            return [
                'triage' => 'Symptômes non spécifiques',
                'urgency' => 'basse',
                'recommendation' => '💤 Surveillez l\'évolution. Reposez-vous et hydratez-vous. Consultez si persistance >3 jours.',
            ];
        }

        return [
            'triage' => 'Aucune alerte grave détectée',
            'urgency' => 'basse',
            'recommendation' => '🤖 Symptômes non critiques. Surveillez et consultez si aggravation.',
        ];

        // Option 2 : Intégration IA externe (voir section suivante)
        // return $this->callExternalAI($symptoms);
    }

    /**
     * (Optionnel) Appel à une API IA externe (Google Gemini, OpenAI, etc.)
     */
    private function callExternalAI(string $symptoms): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('GEMINI_API_KEY'),
                'Content-Type' => 'application/json',
            ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'text' => "Tu es un assistant médical. Analyse ces symptômes et fournis : 1) Un diagnostic préliminaire, 2) Le niveau d'urgence (haute/modérée/basse), 3) Une recommandation d'action. Symptômes : {$symptoms}"
                            ]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $aiText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

                // Parser la réponse de l'IA (à adapter selon le format retourné)
                return $this->parseAIResponse($aiText);
            }
        } catch (\Exception $e) {
            \Log::error('Erreur appel IA externe: ' . $e->getMessage());
        }

        // Fallback sur logique locale si erreur
        return $this->analyzeSymptoms($symptoms);
    }

    /**
     * Parse la réponse de l'IA externe
     */
    private function parseAIResponse(string $aiText): array
    {
        // Exemple de parsing basique (à affiner selon votre IA)
        $urgency = 'modérée';
        if (stripos($aiText, 'urgent') !== false || stripos($aiText, 'urgence') !== false) {
            $urgency = 'haute';
        } elseif (stripos($aiText, 'basse') !== false || stripos($aiText, 'non critique') !== false) {
            $urgency = 'basse';
        }

        return [
            'triage' => substr($aiText, 0, 200), // Extrait les 200 premiers caractères
            'urgency' => $urgency,
            'recommendation' => $aiText,
        ];
    }
}
```

---

## 🤖 Intégration IA (optionnelle)

### Option 1 : Logique locale (règles médicales)

**Avantages :**

- ✅ Pas de coût d'API externe
- ✅ Réponse instantanée
- ✅ Contrôle total sur les règles

**Inconvénients :**

- ❌ Limité aux règles prédéfinies
- ❌ Pas d'apprentissage automatique

### Option 2 : API IA externe (Google Gemini, OpenAI, etc.)

**Exemple avec Google Gemini :**

1. **Obtenir une clé API** : [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Ajouter dans `.env` :**

```env
GEMINI_API_KEY=votre_cle_api_gemini
```

3. **Utiliser `callExternalAI()` dans le contrôleur** (déjà implémenté ci-dessus)

**Exemple avec OpenAI (GPT-4) :**

```php
$response = Http::withHeaders([
    'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
])->post('https://api.openai.com/v1/chat/completions', [
    'model' => 'gpt-4',
    'messages' => [
        [
            'role' => 'system',
            'content' => 'Tu es un assistant médical. Fournis des analyses prudentes et oriente le patient.'
        ],
        [
            'role' => 'user',
            'content' => $symptoms
        ]
    ],
]);

$aiText = $response->json()['choices'][0]['message']['content'];
```

---

## 🛣️ Routes API

**Fichier :** `routes/api.php`

```php
use App\Http\Controllers\Api\TriageController;

Route::middleware('auth:sanctum')->prefix('patient')->group(function () {
    // Routes de triage IA
    Route::get('/triage', [TriageController::class, 'index']);          // Liste historique
    Route::post('/triage', [TriageController::class, 'store']);         // Créer session
    Route::get('/triage/{id}', [TriageController::class, 'show']);      // Détail session
});
```

**Routes disponibles :**

| Méthode | Endpoint                 | Description                          | Auth |
| ------- | ------------------------ | ------------------------------------ | ---- |
| GET     | /api/patient/triage      | Liste des sessions du patient        | ✅   |
| POST    | /api/patient/triage      | Créer une nouvelle session d'analyse | ✅   |
| GET     | /api/patient/triage/{id} | Détail d'une session spécifique      | ✅   |

---

## 🧪 Tests API avec curl

### 1️⃣ Créer une nouvelle session de triage

```bash
curl -X POST http://127.0.0.1:8000/api/patient/triage \
  -H "Authorization: Bearer VOTRE_TOKEN_SANCTUM" \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": "J'\''ai de la fièvre (38.5°C) et je tousse depuis 3 jours. Je ressens aussi de la fatigue."
  }'
```

**Réponse attendue (201 Created) :**

```json
{
  "success": true,
  "message": "Analyse effectuée avec succès",
  "data": {
    "id": 1,
    "patient_id": 15,
    "symptoms": "J'ai de la fièvre (38.5°C) et je tousse depuis 3 jours. Je ressens aussi de la fatigue.",
    "result": {
      "triage": "Risque infection respiratoire",
      "urgency": "modérée",
      "recommendation": "🩺 Consulter un généraliste ou un pneumologue dans les 24-48h. Téléconsultation disponible."
    },
    "created_at": "2025-11-07T14:32:10.000000Z",
    "updated_at": "2025-11-07T14:32:10.000000Z"
  }
}
```

### 2️⃣ Récupérer l'historique des sessions

```bash
curl -X GET http://127.0.0.1:8000/api/patient/triage \
  -H "Authorization: Bearer VOTRE_TOKEN_SANCTUM"
```

**Réponse attendue (200 OK) :**

```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "patient_id": 15,
      "symptoms": "Maux de tête persistants depuis 2 jours",
      "result": {
        "triage": "Symptômes non spécifiques",
        "urgency": "basse",
        "recommendation": "💤 Surveillez l'évolution. Reposez-vous et hydratez-vous."
      },
      "created_at": "2025-11-07T16:20:00.000000Z"
    },
    {
      "id": 1,
      "patient_id": 15,
      "symptoms": "J'ai de la fièvre et je tousse",
      "result": {
        "triage": "Risque infection respiratoire",
        "urgency": "modérée",
        "recommendation": "🩺 Consulter un généraliste"
      },
      "created_at": "2025-11-07T14:32:10.000000Z"
    }
  ]
}
```

### 3️⃣ Récupérer le détail d'une session spécifique

```bash
curl -X GET http://127.0.0.1:8000/api/patient/triage/1 \
  -H "Authorization: Bearer VOTRE_TOKEN_SANCTUM"
```

**Réponse attendue (200 OK) :**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_id": 15,
    "symptoms": "J'ai de la fièvre et je tousse",
    "result": {
      "triage": "Risque infection respiratoire",
      "urgency": "modérée",
      "recommendation": "🩺 Consulter un généraliste ou un pneumologue dans les 24-48h."
    },
    "created_at": "2025-11-07T14:32:10.000000Z"
  }
}
```

### ❌ Cas d'erreur : Symptômes manquants

```bash
curl -X POST http://127.0.0.1:8000/api/patient/triage \
  -H "Authorization: Bearer VOTRE_TOKEN_SANCTUM" \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ""}'
```

**Réponse (422 Unprocessable Entity) :**

```json
{
  "success": false,
  "errors": {
    "symptoms": ["Le champ symptoms doit contenir au moins 10 caractères."]
  }
}
```

---

## 🔒 Sécurité et Validation

### 1️⃣ Authentification Sanctum

Toutes les routes nécessitent un token Sanctum valide :

```php
Route::middleware('auth:sanctum')->group(function () {
    // Routes protégées
});
```

### 2️⃣ Validation des données

```php
$validator = Validator::make($request->all(), [
    'symptoms' => 'required|string|min:10|max:2000',
]);
```

**Règles appliquées :**

- `required` : Le champ `symptoms` est obligatoire
- `string` : Doit être une chaîne de caractères
- `min:10` : Minimum 10 caractères pour éviter les descriptions trop courtes
- `max:2000` : Maximum 2000 caractères pour limiter les abus

### 3️⃣ Autorisation

Seul le patient propriétaire peut accéder à ses sessions :

```php
$session = TriageSession::forPatient(Auth::id())->findOrFail($id);
```

### 4️⃣ Protection contre l'injection SQL

✅ Utilisation d'Eloquent ORM (protection automatique)

### 5️⃣ Rate Limiting (limitation de débit)

**Fichier :** `app/Http/Kernel.php`

```php
protected $middlewareGroups = [
    'api' => [
        \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
    ],
];
```

**Configuration dans `config/sanctum.php` :**

```php
'limiter' => 60, // 60 requêtes par minute
```

---

## ✅ Checklist d'implémentation

### Backend Laravel

- [ ] **1. Créer la migration** : `database/migrations/YYYY_MM_DD_create_triage_sessions_table.php`
- [ ] **2. Exécuter la migration** : `php artisan migrate`
- [ ] **3. Créer le modèle** : `app/Models/TriageSession.php`
- [ ] **4. Ajouter relation dans User.php** : `public function triageSessions()`
- [ ] **5. Créer le contrôleur** : `app/Http/Controllers/Api/TriageController.php`
- [ ] **6. Ajouter les routes** : `routes/api.php`
- [ ] **7. Tester avec curl** : Créer session, récupérer historique, afficher détail
- [ ] **8. (Optionnel) Configurer IA externe** : Ajouter `GEMINI_API_KEY` dans `.env`

### Frontend React (déjà complété)

- [x] **1. Créer l'API layer** : `src/api/triage.js`
- [x] **2. Refactoriser Triage.jsx** : Tabs (Nouvelle Analyse / Historique)
- [x] **3. Intégrer React Query** : `useQuery` pour historique, `useMutation` pour créer
- [x] **4. Ajouter actions contextuelles** : Boutons Téléconsultation / Rendez-vous
- [x] **5. Gérer les états de chargement** : Loader, EmptyState
- [x] **6. Intégrer dans DashboardContainer** : Vérifier que le bouton Triage IA fonctionne

### Tests et Validation

- [ ] **1. Tester la création de session** : Avec symptômes valides
- [ ] **2. Tester la validation** : Avec symptômes vides ou trop courts
- [ ] **3. Tester l'historique** : Vérifier l'ordre chronologique décroissant
- [ ] **4. Tester l'autorisation** : Un patient ne peut pas voir les sessions d'un autre
- [ ] **5. Tester les actions** : Navigation vers Teleconsult et Booking

---

## 📌 Résumé des Endpoints

| Méthode | Endpoint                 | Fonction                         | Authentification |
| ------- | ------------------------ | -------------------------------- | ---------------- |
| GET     | /api/patient/triage      | Liste historique sessions        | ✅ Sanctum       |
| POST    | /api/patient/triage      | Créer nouvelle session d'analyse | ✅ Sanctum       |
| GET     | /api/patient/triage/{id} | Détail session spécifique        | ✅ Sanctum       |

---

## 🎯 Prochaines Étapes (Roadmap)

### 🔹 Court terme

1. Implémenter le contrôleur Laravel selon cette documentation
2. Tester l'intégration Frontend ↔ Backend
3. Affiner les règles de triage selon retours médicaux

### 🔹 Moyen terme

4. Intégrer une vraie IA (Gemini / OpenAI) pour analyses avancées
5. Ajouter support vocal (Speech-to-Text)
6. Créer dashboard admin pour monitorer les triages critiques

### 🔹 Long terme

7. Machine Learning sur historique patient pour personnalisation
8. Intégration avec système d'alertes médicales
9. Multilingue (Français, Anglais, dialectes locaux)

---

## 📞 Support

Pour toute question sur cette implémentation :

- **Backend Team Lead** : [backend@mediplus.ci](mailto:backend@mediplus.ci)
- **Documentation API complète** : `/docs/api` (Swagger/OpenAPI)
- **Repository GitHub** : [github.com/mediplus/e-sante-platform](https://github.com/mediplus/e-sante-platform)

---

**Dernière mise à jour :** 7 novembre 2025  
**Auteur :** Équipe Développement MediPlus  
**Version :** 1.0.0
