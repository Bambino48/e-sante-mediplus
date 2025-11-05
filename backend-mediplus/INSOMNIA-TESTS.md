# Guide de Test Insomnia - Mediplus Backend API

## Configuration MySQL réussie ! ✅

Le projet utilise maintenant **MySQL avec XAMPP** au lieu de SQLite.

### Configuration Appliquée

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mediplus_backend
DB_USERNAME=root
DB_PASSWORD=
```

### Base de données créée

-   ✅ Base : `mediplus_backend`
-   ✅ 15 tables migrées avec succès
-   ✅ 5 docteurs de test ajoutés
-   ✅ 8 spécialités médicales
-   ✅ Données réalistes pour le Sénégal

---

## Tests Insomnia Recommandés

### 1. Test d'Enregistrement Utilisateur ✅

**URL :** `POST http://127.0.0.1:8000/api/register`

**Headers :**

```
Content-Type: application/json
Accept: application/json
```

**Body (JSON) :**

```json
{
    "name": "Patient Test",
    "email": "patient@test.com",
    "password": "secret123",
    "role": "patient",
    "phone": "0700000001",
    "latitude": "5.3476",
    "longitude": "-4.0229"
}
```

**Réponse attendue :** 200 avec token d'authentification

---

### 2. Test Liste des Docteurs ✅

**URL :** `GET http://127.0.0.1:8000/api/doctors`

**Headers :**

```
Accept: application/json
```

**Réponse :** 5 docteurs avec profils complets

---

### 3. Test Filtrage par Spécialité

**URL :** `GET http://127.0.0.1:8000/api/doctors?specialty=Cardiologie`

**Réponse :** Dr. Amadou DIALLO (Cardiologue)

---

### 4. Test Filtrage par Ville

**URL :** `GET http://127.0.0.1:8000/api/doctors?city=Dakar`

**Réponse :** Tous les 5 docteurs (tous à Dakar)

---

### 5. Test Tri par Note

**URL :** `GET http://127.0.0.1:8000/api/doctors?sort_by=rating&sort_order=desc`

**Réponse :** Dr. Moussa KANE en premier (4.9/5)

---

### 6. Test Connexion Utilisateur

**URL :** `POST http://127.0.0.1:8000/api/login`

**Body :**

```json
{
    "email": "patient@test.com",
    "password": "secret123"
}
```

---

### 7. Test Routes Protégées (avec token)

**URL :** `GET http://127.0.0.1:8000/api/profile`

**Headers :**

```
Authorization: Bearer YOUR_TOKEN_HERE
Accept: application/json
```

---

## Docteurs de Test Disponibles

1. **Dr. Amadou DIALLO** - Cardiologie (4.8/5) - 25 000 FCFA
2. **Dr. Fatou NDIAYE** - Dermatologie (4.6/5) - 20 000 FCFA
3. **Dr. Moussa KANE** - Pédiatrie (4.9/5) - 18 000 FCFA
4. **Dr. Aissatou FALL** - Gynécologie (4.7/5) - 30 000 FCFA
5. **Dr. Ibrahima SARR** - Médecine Générale (4.5/5) - 15 000 FCFA

---

## Commandes de Maintenance

### Redémarrer le serveur

```bash
php artisan serve --port=8000
```

### Vérifier la base de données

```bash
php artisan migrate:status
```

### Nettoyer le cache

```bash
php artisan config:clear
php artisan config:cache
```

---

## Résolution du Problème

❌ **Avant :** Erreur 500 avec SQLite  
✅ **Après :** Succès avec MySQL XAMPP

**Changements appliqués :**

-   Configuration .env pour MySQL
-   Création de la base `mediplus_backend`
-   Migration des 15 tables
-   Suppression de l'ancien SQLite
-   Ajout de données de test réalistes

**Le projet est maintenant 100% fonctionnel avec MySQL ! 🚀**
