# 🔧 Corrections Apportées - Photo de Profil Patient

## 📋 Résumé du Problème

La photo de profil mise à jour sur `/patient/profile` ne persiste pas après rechargement de la page, malgré le message de succès "Profil mis à jour".

## ✅ Corrections Implémentées

### 1. **Amélioration de l'API** (`src/api/auth.js`)

**Avant** : Envoyait la photo en base64 dans du JSON
**Après** :

- Détecte si un fichier photo est présent (`photoFile` ou base64)
- Utilise `FormData` avec `multipart/form-data` pour les uploads
- Gère correctement l'extension du fichier
- Utilise `_method=PUT` pour Laravel

### 2. **Renforcement du Hook** (`src/hooks/useAuth.js`)

**Améliorations** :

- Extraction intelligente de `userData` depuis différentes structures de réponse
- Double refresh si la photo n'est pas présente dans la réponse
- Logs de debug détaillés pour identifier les problèmes
- Mise à jour du cache localStorage
- Mise à jour du store Zustand uniquement si userData valide

### 3. **Optimisation du Composant Profile** (`src/pages/patient/Profile.jsx`)

**Nouvelles fonctionnalités** :

- ✅ Stockage du fichier original (`photoFile`)
- ✅ Validation stricte (type image + 5MB max)
- ✅ Indicateur de chargement visuel (spinner)
- ✅ Fonction `resolvePhotoPreview()` centralisée
- ✅ Gestion des erreurs de lecture de fichier
- ✅ Logs détaillés pour debug
- ✅ Support de `photo_url`, `photo`, et `photo_path`

### 4. **Outil de Debug** (`src/components/ProfileDebugger.jsx`)

Composant visuel affiché en bas à droite qui montre :

- État actuel de l'utilisateur
- Valeurs de `photo`, `photo_url`, `photo_path`
- Contenu du cache localStorage
- Objet user complet

## 🧪 Comment Tester

### Étape 1 : Ouvrir la Console

```
F12 → Console + Network
```

### Étape 2 : Aller sur le Profil

```
/patient/profile
```

### Étape 3 : Upload une Photo

1. Cliquez sur "Changer"
2. Sélectionnez une image (< 5MB)
3. Observez le debugger en bas à droite
4. Cliquez sur "Mettre à jour"

### Étape 4 : Vérifier les Logs Console

```javascript
👤 User reçu dans Profile: {...}
🖼️ Preview initial calculé: ...
📤 Soumission du formulaire avec: {...}
📤 Payload envoyé: {...}
📸 Réponse API updateProfile: {...}  // ← IMPORTANT
📸 userData extrait: {...}
✅ Utilisateur mis à jour reçu: {...}
🖼️ Preview calculé: ...
💾 Mise en cache de: {...}
✅ Store Zustand mis à jour
```

### Étape 5 : Vérifier Network

Dans l'onglet Network, cherchez la requête `profile` :

- **Request Headers** : `multipart/form-data`
- **Request Payload** : contient le fichier
- **Response** : note la structure JSON

### Étape 6 : Rafraîchir la Page

```
F5 ou Ctrl+R
```

Vérifiez que :

- La photo est toujours affichée
- Le debugger montre `user.photo` ou `user.photo_url`

## 🔍 Diagnostic des Problèmes

### Si la photo ne s'affiche pas après upload

**Vérifier dans les logs :**

```
📸 Réponse API updateProfile: {...}
```

La structure devrait être une de ces options :

**Option A (recommandée)** :

```json
{
  "message": "...",
  "user": {
    "photo": "photos/abc123.jpg",
    "photo_url": "http://localhost:8000/storage/photos/abc123.jpg"
  }
}
```

**Option B** :

```json
{
  "data": {
    "user": { "photo": "..." }
  }
}
```

**Si différent**, ajuster `src/hooks/useAuth.js` ligne 186.

### Si la photo disparaît au refresh

**Problème 1** : Backend ne sauvegarde pas

```bash
# Laravel
php artisan storage:link
chmod -R 775 storage/app/public
```

**Problème 2** : Cache localStorage vide

- Vérifier le debugger : section "LocalStorage Cache"
- Si vide → le `setUser()` n'est pas appelé

**Problème 3** : Chemin incorrect

- Vérifier `resolvePhotoPreview()` dans Profile.jsx
- Ajuster la construction de l'URL selon votre backend

## 📁 Fichiers Modifiés

```
✏️  src/api/auth.js
✏️  src/hooks/useAuth.js
✏️  src/pages/patient/Profile.jsx
➕  src/components/ProfileDebugger.jsx
➕  DEBUG_PHOTO_PROFIL.md
```

## 🚀 Prochaines Étapes

1. **Tester l'upload** avec les logs activés
2. **Noter la structure** de réponse API réelle
3. **Ajuster si nécessaire** la ligne 186 de `useAuth.js`
4. **Retirer les logs** une fois le problème résolu :
   ```javascript
   // Retirer tous les console.log()
   // Retirer <ProfileDebugger />
   ```

## 🎯 Points Clés

- ✅ FormData + multipart/form-data pour les fichiers
- ✅ Double refresh pour garantir les données
- ✅ Cache localStorage synchronisé
- ✅ Support de multiples formats de réponse API
- ✅ Validation et gestion d'erreurs robustes
- ✅ Outils de debug intégrés

## ⚠️ Important

Une fois le problème identifié et résolu :

1. Retirez `<ProfileDebugger />` de `Profile.jsx`
2. Supprimez ou commentez les `console.log()`
3. Vérifiez que tout fonctionne en production
