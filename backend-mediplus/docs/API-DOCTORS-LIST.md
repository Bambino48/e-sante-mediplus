# Documentation API - Liste des Docteurs

## Route Publique : Liste des Docteurs

### Endpoint

```
GET /api/doctors
```

### Description

Route publique permettant de récupérer la liste complète des docteurs avec leurs profils détaillés. Cette route est spécialement conçue pour l'affichage frontend sans nécessiter d'authentification.

### Paramètres de Requête (Optionnels)

| Paramètre     | Type    | Défaut | Description                                           |
| ------------- | ------- | ------ | ----------------------------------------------------- |
| `per_page`    | integer | 20     | Nombre de docteurs par page (1-100)                   |
| `sort_by`     | string  | name   | Champ de tri : `name`, `created_at`, `rating`, `fees` |
| `sort_order`  | string  | asc    | Ordre : `asc` ou `desc`                               |
| `city`        | string  | null   | Filtrer par ville                                     |
| `specialty`   | string  | null   | Filtrer par spécialité                                |
| `has_profile` | boolean | true   | Inclure uniquement les docteurs avec profil complet   |

### Exemples d'Utilisation

#### Récupérer tous les docteurs (page 1, 20 résultats)

```bash
GET /api/doctors
```

#### Filtrer par ville et spécialité

```bash
GET /api/doctors?city=Dakar&specialty=Cardiologie&per_page=10
```

#### Trier par note (meilleurs en premier)

```bash
GET /api/doctors?sort_by=rating&sort_order=desc
```

#### Récupérer tous les docteurs (même sans profil complet)

```bash
GET /api/doctors?has_profile=false
```

### Structure de Réponse

```json
{
    "success": true,
    "data": {
        "doctors": [
            {
                "id": 1,
                "name": "Dr. John Doe",
                "email": "john.doe@mediplus.com",
                "phone": "+221 77 123 45 67",
                "photo": "https://example.com/photos/doctor1.jpg",
                "location": {
                    "latitude": 14.6928,
                    "longitude": -17.4467,
                    "city": "Dakar",
                    "address": "Avenue Bourguiba, Plateau"
                },
                "profile": {
                    "bio": "Cardiologue spécialisé en cardiologie interventionnelle avec 15 ans d'expérience.",
                    "fees": 25000,
                    "rating": 4.8,
                    "primary_specialty": "Cardiologie",
                    "phone": "+221 33 123 45 67",
                    "availability": [
                        "Lundi 08:00-12:00",
                        "Mardi 14:00-18:00",
                        "Mercredi 08:00-12:00"
                    ]
                },
                "specialties": ["Cardiologie", "Médecine Interne"],
                "member_since": "2023-01-15",
                "has_complete_profile": true
            }
        ],
        "pagination": {
            "total": 45,
            "per_page": 20,
            "current_page": 1,
            "last_page": 3,
            "from": 1,
            "to": 20
        },
        "filters": {
            "city": null,
            "specialty": null,
            "has_profile": true
        },
        "sorting": {
            "sort_by": "name",
            "sort_order": "asc"
        }
    },
    "message": "Liste des médecins récupérée avec succès"
}
```

### Codes de Statut

| Code | Description                         |
| ---- | ----------------------------------- |
| 200  | Succès - Liste récupérée            |
| 422  | Erreur de validation des paramètres |
| 500  | Erreur serveur                      |

### Optimisations Implémentées

1. **Eager Loading** : Relations `doctorProfile` et `specialties` chargées efficacement
2. **Pagination** : Système de pagination Laravel pour de meilleures performances
3. **Sélection de colonnes** : Seules les colonnes nécessaires sont récupérées
4. **Filtrage optimisé** : Requêtes conditionnelles pour éviter les jointures inutiles
5. **Formatage des données** : Structure de réponse optimisée pour le frontend

### Intégration Frontend

#### JavaScript/Axios

```javascript
// Récupérer la liste des docteurs
const getDoctors = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters);
        const response = await axios.get(`/api/doctors?${params}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des docteurs:", error);
        throw error;
    }
};

// Exemple d'utilisation
const doctors = await getDoctors({
    city: "Dakar",
    specialty: "Cardiologie",
    per_page: 10,
    sort_by: "rating",
    sort_order: "desc",
});
```

#### React Hook

```jsx
import { useState, useEffect } from "react";

const useDoctors = (filters = {}) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await getDoctors(filters);
                setDoctors(response.data.doctors);
                setPagination(response.data.pagination);
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [JSON.stringify(filters)]);

    return { doctors, loading, pagination };
};
```

### Notes de Sécurité

-   Route publique sans authentification requise
-   Données sensibles (mots de passe, tokens) automatiquement filtrées
-   Limitation du nombre de résultats par page pour éviter la surcharge
-   Validation des paramètres d'entrée

### Performance

-   Requête optimisée avec `select()` pour limiter les colonnes
-   Eager loading pour éviter le problème N+1
-   Index recommandés sur les colonnes de tri fréquentes
-   Pagination pour limiter la charge mémoire

### Évolutions Futures

1. **Cache Redis** : Mise en cache des résultats fréquents
2. **Recherche géographique** : Filtrage par distance/rayon
3. **Filtres avancés** : Prix, disponibilité, langues parlées
4. **Search API** : Intégration Elasticsearch pour recherche avancée
