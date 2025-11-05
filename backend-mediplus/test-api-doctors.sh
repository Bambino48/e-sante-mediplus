#!/bin/bash

# Test script pour la nouvelle route /api/doctors
echo "=================================="
echo "   TEST API DOCTORS ROUTE"
echo "=================================="

echo "1. Vérification de la route..."
php artisan route:list --path=api/doctors

echo ""
echo "2. Vérification du contrôleur..."
if php -l app/Http/Controllers/Api/DoctorController.php > /dev/null 2>&1; then
    echo "✓ Syntaxe PHP correcte"
else
    echo "✗ Erreur de syntaxe PHP"
fi

echo ""
echo "3. Vérification des méthodes..."
grep -n "public function index" app/Http/Controllers/Api/DoctorController.php
if [ $? -eq 0 ]; then
    echo "✓ Méthode index() trouvée"
else
    echo "✗ Méthode index() manquante"
fi

echo ""
echo "4. Structure de la réponse attendue:"
echo "   - success: boolean"
echo "   - data.doctors: array"
echo "   - data.pagination: object"
echo "   - data.filters: object"
echo "   - data.sorting: object"
echo "   - message: string"

echo ""
echo "5. Paramètres supportés:"
echo "   - per_page: Pagination (défaut: 20)"
echo "   - sort_by: Tri (name, created_at, rating, fees)"
echo "   - sort_order: Ordre (asc, desc)"
echo "   - city: Filtrage par ville"
echo "   - specialty: Filtrage par spécialité"
echo "   - has_profile: Profil complet (défaut: true)"

echo ""
echo "6. Exemples d'utilisation:"
echo "   GET /api/doctors"
echo "   GET /api/doctors?per_page=10&sort_by=rating&sort_order=desc"
echo "   GET /api/doctors?city=Dakar&specialty=Cardiologie"

echo ""
echo "=================================="
echo "   TESTS COMPLÉTÉS"
echo "=================================="
