# 🔍 Debug Photo de Profil - Guide de Test

## Étapes pour identifier le problème

### 1. Ouvrir la Console Développeur

- Appuyez sur `F12` dans votre navigateur
- Allez dans l'onglet `Console`
- Ouvrez aussi l'onglet `Network` (Réseau)

### 2. Tester l'Upload de Photo

1. **Allez sur** `/patient/profile`
2. **Sélectionnez une photo** via le bouton "Changer"
3. **Observez les logs console** :

   - `👤 User reçu dans Profile:` - données utilisateur au chargement
   - `🖼️ Preview initial calculé:` - URL de preview initiale
   - `📤 Soumission du formulaire avec:` - données du formulaire
   - `📤 Payload envoyé:` - ce qui est réellement envoyé à l'API

4. **Cliquez sur "Mettre à jour"**
5. **Vérifiez les logs suivants** :
   - `📸 Réponse API updateProfile:` - **IMPORTANT** : noter la structure
   - `📸 userData extrait:` - données extraites de la réponse
   - `✅ Utilisateur mis à jour reçu:` - données finales
   - `🖼️ Preview calculé:` - nouvelle URL calculée

### 3. Vérifier la Requête Réseau

Dans l'onglet Network :

- Cherchez la requête `profile` (méthode POST ou PUT)
- Cliquez dessus
- Vérifiez :
  - **Request Headers** : doit contenir `multipart/form-data` si photo envoyée
  - **Request Payload** : doit contenir le fichier photo
  - **Response** : noter **EXACTEMENT** la structure JSON retournée

### 4. Points Critiques à Vérifier

#### Structure de réponse attendue de l'API Laravel :

Option A (recommandée) :

```json
{
  "message": "Profil mis à jour",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "photo": "photos/abc123.jpg", // ← chemin relatif
    "photo_url": "http://localhost:8000/storage/photos/abc123.jpg" // ← URL complète
  }
}
```

Option B :

```json
{
  "data": {
    "user": {
      "id": 1,
      "photo": "photos/abc123.jpg"
    }
  }
}
```

Option C :

```json
{
  "id": 1,
  "photo": "photos/abc123.jpg"
}
```

#### Problèmes possibles identifiés :

1. **Backend ne sauvegarde pas la photo**

   - Vérifier les logs Laravel
   - Vérifier les permissions du dossier `storage/app/public/photos`
   - Vérifier le lien symbolique `php artisan storage:link`

2. **Backend renvoie un mauvais format**

   - Adapter `useAuth.js` ligne 186-191 selon la structure réelle

3. **Chemin photo incorrect**

   - Vérifier que l'API retourne soit :
     - `photo_url` : URL complète
     - OU `photo` : chemin relatif (ex: `photos/abc.jpg`)

4. **Photo non chargée au refresh**
   - Le cache localStorage contient-il la photo ?
   - Le useEffect se déclenche-t-il avec les bonnes données ?

## 🔧 Corrections à apporter selon les logs

### Si la réponse API est différente de ce qu'on attend

Dans `src/hooks/useAuth.js`, modifier la ligne 186 :

```javascript
// Actuellement :
let userData = res?.user || res?.data?.user || res?.data || res;

// Si la réponse est { success: true, data: {...} } :
let userData = res?.data || res?.user || res;

// Si la réponse est directement l'user { id: 1, name: ... } :
let userData = res;
```

### Si le chemin de la photo est incorrect

Dans `src/pages/patient/Profile.jsx`, vérifier `resolvePhotoPreview` :

```javascript
// Actuellement construit : http://localhost:8000/storage/photos/abc.jpg
// Si le backend renvoie déjà le chemin complet, adapter la logique
```

## 📋 Checklist Finale

- [ ] Les logs montrent que `photoFile` est bien un objet File
- [ ] La requête Network montre `multipart/form-data`
- [ ] La réponse contient bien un champ photo (chemin ou URL)
- [ ] `userData` après extraction contient la photo
- [ ] Le preview est correctement calculé
- [ ] Le user dans le store Zustand est mis à jour
- [ ] Au refresh de la page, user.photo ou user.photo_url existe

## 🚀 Prochaines Étapes

Une fois les logs récupérés, ajustez le code selon la structure réelle de votre API Laravel.
