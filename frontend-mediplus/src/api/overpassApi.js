// Service pour interroger l'API Overpass d'OpenStreetMap
// Récupère les établissements de santé en temps réel autour d'une position

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

// Configuration des types d'établissements de santé à rechercher
const HEALTHCARE_TAGS = {
  hospital: { emoji: "🏥", color: "#EF4444", name: "Hôpital" },
  clinic: { emoji: "🏥", color: "#EF4444", name: "Clinique" },
  pharmacy: { emoji: "💊", color: "#8B5CF6", name: "Pharmacie" },
  laboratory: { emoji: "🔬", color: "#F59E0B", name: "Laboratoire" },
  dentist: { emoji: "🦷", color: "#06B6D4", name: "Dentiste" },
  doctor: { emoji: "👨‍⚕️", color: "#10B981", name: "Médecin" },
  physiotherapist: { emoji: "🏋️", color: "#EC4899", name: "Kinésithérapeute" },
};

// Construction de la requête Overpass pour récupérer les établissements de santé
const buildOverpassQuery = (lat, lon, radius = 5000) => {
  return `
    [out:json][timeout:30];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lon});
      node["amenity"="clinic"](around:${radius},${lat},${lon});
      node["amenity"="pharmacy"](around:${radius},${lat},${lon});
      node["amenity"="dentist"](around:${radius},${lat},${lon});
      node["amenity"="doctors"](around:${radius},${lat},${lon});
      node["healthcare"="hospital"](around:${radius},${lat},${lon});
      node["healthcare"="clinic"](around:${radius},${lat},${lon});
      node["healthcare"="pharmacy"](around:${radius},${lat},${lon});
      node["healthcare"="dentist"](around:${radius},${lat},${lon});
      node["healthcare"="laboratory"](around:${radius},${lat},${lon});
      node["healthcare"="physiotherapist"](around:${radius},${lat},${lon});
      node["healthcare"="doctor"](around:${radius},${lat},${lon});
      way["amenity"="hospital"](around:${radius},${lat},${lon});
      way["amenity"="clinic"](around:${radius},${lat},${lon});
      way["amenity"="pharmacy"](around:${radius},${lat},${lon});
      way["healthcare"](around:${radius},${lat},${lon});
    );
    out center body;
  `;
};

// Fonction pour déterminer le type d'établissement
const determineEstablishmentType = (tags) => {
  // Priorité: amenity d'abord, puis healthcare
  if (tags.amenity) {
    switch (tags.amenity) {
      case "hospital":
        return "hospital";
      case "clinic":
        return "clinic";
      case "pharmacy":
        return "pharmacy";
      case "dentist":
        return "dentist";
      case "doctors":
        return "doctor";
      default:
        break;
    }
  }

  if (tags.healthcare) {
    switch (tags.healthcare) {
      case "hospital":
        return "hospital";
      case "clinic":
        return "clinic";
      case "pharmacy":
        return "pharmacy";
      case "dentist":
        return "dentist";
      case "laboratory":
        return "laboratory";
      case "physiotherapist":
        return "physiotherapist";
      case "doctor":
        return "doctor";
      default:
        break;
    }
  }

  // Fallback pour les types non reconnus
  return "doctor";
};

// Fonction pour calculer la distance entre deux points (Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Fonction principale pour rechercher les établissements de santé
export const searchHealthcareEstablishments = async (
  userPosition,
  radius = 5000,
  searchQuery = ""
) => {
  if (!userPosition || !userPosition.lat || !userPosition.lng) {
    return [];
  }

  const { lat, lng } = userPosition;

  try {
    // Construction de la requête Overpass
    const query = buildOverpassQuery(lat, lng, radius);
    const url = `${OVERPASS_API_URL}?data=${encodeURIComponent(query)}`;

    // Appel à l'API Overpass
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (!data.elements || data.elements.length === 0) {
      return [];
    }

    // Traitement des résultats
    const establishments = data.elements
      .map((element) => {
        // Gestion des coordonnées (nodes vs ways)
        const elementLat = element.lat || element.center?.lat;
        const elementLon = element.lon || element.center?.lon;

        if (!elementLat || !elementLon) {
          return null; // Ignorer les éléments sans coordonnées
        }

        // Extraction des informations
        const tags = element.tags || {};
        const type = determineEstablishmentType(tags);
        const typeInfo = HEALTHCARE_TAGS[type] || HEALTHCARE_TAGS.doctor;

        // Calcul de la distance
        const distance = calculateDistance(lat, lng, elementLat, elementLon);

        return {
          id: `osm_${element.type}_${element.id}`,
          name: tags.name || tags["name:fr"] || `${typeInfo.name} sans nom`,
          type: type,
          emoji: typeInfo.emoji,
          color: typeInfo.color,
          latitude: elementLat,
          longitude: elementLon,
          address: tags.addr
            ? `${tags["addr:housenumber"] || ""} ${
                tags["addr:street"] || ""
              }, ${tags["addr:city"] || ""}`.trim()
            : tags.address || "Adresse non disponible",
          phone: tags.phone || tags["contact:phone"] || null,
          website: tags.website || tags["contact:website"] || null,
          opening_hours: tags.opening_hours || null,
          wheelchair: tags.wheelchair === "yes",
          distance_km: Math.round(distance * 100) / 100,
          specialty: tags.healthcare || tags.amenity || typeInfo.name,
          operator: tags.operator || null,
          // Données brutes pour debug
          osmData: {
            elementType: element.type,
            osmId: element.id,
            tags: tags,
          },
        };
      })
      .filter(Boolean) // Supprimer les éléments null
      .sort((a, b) => a.distance_km - b.distance_km); // Trier par distance

    // Filtrage par recherche textuelle si fournie
    if (searchQuery && searchQuery.trim()) {
      return establishments.filter(
        (est) =>
          est.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          est.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          est.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return establishments;
  } catch {
    return [];
  }
};

// Fonction pour rechercher des établissements par nom dans une zone élargie
export const searchByName = async (
  searchQuery,
  userPosition,
  radius = 10000
) => {
  if (!searchQuery || !searchQuery.trim()) {
    return [];
  }

  // Utiliser la fonction principale avec un rayon élargi
  return await searchHealthcareEstablishments(
    userPosition,
    radius,
    searchQuery
  );
};

// Fonction pour obtenir les détails d'un établissement spécifique
export const getEstablishmentDetails = async (osmId, elementType = "node") => {
  try {
    const query = `
      [out:json];
      ${elementType}(${osmId});
      out body;
    `;

    const url = `${OVERPASS_API_URL}?data=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.elements && data.elements.length > 0) {
      return data.elements[0];
    }

    return null;
  } catch {
    return null;
  }
};

export default {
  searchHealthcareEstablishments,
  searchByName,
  getEstablishmentDetails,
  HEALTHCARE_TAGS,
};
