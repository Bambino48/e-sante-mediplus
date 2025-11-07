# 🔗 Routes Backend Laravel Requises

## ✅ Routes Déjà Implémentées (selon api.php)

```php
Route::get('/patient/appointments', [AppointmentController::class, 'index']);
Route::get('/patient/appointments/next', [AppointmentController::class, 'next']);
Route::post('/patient/appointments', [AppointmentController::class, 'store']);
Route::post('/pro/appointments/{id}/confirm', [AppointmentController::class, 'confirm']);
```

## ⚠️ Routes Manquantes à Ajouter

### 1. Annuler un rendez-vous (Patient)

```php
// À ajouter dans api.php
Route::delete('/patient/appointments/{id}', [AppointmentController::class, 'cancel']);
```

**Contrôleur :**

```php
// AppointmentController.php

public function cancel($id)
{
    $appointment = Appointment::where('id', $id)
        ->where('patient_id', auth()->id())
        ->firstOrFail();

    // Vérifier que le rendez-vous n'est pas déjà passé
    if ($appointment->scheduled_at < now()) {
        return response()->json([
            'message' => 'Impossible d\'annuler un rendez-vous passé'
        ], 400);
    }

    $appointment->update(['status' => 'cancelled']);

    return response()->json([
        'success' => true,
        'message' => 'Rendez-vous annulé avec succès',
        'appointment' => $appointment
    ]);
}
```

### 2. Modifier un rendez-vous (Patient)

```php
// À ajouter dans api.php
Route::put('/patient/appointments/{id}', [AppointmentController::class, 'update']);
```

**Contrôleur :**

```php
// AppointmentController.php

public function update(Request $request, $id)
{
    $appointment = Appointment::where('id', $id)
        ->where('patient_id', auth()->id())
        ->firstOrFail();

    $validated = $request->validate([
        'scheduled_at' => 'sometimes|date|after:now',
        'reason' => 'sometimes|string|max:255',
        'notes' => 'sometimes|string|max:1000',
    ]);

    $appointment->update($validated);

    return response()->json([
        'success' => true,
        'message' => 'Rendez-vous modifié avec succès',
        'appointment' => $appointment->fresh()
    ]);
}
```

## 📊 Format des Données

### Structure de la table `appointments`

```sql
id              INT
patient_id      INT
doctor_id       INT
scheduled_at    DATETIME
status          VARCHAR (confirmed|pending|cancelled|completed)
reason          VARCHAR
notes           TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Réponse API attendue pour `GET /patient/appointments`

```json
[
  {
    "id": 1,
    "patient_id": 6,
    "doctor_id": 5,
    "scheduled_at": "2025-11-03 10:00:00",
    "status": "confirmed",
    "reason": "Consultation générale",
    "notes": null,
    "created_at": "2025-11-02 15:15:54",
    "updated_at": "2025-11-02 15:16:15",
    "doctor": {
      "id": 5,
      "name": "Dr. Marie Kouassi",
      "specialization": "Cardiologie",
      "email": "marie.kouassi@mediplus.ci",
      "phone": "+225 07 XX XX XX XX"
    }
  }
]
```

### Requête pour créer un rendez-vous

```javascript
POST /patient/appointments
{
  "doctor_id": 5,
  "scheduled_at": "2025-11-15T10:00:00.000Z",
  "reason": "Consultation générale",
  "mode": "physical" // ou "video"
}
```

## 🔄 Relations Eloquent Requises

Dans `App\Models\Appointment.php` :

```php
public function doctor()
{
    return $this->belongsTo(Doctor::class);
}

public function patient()
{
    return $this->belongsTo(User::class, 'patient_id');
}
```

Dans `AppointmentController@index` :

```php
public function index()
{
    $appointments = Appointment::where('patient_id', auth()->id())
        ->with('doctor') // ✅ Important : charger la relation
        ->orderBy('scheduled_at', 'asc')
        ->get();

    return response()->json($appointments);
}
```

## 🎯 Checklist Backend

- [ ] Ajouter `Route::delete('/patient/appointments/{id}')`
- [ ] Ajouter `Route::put('/patient/appointments/{id}')`
- [ ] Implémenter `AppointmentController@cancel`
- [ ] Implémenter `AppointmentController@update`
- [ ] Vérifier que la relation `doctor()` est chargée dans `index()`
- [ ] Tester l'annulation d'un rendez-vous
- [ ] Tester la modification d'un rendez-vous
- [ ] Valider que seul le patient propriétaire peut annuler/modifier

## 🧪 Tests Recommandés

```bash
# Tester la liste des rendez-vous
curl -X GET http://localhost:8000/api/patient/appointments \
  -H "Authorization: Bearer {token}"

# Tester l'annulation
curl -X DELETE http://localhost:8000/api/patient/appointments/1 \
  -H "Authorization: Bearer {token}"

# Tester la modification
curl -X PUT http://localhost:8000/api/patient/appointments/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Nouveau motif"}'
```
