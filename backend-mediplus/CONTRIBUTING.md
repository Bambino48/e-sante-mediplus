# Contributing to Mediplus Backend API

Merci de votre intérêt pour contribuer à **Mediplus Backend API** ! Ce guide vous aidera à comprendre comment participer efficacement au projet.

## Table des Matières

-   [Comment Contribuer](#comment-contribuer)
-   [Configuration de l'Environnement](#configuration-de-lenvironnement)
-   [Conventions de Code](#conventions-de-code)
-   [Tests](#tests)
-   [Process de Pull Request](#process-de-pull-request)
-   [Signaler des Bugs](#signaler-des-bugs)
-   [Proposer des Fonctionnalités](#proposer-des-fonctionnalités)
-   [Code de Conduite](#code-de-conduite)

## Comment Contribuer

### Types de Contributions

-   **Corrections de bugs** - Résoudre des problèmes existants
-   **✨ Nouvelles fonctionnalités** - Ajouter des capabilities à l'API
-   **📚 Documentation** - Améliorer la documentation
-   **🧪 Tests** - Ajouter ou améliorer la couverture de tests
-   **⚡ Performance** - Optimisations et améliorations
-   **🛡️ Sécurité** - Corrections de vulnérabilités

### 🗺️ Roadmap du Projet

| Phase       | Status      | Description                 |
| ----------- | ----------- | --------------------------- |
| **Phase 1** | ✅ Complété | Authentification & Profils  |
| **Phase 2** | ✅ Complété | Recherche & Catalogue       |
| **Phase 3** | ✅ Complété | Système de Rendez-vous      |
| **Phase 4** | 🚧 En cours | Téléconsultation            |
| **Phase 5** | 📋 Planifié | Prescriptions & Ordonnances |
| **Phase 6** | 📋 Planifié | IA de Triage Médical        |
| **Phase 7** | 📋 Planifié | Paiements & Facturation     |
| **Phase 8** | 📋 Planifié | Notifications               |
| **Phase 9** | 📋 Planifié | Configuration & Admin       |

## 🚀 Configuration de l'Environnement

### 📋 Prérequis

```bash
# Versions requises
PHP >= 8.4.5
Composer >= 2.6
MySQL >= 8.0
Redis >= 6.0 (optionnel)
Git >= 2.30
```

### ⚡ Setup Rapide

```bash
# 1. Fork et clone le projet
git clone https://github.com/VOTRE-USERNAME/mediplus-backend.git
cd mediplus-backend

# 2. Ajouter le remote upstream
git remote add upstream https://github.com/mediplus/backend.git

# 3. Installer les dépendances
composer install

# 4. Configuration environnement
cp .env.example .env
php artisan key:generate

# 5. Base de données
php artisan migrate
php artisan db:seed

# 6. Vérifier l'installation
vendor/bin/phpunit
```

### 🔧 Configuration IDE

#### VS Code Extensions Recommandées

```json
{
    "recommendations": [
        "bmewburn.vscode-intelephense-client",
        "onecentlin.laravel-blade",
        "ryannaddy.laravel-artisan",
        "codingyu.laravel-goto-view",
        "mohamedbenhida.laravel-intellisense"
    ]
}
```

#### PhpStorm Configuration

-   Activer **Laravel Plugin**
-   Configurer **PHP Code Sniffer** (PSR-12)
-   Paramétrer **PHPUnit** pour les tests
-   Activer **Git Integration**

## 📝 Conventions de Code

### 🏗️ Standards de Code

Nous suivons les standards **PSR-12** avec quelques conventions spécifiques :

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class AuthController
 *
 * Gère l'authentification des utilisateurs via Sanctum
 *
 * @package App\Http\Controllers\Api
 */
class AuthController extends Controller
{
    /**
     * Connecter un utilisateur
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        // Validation des données
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        // Logique métier
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('mediplus_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ],
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Identifiants invalides',
        ], 401);
    }
}
```

### 📋 Conventions de Nommage

#### Variables et Méthodes

```php
// ✅ Bon - camelCase
$userName = 'John Doe';
$userProfile = $this->getUserProfile();

// ❌ Mauvais - snake_case
$user_name = 'John Doe';
$user_profile = $this->get_user_profile();
```

#### Classes et Namespaces

```php
// ✅ Bon - PascalCase
class DoctorProfileController
class TeleconsultationService

// ❌ Mauvais
class doctor_profile_controller
class teleconsultationservice
```

#### Constants

```php
// ✅ Bon - SCREAMING_SNAKE_CASE
const MAX_CONSULTATION_DURATION = 60;
const DEFAULT_CONSULTATION_FEE = 50.00;

// ❌ Mauvais
const maxConsultationDuration = 60;
const defaultConsultationFee = 50.00;
```

### 🗂️ Structure des Fichiers

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       ├── AuthController.php
│   │       ├── DoctorController.php
│   │       └── PatientController.php
│   ├── Middleware/
│   ├── Requests/
│   │   ├── Auth/
│   │   │   ├── LoginRequest.php
│   │   │   └── RegisterRequest.php
│   │   └── Doctor/
│   └── Resources/
│       ├── Auth/
│       └── Doctor/
├── Models/
│   ├── User.php
│   ├── DoctorProfile.php
│   └── Appointment.php
├── Services/
│   ├── AuthService.php
│   ├── NotificationService.php
│   └── PaymentService.php
└── Exceptions/
    ├── AuthenticationException.php
    └── PaymentException.php
```

## 🧪 Tests

### 📋 Stratégie de Tests

Nous utilisons **PHPUnit** avec une approche de tests à plusieurs niveaux :

```php
<?php

namespace Tests\Unit\Services;

use App\Services\AuthService;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Test du service d'authentification
 */
class AuthServiceTest extends TestCase
{
    use RefreshDatabase;

    protected AuthService $authService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authService = new AuthService();
    }

    /**
     * Test de création d'utilisateur
     */
    public function test_can_create_user(): void
    {
        $userData = [
            'name' => 'Dr. Test',
            'email' => 'test@mediplus.com',
            'password' => 'password123',
        ];

        $user = $this->authService->createUser($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('Dr. Test', $user->name);
        $this->assertDatabaseHas('users', [
            'email' => 'test@mediplus.com',
        ]);
    }

    /**
     * Test d'authentification valide
     */
    public function test_can_authenticate_user(): void
    {
        $user = User::factory()->create([
            'email' => 'test@mediplus.com',
            'password' => bcrypt('password123'),
        ]);

        $result = $this->authService->authenticate(
            'test@mediplus.com',
            'password123'
        );

        $this->assertTrue($result['success']);
        $this->assertNotNull($result['token']);
    }
}
```

### 🧪 Types de Tests

#### Tests Unitaires

```bash
# Tester une classe isolée
vendor/bin/phpunit tests/Unit/Services/AuthServiceTest.php

# Tous les tests unitaires
vendor/bin/phpunit tests/Unit/
```

#### Tests de Fonctionnalités

```bash
# Tester un endpoint complet
vendor/bin/phpunit tests/Feature/Auth/LoginTest.php

# Tous les tests de fonctionnalités
vendor/bin/phpunit tests/Feature/
```

#### Tests d'Intégration

```bash
# Tests avec base de données
vendor/bin/phpunit tests/Integration/

# Tests avec services externes
vendor/bin/phpunit tests/Integration/PaymentServiceTest.php
```

### 📊 Couverture de Code

```bash
# Générer rapport de couverture
vendor/bin/phpunit --coverage-html coverage/

# Voir le rapport
open coverage/index.html
```

**Objectifs de Couverture :**

-   **Contrôleurs** : > 90%
-   **Services** : > 95%
-   **Modèles** : > 80%
-   **Middleware** : > 85%

## 📋 Process de Pull Request

### 🔄 Workflow Git

```bash
# 1. Créer une branche feature
git checkout -b feature/add-doctor-availability

# 2. Faire vos modifications
# ... code changes ...

# 3. Commiter avec convention
git add .
git commit -m "feat(doctor): add availability management endpoint"

# 4. Pousser la branche
git push origin feature/add-doctor-availability

# 5. Créer une Pull Request sur GitHub
```

### 📝 Convention de Commits

Nous utilisons **Conventional Commits** :

```bash
# Types de commits
feat:     # Nouvelle fonctionnalité
fix:      # Correction de bug
docs:     # Documentation uniquement
style:    # Changements de style (formatting, etc.)
refactor: # Refactoring du code
test:     # Ajout ou modification de tests
chore:    # Tâches de maintenance

# Exemples
git commit -m "feat(auth): add two-factor authentication"
git commit -m "fix(payment): resolve Orange Money integration issue"
git commit -m "docs(api): update endpoint documentation"
git commit -m "test(doctor): add availability controller tests"
```

### 🔍 Checklist Pull Request

Avant de soumettre votre PR, vérifiez :

-   [ ] **Code Quality**

    -   [ ] Respect des conventions PSR-12
    -   [ ] Code documenté avec PHPDoc
    -   [ ] Pas de code mort ou commenté
    -   [ ] Variables et méthodes nommées clairement

-   [ ] **Tests**

    -   [ ] Tests unitaires ajoutés/mis à jour
    -   [ ] Tous les tests passent (`vendor/bin/phpunit`)
    -   [ ] Couverture de code maintenue/améliorée

-   [ ] **Documentation**

    -   [ ] README mis à jour si nécessaire
    -   [ ] Documentation API mise à jour
    -   [ ] Commentaires dans le code

-   [ ] **Sécurité**
    -   [ ] Validation des données d'entrée
    -   [ ] Gestion appropriée des erreurs
    -   [ ] Pas de données sensibles en dur

### 📋 Template Pull Request

```markdown
## 🎯 Description

Brève description des changements apportés.

## 🔗 Issue Liée

Fixes #123

## 🧪 Type de Changement

-   [ ] 🐛 Bug fix
-   [ ] ✨ Nouvelle fonctionnalité
-   [ ] 💥 Breaking change
-   [ ] 📚 Documentation
-   [ ] 🧪 Tests

## 🧪 Tests

-   [ ] Tests unitaires ajoutés
-   [ ] Tests d'intégration ajoutés
-   [ ] Tests manuels effectués

## 📸 Screenshots (si applicable)

## 📋 Checklist

-   [ ] Code suit les conventions du projet
-   [ ] Tests ajoutés et passent
-   [ ] Documentation mise à jour
-   [ ] Pas de breaking changes non documentés
```

## 🐛 Signaler des Bugs

### 📋 Template Bug Report

```markdown
## 🐛 Bug Description

Description claire et concise du problème.

## 🔄 Steps to Reproduce

1. Aller à '...'
2. Cliquer sur '...'
3. Faire défiler jusqu'à '...'
4. Voir l'erreur

## 🎯 Expected Behavior

Description de ce qui devrait se passer.

## 📸 Screenshots

Si applicable, ajouter des captures d'écran.

## 🖥️ Environment

-   **OS**: [e.g. Ubuntu 22.04]
-   **PHP**: [e.g. 8.4.5]
-   **Laravel**: [e.g. 12.36.1]
-   **Browser**: [e.g. Chrome 119]

## 📝 Additional Context

Tout autre contexte utile pour le problème.
```

### 🔍 Debugging Tips

```bash
# Logs Laravel
tail -f storage/logs/laravel.log

# Logs serveur web
sudo tail -f /var/log/nginx/error.log

# Debug avec Tinker
php artisan tinker
>>> User::find(1)

# Mode debug
php artisan serve --host=0.0.0.0 --port=8000
```

## 💡 Proposer des Fonctionnalités

### 📋 Template Feature Request

```markdown
## 🚀 Feature Description

Description claire de la fonctionnalité proposée.

## 🎯 Problem Statement

Quel problème cette fonctionnalité résout-elle ?

## 💡 Proposed Solution

Description détaillée de votre solution proposée.

## 🔄 Alternatives Considered

Autres solutions que vous avez considérées.

## 📊 Business Value

Impact business attendu de cette fonctionnalité.

## 🛠️ Technical Considerations

-   Impact sur les performances
-   Compatibilité avec l'existant
-   Complexité d'implémentation

## 📋 Acceptance Criteria

-   [ ] Critère 1
-   [ ] Critère 2
-   [ ] Critère 3
```

## 👥 Code de Conduite

### 🤝 Notre Engagement

Nous nous engageons à créer un environnement ouvert et accueillant pour tous, indépendamment de :

-   L'âge, la taille corporelle, le handicap
-   L'origine ethnique, l'identité de genre
-   Le niveau d'expérience, la nationalité
-   L'apparence personnelle, la race
-   La religion, l'identité sexuelle et l'orientation

### ✅ Comportements Encouragés

-   **Empathie** et bienveillance envers autrui
-   **Respect** des points de vue différents
-   **Feedback constructif** et acceptation des critiques
-   **Responsabilité** et excuses pour les erreurs
-   **Focus** sur l'intérêt de la communauté

### ❌ Comportements Inacceptables

-   Langage ou images sexualisés
-   Commentaires insultants ou dérogatoires
-   Harcèlement public ou privé
-   Publication d'informations privées sans permission
-   Conduite inappropriée en contexte professionnel

### 🚨 Signalement

Pour signaler un comportement inacceptable :

-   **Email** : conduct@mediplus.com
-   **Discord** : Contacter un modérateur
-   **GitHub** : Utiliser le système de signalement

## 🏆 Reconnaissance

### 👑 Top Contributors

| Contributor                                      | Contributions     | Spécialité            |
| ------------------------------------------------ | ----------------- | --------------------- |
| [@ibamb](https://github.com/ibamb)               | 🎯 Lead Developer | Architecture, Backend |
| [@contributor2](https://github.com/contributor2) | 🧪 QA Engineer    | Tests, Quality        |
| [@contributor3](https://github.com/contributor3) | 📚 Tech Writer    | Documentation         |

### 🎖️ Types de Contributions

-   **🏅 Code Contributor** - Contributions de code significatives
-   **🧪 Test Champion** - Amélioration de la couverture de tests
-   **📚 Documentation Hero** - Amélioration de la documentation
-   **🐛 Bug Hunter** - Découverte et résolution de bugs
-   **🚀 Feature Architect** - Conception de nouvelles fonctionnalités

---

## 📞 Support & Contact

### 💬 Canaux de Communication

-   **📧 Email** : dev@mediplus.com
-   **💬 Discord** : [Mediplus Dev Community](https://discord.gg/mediplus)
-   **🐦 Twitter** : [@MediplusAPI](https://twitter.com/mediplusapi)
-   **📱 Telegram** : [Mediplus Developers](https://t.me/mediplus_dev)

### 📅 Réunions Communauté

-   **Standup Daily** : Lundi-Vendredi 9h00 UTC
-   **Review Weekly** : Vendredi 15h00 UTC
-   **Planning Monthly** : Premier mardi du mois 14h00 UTC

### 🎓 Ressources d'Apprentissage

-   **Laravel Documentation** : https://laravel.com/docs
-   **PHP Best Practices** : https://phptherightway.com
-   **API Design Guidelines** : https://github.com/microsoft/api-guidelines
-   **Clean Code Principles** : https://github.com/ryanmcdermott/clean-code-javascript

---

<p align="center">
  <strong>🤝 Merci de contribuer à Mediplus Backend API !</strong><br>
  <em>Ensemble, digitalisons la santé en Afrique</em><br><br>
  <a href="https://github.com/mediplus/backend/issues">🐛 Report Issues</a> •
  <a href="https://github.com/mediplus/backend/discussions">💬 Join Discussions</a> •
  <a href="https://discord.gg/mediplus">👥 Join Community</a>
</p>

<p align="center">
  <sub>Made with ❤️ by the Mediplus Team and Contributors</sub>
</p>
