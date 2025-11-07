# 🎥 Documentation Téléconsultation - MediPlus

## ✅ Architecture Complète Implémentée

### 📋 Structure Frontend (React)

#### 1. API Layer (`src/api/teleconsultations.js`)

```javascript
// ✅ Fonctions disponibles
createTeleconsultRoom(doctorId); // Créer une nouvelle salle
getTeleconsultToken(roomId); // Obtenir token Agora pour rejoindre
endTeleconsultRoom(roomId); // Terminer une session
getActiveTeleconsults(); // Liste des sessions actives
getTeleconsultHistory(); // Historique des consultations
```

#### 2. Interface Patient (`src/pages/patient/Teleconsult.jsx`)

**Fonctionnalités** :

- ✅ Vue des sessions actives avec bouton "Rejoindre"
- ✅ Historique des consultations passées
- ✅ Création de nouvelle salle en un clic
- ✅ Intégration complète avec VideoRoom
- ✅ Gestion d'état professionnelle (React Query)
- ✅ Animations et transitions fluides

**Onglets** :

1. **Sessions actives** : Affiche les rendez-vous en mode `video` avec status `confirmed` ou `in_progress`
2. **Historique** : Affiche les consultations terminées (`status: completed`)

#### 3. Composant Vidéo (`src/components/VideoRoom.jsx`)

- ✅ Déjà implémenté avec SimplePeer
- ✅ Contrôles audio/vidéo (micro, caméra)
- ✅ Gestion des erreurs et cleanup
- ✅ Intégration WebRTC

---

## 📡 Routes Backend Laravel (Existantes)

```php
// ✅ Déjà définies dans api.php
POST   /teleconsult/create
GET    /teleconsult/token/{roomId}
POST   /teleconsult/end/{roomId}
```

---

## 🗄️ Structure Base de Données

### Table : `teleconsult_rooms`

```sql
id               INT PRIMARY KEY AUTO_INCREMENT
room_id          VARCHAR(255) UNIQUE
doctor_id        INT (FK users)
patient_id       INT (FK users)
status           ENUM('active', 'ended')
started_at       TIMESTAMP
ended_at         TIMESTAMP NULL
created_at       TIMESTAMP
updated_at       TIMESTAMP
```

**Exemple de données** :

```json
{
  "id": 1,
  "room_id": "room_Cpvbv6Ftik",
  "doctor_id": 7,
  "patient_id": 2,
  "status": "ended",
  "started_at": "2025-11-02 15:26:31",
  "ended_at": "2025-11-02 15:34:29"
}
```

---

## 🔧 Implémentation Backend Requise

### 1. Contrôleur `TeleconsultController.php`

```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeleconsultRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TeleconsultController extends Controller
{
    /**
     * ✅ Créer une nouvelle salle de téléconsultation
     * POST /teleconsult/create
     */
    public function create(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'sometimes|exists:users,id',
        ]);

        $room = TeleconsultRoom::create([
            'room_id' => 'room_' . Str::random(10),
            'patient_id' => auth()->id(),
            'doctor_id' => $validated['doctor_id'] ?? null,
            'status' => 'active',
            'started_at' => now(),
        ]);

        // Charger la relation doctor si présente
        $room->load('doctor');

        return response()->json($room, 201);
    }

    /**
     * ✅ Obtenir le token Agora pour rejoindre une salle
     * GET /teleconsult/token/{roomId}
     */
    public function token($roomId)
    {
        $room = TeleconsultRoom::where('room_id', $roomId)
            ->where(function ($q) {
                $q->where('patient_id', auth()->id())
                  ->orWhere('doctor_id', auth()->id());
            })
            ->firstOrFail();

        // 🔑 Générer token Agora (si vous utilisez Agora)
        // Pour SimplePeer (peer-to-peer), pas besoin de token serveur

        return response()->json([
            'room_id' => $room->room_id,
            'token' => null, // SimplePeer n'a pas besoin de token
            'appId' => null,
            'channel' => $room->room_id,
            'uid' => auth()->id(),
        ]);
    }

    /**
     * ✅ Terminer une téléconsultation
     * POST /teleconsult/end/{roomId}
     */
    public function end($roomId)
    {
        $room = TeleconsultRoom::where('room_id', $roomId)
            ->where(function ($q) {
                $q->where('patient_id', auth()->id())
                  ->orWhere('doctor_id', auth()->id());
            })
            ->firstOrFail();

        $room->update([
            'status' => 'ended',
            'ended_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'ended_at' => $room->ended_at,
        ]);
    }
}
```

### 2. Modèle `TeleconsultRoom.php`

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeleconsultRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'doctor_id',
        'patient_id',
        'status',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}
```

### 3. Migration (déjà créée selon votre schéma)

```php
Schema::create('teleconsult_rooms', function (Blueprint $table) {
    $table->id();
    $table->string('room_id')->unique();
    $table->foreignId('doctor_id')->nullable()->constrained('users')->onDelete('cascade');
    $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
    $table->enum('status', ['active', 'ended'])->default('active');
    $table->timestamp('started_at')->nullable();
    $table->timestamp('ended_at')->nullable();
    $table->timestamps();

    $table->index(['patient_id', 'status']);
    $table->index(['doctor_id', 'status']);
});
```

---

## 🔄 Flux Utilisateur Complet

### Scénario 1 : Patient démarre une consultation

```mermaid
Patient → "Téléconsultation" (sidebar)
    ↓
Frontend affiche les sessions actives
    ↓
Patient clique "Nouvelle consultation"
    ↓
POST /teleconsult/create
    ↓
Backend crée room_XXXXXX dans teleconsult_rooms
    ↓
Frontend reçoit room_id + doctor info
    ↓
GET /teleconsult/token/{roomId}
    ↓
Backend retourne token (ou null pour SimplePeer)
    ↓
VideoRoom s'ouvre en plein écran
    ↓
WebRTC établit la connexion peer-to-peer
    ↓
Patient peut activer/désactiver micro/caméra
    ↓
Patient clique "Raccrocher"
    ↓
POST /teleconsult/end/{roomId}
    ↓
Backend met status = 'ended', ended_at = now()
    ↓
Retour au dashboard
```

### Scénario 2 : Rejoindre une session existante

```mermaid
Patient a un RDV vidéo planifié (appointments.mode = "video")
    ↓
Frontend filtre et affiche dans "Sessions actives"
    ↓
Patient clique "Rejoindre"
    ↓
GET /teleconsult/token/{roomId}
    ↓
VideoRoom s'ouvre avec le token
    ↓
Connexion établie avec le médecin
```

---

## 🎯 Checklist Backend

- [ ] Vérifier que les routes sont bien enregistrées dans `api.php`
- [ ] Créer/vérifier le contrôleur `TeleconsultController`
- [ ] Créer/vérifier le modèle `TeleconsultRoom`
- [ ] Vérifier que la migration existe et est exécutée
- [ ] Tester `POST /teleconsult/create`
- [ ] Tester `GET /teleconsult/token/{roomId}`
- [ ] Tester `POST /teleconsult/end/{roomId}`
- [ ] Vérifier la sécurité (seul patient/doctor peut accéder)
- [ ] Charger la relation `doctor` dans `create()`

---

## 🧪 Tests API

### Créer une salle

```bash
curl -X POST http://localhost:8000/api/teleconsult/create \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"doctor_id": 5}'
```

**Réponse attendue** :

```json
{
  "id": 2,
  "room_id": "room_Abc123XyZ",
  "patient_id": 6,
  "doctor_id": 5,
  "status": "active",
  "started_at": "2025-11-07T10:30:00Z",
  "ended_at": null,
  "doctor": {
    "id": 5,
    "name": "Dr. Marie Kouassi",
    "specialization": "Cardiologie"
  }
}
```

### Obtenir le token

```bash
curl -X GET http://localhost:8000/api/teleconsult/token/room_Abc123XyZ \
  -H "Authorization: Bearer {token}"
```

### Terminer la session

```bash
curl -X POST http://localhost:8000/api/teleconsult/end/room_Abc123XyZ \
  -H "Authorization: Bearer {token}"
```

---

## 🚀 Améliorations Futures

### Court terme

- [ ] Ajouter route backend pour liste des sessions actives du patient
- [ ] Implémenter notification temps réel (Pusher/WebSocket) pour invitations
- [ ] Ajouter durée de consultation dans la BDD
- [ ] Enregistrement de la consultation (optionnel)

### Moyen terme

- [ ] Intégration Agora.io pour qualité vidéo professionnelle
- [ ] Chat texte pendant la consultation
- [ ] Partage d'écran pour le médecin
- [ ] Enregistrement des notes de consultation
- [ ] Système de facturation post-consultation

### Long terme

- [ ] Intelligence artificielle pour transcription
- [ ] Traduction en temps réel
- [ ] Détection automatique de problèmes de connexion
- [ ] Mode faible bande passante

---

## 📚 Ressources

- **SimplePeer** : https://github.com/feross/simple-peer
- **Agora SDK** : https://www.agora.io/en/
- **WebRTC Best Practices** : https://webrtc.org/

---

## ✅ État Actuel

**Frontend** : ✅ Complètement implémenté et prêt
**Backend** : ⚠️ Routes définies, contrôleur à vérifier/compléter
**BDD** : ✅ Table `teleconsult_rooms` existe
**Intégration** : ✅ Navigation sidebar configurée

Le système est prêt à être testé dès que le backend retourne les bonnes données ! 🎉
