# 📋 Instructions Backend Laravel - Dashboard Patient

## 🎯 Endpoints à ajouter dans `routes/api.php`

Ajoute ces routes dans la section `Route::middleware('auth:sanctum')->group()` :

```php
// === Dashboard Patient - Données temps réel ===
Route::get('/patient/appointments/next', [AppointmentController::class, 'nextAppointment']);
Route::get('/medications/today', [MedicationController::class, 'today']);
Route::get('/notifications/unread', [NotificationController::class, 'unread']);
Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
```

---

## 📝 Méthodes à ajouter dans les contrôleurs

### 1️⃣ **AppointmentController.php**

```php
/**
 * Récupère le prochain rendez-vous confirmé du patient
 *
 * @return \Illuminate\Http\JsonResponse
 */
public function nextAppointment(Request $request)
{
    $userId = $request->user()->id;

    $appointment = DB::table('appointments')
        ->where('patient_id', $userId)
        ->where('status', 'confirmed')
        ->where('scheduled_at', '>', now())
        ->orderBy('scheduled_at', 'asc')
        ->first();

    // Récupérer le nom du docteur si disponible
    if ($appointment && $appointment->doctor_id) {
        $doctor = DB::table('users')->where('id', $appointment->doctor_id)->first();
        $appointment->doctor_name = $doctor ? $doctor->name : null;
    }

    return response()->json([
        'appointment' => $appointment
    ]);
}
```

---

### 2️⃣ **MedicationController.php** (déjà existe, vérifier la méthode `today`)

Si la méthode `today()` n'existe pas encore, ajoute :

```php
/**
 * Récupère les médicaments à prendre aujourd'hui
 *
 * @return \Illuminate\Http\JsonResponse
 */
public function today(Request $request)
{
    $userId = $request->user()->id;
    $today = now()->toDateString();

    // Récupérer les prescriptions actives du patient
    $prescriptionIds = DB::table('prescriptions')
        ->where('patient_id', $userId)
        ->pluck('id');

    // Récupérer les médicaments dont la période de traitement inclut aujourd'hui
    $medications = DB::table('medications')
        ->whereIn('prescription_id', $prescriptionIds)
        ->where('start_date', '<=', $today)
        ->whereRaw('DATE_ADD(start_date, INTERVAL duration_days DAY) >= ?', [$today])
        ->get();

    // Parser le champ JSON 'times' si nécessaire
    foreach ($medications as $med) {
        $med->times = json_decode($med->times, true);
    }

    return response()->json([
        'items' => $medications
    ]);
}
```

---

### 3️⃣ **NotificationController.php**

```php
/**
 * Récupère les notifications non lues du patient
 *
 * @return \Illuminate\Http\JsonResponse
 */
public function unread(Request $request)
{
    $userId = $request->user()->id;

    $notifications = DB::table('notifications_custom')
        ->where('user_id', $userId)
        ->whereNull('read_at')
        ->orderBy('created_at', 'desc')
        ->get();

    // Parser le champ JSON 'data' si nécessaire
    foreach ($notifications as $notif) {
        $notif->data = json_decode($notif->data, true);
    }

    return response()->json([
        'items' => $notifications,
        'count' => $notifications->count()
    ]);
}

/**
 * Marque une notification comme lue
 *
 * @param int $id
 * @return \Illuminate\Http\JsonResponse
 */
public function markAsRead(Request $request, $id)
{
    $userId = $request->user()->id;

    $updated = DB::table('notifications_custom')
        ->where('id', $id)
        ->where('user_id', $userId)
        ->update(['read_at' => now()]);

    return response()->json([
        'success' => $updated > 0,
        'message' => $updated > 0
            ? 'Notification marquée comme lue'
            : 'Notification introuvable'
    ]);
}
```

---

## ✅ Vérifications à faire

1. **Importe `DB` en haut des contrôleurs** :

   ```php
   use Illuminate\Support\Facades\DB;
   ```

2. **Teste les endpoints** avec Postman/Insomnia :

   - `GET /api/patient/appointments/next`
   - `GET /api/medications/today`
   - `GET /api/notifications/unread`
   - `PATCH /api/notifications/1/read`

3. **Vérifie que l'authentification Sanctum fonctionne** :
   - Chaque requête doit avoir le header `Authorization: Bearer {token}`

---

## 🔄 Migration à créer pour la table `medications` (si manquante)

Si la colonne `times` n'existe pas encore dans la table `medications` :

```php
Schema::table('medications', function (Blueprint $table) {
    $table->json('times')->nullable()->after('frequency');
    $table->date('start_date')->nullable()->after('duration_days');
});
```

---

## 🚀 Après avoir ajouté ces endpoints

Redémarre le serveur Laravel et teste dans le frontend - les 3 sections du Dashboard devraient se mettre à jour automatiquement !
