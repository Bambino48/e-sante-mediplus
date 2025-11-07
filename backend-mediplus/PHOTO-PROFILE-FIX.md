# Correction du Problème de Photo de Profil Patient

## ✅ Problèmes Identifiés et Corrigés

### 1. **Lien Symbolique Storage Manquant**

**Problème** : Le dossier `public/storage` n'existait pas, rendant les photos inaccessibles via HTTP.

**Solution** : Exécuté `php artisan storage:link`

```
✓ Lien créé : public/storage -> storage/app/public
```

### 2. **URL de Photo Non Retournée dans les Réponses API**

**Problème** : Les endpoints renvoyaient uniquement le chemin relatif (`avatars/xxx.jpg`) sans l'URL complète.

**Solution** : Ajout d'un accesseur `photo_url` au modèle `User`

```php
// app/Models/User.php
protected $appends = ['photo_url'];

public function getPhotoUrlAttribute()
{
    if ($this->photo) {
        return asset('storage/' . $this->photo);
    }
    return null;
}
```

### 3. **Architecture de Gestion des Photos**

**Clarification** :

-   ✅ `AuthController` gère **toute** la logique de photo (upload, suppression, base64)
-   ✅ `PatientProfileController` gère **uniquement** les données médicales du patient

## 📋 Réponses API Maintenant Retournées

### Tous les endpoints qui retournent `user` incluent maintenant :

```json
{
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "photo": "avatars/YzWqRaMjBddBWFjfsNmPuqd2hf0JBsGEM X3kz2XD.jpg",
        "photo_url": "http://localhost/storage/avatars/YzWqRaMjBddBWFjfsNmPuqd2hf0JBsGEM X3kz2XD.jpg"
    }
}
```

### Endpoints concernés :

-   ✅ `POST /api/register` → retourne `photo_url`
-   ✅ `POST /api/login` → retourne `photo_url`
-   ✅ `GET /api/profile` → retourne `photo_url`
-   ✅ `PUT /api/profile` → retourne `photo_url` après mise à jour

## 🔧 Configuration Frontend

### 1. Pour Mettre à Jour la Photo (utilisez `/api/profile`)

```javascript
// Multipart upload
const formData = new FormData();
formData.append("photo", imageFile);

await fetch("http://localhost/api/profile", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
});

// OU Base64
await fetch("http://localhost/api/profile", {
    method: "PUT",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ photo: "data:image/jpeg;base64,/9j/4AAQ..." }),
});
```

### 2. Pour Afficher la Photo

```javascript
// La réponse contient maintenant photo_url
const user = response.data.user;
const imageUrl = user.photo_url; // URL complète prête à utiliser

// Dans votre template
<img src={user.photo_url} alt={user.name} />;
```

### 3. Pour Mettre à Jour les Données Patient (sans photo)

```javascript
await fetch("http://localhost/api/patient/profile", {
    method: "PUT",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        date_of_birth: "1990-01-01",
        blood_group: "O+",
        allergies: "Pollen",
    }),
});
```

## ⚠️ Points de Vérification

### Si les images ne s'affichent toujours pas :

1. **Vérifier l'URL du Backend dans `.env`**

    ```env
    APP_URL=http://localhost:8000  # Adaptez selon votre port
    ```

2. **Vérifier que le serveur tourne**

    ```bash
    php artisan serve
    # OU
    php artisan serve --port=8000
    ```

3. **Tester l'URL de la photo directement**

    ```
    http://localhost/storage/avatars/PHOTO_NAME.jpg
    ```

4. **Vérifier les permissions (Linux/Mac)**

    ```bash
    chmod -R 775 storage
    chmod -R 775 public/storage
    ```

5. **Vérifier le CORS (si frontend sur domaine différent)**
    ```php
    // config/cors.php
    'paths' => ['api/*', 'storage/*'],
    ```

## 📦 Fichiers Modifiés

1. ✅ `app/Models/User.php` - Ajout accesseur `photo_url`
2. ✅ `app/Http/Controllers/Api/AuthController.php` - Simplifié (utilise maintenant l'accesseur)
3. ✅ `app/Http/Controllers/Api/PatientProfileController.php` - Nettoyé (ne gère plus la photo)
4. ✅ `public/storage` - Lien symbolique créé

## 🧪 Test Manuel Rapide

```bash
# 1. Vérifier qu'un user existe en DB avec une photo
php artisan tinker
>>> $user = App\Models\User::first();
>>> $user->photo
=> "avatars/YzWqRaMjBddBWFjfsNmPuqd2hf0JBsGEM X3kz2XD.jpg"
>>> $user->photo_url
=> "http://localhost/storage/avatars/YzWqRaMjBddBWFjfsNmPuqd2hf0JBsGEM X3kz2XD.jpg"
>>> exit

# 2. Tester l'endpoint profile
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost/api/profile
# Devrait retourner photo_url dans la réponse
```

## ✅ Résumé

**Avant** :

-   ❌ Pas de lien storage → images inaccessibles
-   ❌ Pas de `photo_url` → frontend ne savait pas construire l'URL
-   ❌ Confusion sur quel endpoint utiliser

**Après** :

-   ✅ Lien storage créé → images accessibles via HTTP
-   ✅ `photo_url` automatique sur tous les endpoints
-   ✅ Architecture claire : `AuthController` pour photos, `PatientProfileController` pour données médicales
-   ✅ Support multipart + base64
