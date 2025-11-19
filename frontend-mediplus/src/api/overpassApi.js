// Service pour interroger l'API Overpass d'OpenStreetMap
// Récupère les établissements de santé en temps réel autour d'une position

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

// Fonction pour calculer la distance entre deux points GPS (formule de Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance en kilomètres
};

// Configuration des types d'établissements de santé à rechercher
const HEALTHCARE_TAGS = {
  hospital: { emoji: "🏥", color: "#EF4444", name: "Hôpital" },
  clinic: { emoji: "🏥", color: "#EF4444", name: "Clinique" },
  pharmacy: { emoji: "💊", color: "#8B5CF6", name: "Pharmacie" },
  laboratory: { emoji: "🔬", color: "#F59E0B", name: "Laboratoire" },
  dentist: { emoji: "🦷", color: "#06B6D4", name: "Dentiste" },
  doctor: { emoji: "👨‍⚕️", color: "#10B981", name: "Médecin" },
  physiotherapist: { emoji: "🏋️", color: "#EC4899", name: "Kinésithérapeute" },
  radiology: { emoji: "📹", color: "#F97316", name: "Radiologie" },
  emergency: { emoji: "🚑", color: "#DC2626", name: "Urgences" },
};

// Mapping des spécialités médicales vers les tags OSM
const SPECIALTY_MAPPING = {
  general_practitioner: ["doctor", "doctors"],
  cardiologist: ["doctor", "doctors"],
  pediatrician: ["doctor", "doctors"],
  gynecologist: ["doctor", "doctors"],
  dermatologist: ["doctor", "doctors"],
  ophthalmologist: ["doctor", "doctors"],
  orthopedic: ["doctor", "doctors"],
  neurologist: ["doctor", "doctors"],
  psychiatrist: ["doctor", "doctors"],
  dentist: ["dentist"],
  surgeon: ["doctor", "doctors"],
  physiotherapist: ["physiotherapist"],
  pharmacy: ["pharmacy"],
  laboratory: ["laboratory"],
  hospital: ["hospital"],
  clinic: ["clinic"],
  medical_center: ["clinic", "hospital"],
  radiology: ["clinic"],
  emergency: ["hospital", "clinic"],
};

// Fonction pour déterminer le type d'établissement de santé basé sur les tags OSM
const determineEstablishmentType = (tags) => {
  // Vérifier healthcare tag en premier
  if (tags.healthcare) {
    switch (tags.healthcare) {
      case "hospital":
        return "hospital";
      case "clinic":
        return "clinic";
      case "pharmacy":
        return "pharmacy";
      case "laboratory":
        return "laboratory";
      case "dentist":
        return "dentist";
      case "doctor":
        return "doctor";
      case "physiotherapist":
        return "physiotherapist";
      case "radiology":
        return "radiology";
      default:
        // Pour les autres types de healthcare, mapper vers doctor
        return "doctor";
    }
  }

  // Vérifier amenity tag
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
        return null; // Type non reconnu
    }
  }

  // Par défaut, considérer comme médecin
  return "doctor";
};

// Construction de la requête Overpass pour récupérer les établissements de santé
const buildOverpassQuery = (lat, lon, radius = 5000, specialtyFilter = "") => {
  let queryParts = [];

  // Si un filtre de spécialité est spécifié, utiliser seulement les types correspondants
  if (specialtyFilter && SPECIALTY_MAPPING[specialtyFilter]) {
    const mappedTypes = SPECIALTY_MAPPING[specialtyFilter];
    mappedTypes.forEach((type) => {
      switch (type) {
        case "hospital":
          queryParts.push(
            `node["amenity"="hospital"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `way["amenity"="hospital"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `node["healthcare"="hospital"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `way["healthcare"="hospital"](around:${radius},${lat},${lon});`
          );
          break;
        case "clinic":
          queryParts.push(
            `node["amenity"="clinic"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `way["amenity"="clinic"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `node["healthcare"="clinic"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `way["healthcare"="clinic"](around:${radius},${lat},${lon});`
          );
          break;
        case "pharmacy":
          queryParts.push(
            `node["amenity"="pharmacy"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `way["amenity"="pharmacy"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `node["healthcare"="pharmacy"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `way["healthcare"="pharmacy"](around:${radius},${lat},${lon});`
          );
          break;
        case "dentist":
          queryParts.push(
            `node["amenity"="dentist"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `way["amenity"="dentist"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `node["healthcare"="dentist"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `way["healthcare"="dentist"](around:${radius},${lat},${lon});`
          );
          break;
        case "laboratory":
          queryParts.push(
            `node["healthcare"="laboratory"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `way["healthcare"="laboratory"](around:${radius},${lat},${lon});`
          );
          break;
        case "physiotherapist":
          queryParts.push(
            `node["healthcare"="physiotherapist"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `way["healthcare"="physiotherapist"](around:${radius},${lat},${lon});`
          );
          break;
        case "doctor":
        case "doctors":
          queryParts.push(
            `node["amenity"="doctors"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `way["amenity"="doctors"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `node["healthcare"="doctor"](around:${radius},${lat},${lon});`
          );
          queryParts.push(
            `way["healthcare"="doctor"](around:${radius},${lat},${lon});`
          );
          break;
      }
    });
  } else {
    // Requête par défaut pour tous les types
    queryParts = [
      `node["amenity"="hospital"](around:${radius},${lat},${lon});`,
      `node["amenity"="clinic"](around:${radius},${lat},${lon});`,
      `node["amenity"="pharmacy"](around:${radius},${lat},${lon});`,
      `node["amenity"="dentist"](around:${radius},${lat},${lon});`,
      `node["amenity"="doctors"](around:${radius},${lat},${lon});`,
      `node["healthcare"="hospital"](around:${radius},${lat},${lon});`,
      `node["healthcare"="clinic"](around:${radius},${lat},${lon});`,
      `node["healthcare"="pharmacy"](around:${radius},${lat},${lon});`,
      `node["healthcare"="dentist"](around:${radius},${lat},${lon});`,
      `node["healthcare"="laboratory"](around:${radius},${lat},${lon});`,
      `node["healthcare"="physiotherapist"](around:${radius},${lat},${lon});`,
      `node["healthcare"="doctor"](around:${radius},${lat},${lon});`,
      `way["amenity"="hospital"](around:${radius},${lat},${lon});`,
      `way["amenity"="clinic"](around:${radius},${lat},${lon});`,
      `way["amenity"="pharmacy"](around:${radius},${lat},${lon});`,
      `way["healthcare"](around:${radius},${lat},${lon});`,
    ];
  }

  return `
    [out:json][timeout:10];
    (
      ${queryParts.join("\n      ")}
    );
    out center body;
  `;
};

// Fonction pour déterminer la spécialité médicale basée sur les tags OSM
const determineSpecialty = (tags, type) => {
  // Essayer d'extraire la spécialité des tags OSM
  if (tags.healthcare && tags.healthcare !== type) {
    return tags.healthcare;
  }

  if (tags.amenity && tags.amenity !== type) {
    return tags.amenity;
  }

  // Mapping basé sur le type déterminé
  const specialtyMap = {
    hospital: "Hôpital",
    clinic: "Clinique",
    pharmacy: "Pharmacie",
    laboratory: "Laboratoire d'analyses",
    dentist: "Dentiste",
    doctor: "Médecine générale",
    physiotherapist: "Kinésithérapie",
    radiology: "Radiologie",
    emergency: "Urgences",
  };

  return specialtyMap[type] || "Établissement médical";
};

// Fonction pour vérifier si un établissement est ouvert maintenant
const isOpenNow = (openingHours) => {
  if (!openingHours) return false;

  try {
    // Analyse basique des horaires d'ouverture
    // Cette fonction peut être étendue pour un parsing plus complexe
    const now = new Date();
    const currentDay = now.toLocaleLowerCase("en", { weekday: "long" });
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    // Recherche du jour actuel dans les horaires
    const dayPattern = new RegExp(`${currentDay.slice(0, 2)}[^;]*`, "i");
    const dayMatch = openingHours.match(dayPattern);

    if (!dayMatch) return false;

    // Analyse des heures pour ce jour
    const hoursMatch = dayMatch[0].match(
      /(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/g
    );

    if (!hoursMatch) return false;

    // Vérifier si l'heure actuelle est dans une plage horaire
    for (const timeRange of hoursMatch) {
      const [, startHour, startMin, endHour, endMin] = timeRange.match(
        /(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/
      );
      const startTime = parseInt(startHour) * 60 + parseInt(startMin);
      const endTime = parseInt(endHour) * 60 + parseInt(endMin);

      if (currentTime >= startTime && currentTime <= endTime) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
};

// Fonction principale pour rechercher les établissements de santé
export const searchHealthcareEstablishments = async (
  userPosition,
  radius = 5000,
  searchQuery = "",
  specialtyFilter = ""
) => {
  // Utiliser une position par défaut si aucune n'est fournie
  const position = userPosition || { lat: 5.36, lng: -4.008 };

  if (!position || !position.lat || !position.lng) {
    return [];
  }

  const { lat, lng } = position;

  try {
    // Construction de la requête Overpass
    const query = buildOverpassQuery(lat, lng, radius, specialtyFilter);
    const url = `${OVERPASS_API_URL}?data=${encodeURIComponent(query)}`;

    console.log("🔍 Requête Overpass:", {
      position: { lat, lng },
      radius,
      searchQuery,
      specialtyFilter,
      url: url.substring(0, 200) + "...",
    });

    // Appel à l'API Overpass
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    let data = await response.json();

    console.log("📊 Réponse Overpass:", {
      elementsCount: data.elements?.length || 0,
      elements:
        data.elements?.slice(0, 3).map((el) => ({
          id: el.id,
          type: el.type,
          tags: el.tags,
          hasCoords: !!(el.lat || el.lon || el.center),
        })) || [],
      fullResponse: data,
    });

    // Appliquer le filtrage par searchQuery si fourni
    console.log(
      `🔍 Debug: searchQuery="${searchQuery}", elements=${
        data.elements?.length || 0
      }`
    );
    if (
      searchQuery &&
      searchQuery.trim() &&
      data.elements &&
      data.elements.length > 0
    ) {
      console.log(
        `🔍 Filtrage par recherche: "${searchQuery}" (${data.elements.length} éléments)`
      );
      const filteredResults = data.elements.filter((element) => {
        const tags = element.tags || {};
        const name = (tags.name || tags["name:fr"] || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        return (
          name.includes(query) ||
          (tags.amenity && tags.amenity.toLowerCase().includes(query)) ||
          (tags.healthcare && tags.healthcare.toLowerCase().includes(query))
        );
      });

      console.log(
        `🎯 ${filteredResults.length} résultats filtrés sur ${data.elements.length} pour "${searchQuery}"`
      );
      data = { elements: filteredResults };
    }

    if (!data.elements || data.elements.length === 0) {
      // Si aucune résultat avec la requête spécifique, essayer une recherche générale
      if (searchQuery && searchQuery.trim()) {
        console.log(
          "🔄 Aucun résultat trouvé, tentative avec recherche générale..."
        );
        const generalQuery = buildOverpassQuery(lat, lng, radius, "");
        const generalUrl = `${OVERPASS_API_URL}?data=${encodeURIComponent(
          generalQuery
        )}`;
        const generalResponse = await fetch(generalUrl);

        if (generalResponse.ok) {
          const generalData = await generalResponse.json();
          console.log("📊 Réponse Overpass générale:", {
            elementsCount: generalData.elements?.length || 0,
          });

          if (generalData.elements && generalData.elements.length > 0) {
            // Filtrer les résultats pour ne garder que ceux qui correspondent à la recherche
            const filteredResults = generalData.elements.filter((element) => {
              const tags = element.tags || {};
              const name = (tags.name || tags["name:fr"] || "").toLowerCase();
              const query = searchQuery.toLowerCase();
              return (
                name.includes(query) ||
                (tags.amenity && tags.amenity.toLowerCase().includes(query)) ||
                (tags.healthcare &&
                  tags.healthcare.toLowerCase().includes(query))
              );
            });

            console.log(
              `🎯 ${filteredResults.length} résultats filtrés sur ${generalData.elements.length}`
            );
            data = { elements: filteredResults };
          }
        }
      }

      if (!data.elements || data.elements.length === 0) {
        return [];
      }
    }

    // Traitement des résultats
    let establishments;
    try {
      establishments = data.elements
        .map((element) => {
          // Gestion des coordonnées (nodes vs ways)
          const elementLat = element.lat || element.center?.lat;
          const elementLon = element.lon || element.center?.lon;

          if (!elementLat || !elementLon) {
            console.log("⚠️ Élément sans coordonnées:", {
              id: element.id,
              type: element.type,
              hasLat: !!element.lat,
              hasLon: !!element.lon,
              hasCenter: !!element.center,
            });
            return null; // Ignorer les éléments sans coordonnées
          }

          // Extraction des informations
          const tags = element.tags || {};
          const type = determineEstablishmentType(tags);

          console.log(`🔍 Élément ${element.id} (${element.type}):`, {
            tags: tags,
            determinedType: type,
            hasCoords: !!(elementLat && elementLon),
          });

          if (!type) {
            console.log("⚠️ Type non reconnu pour élément:", {
              id: element.id,
              tags: tags,
            });
            return null; // Ignorer les éléments avec type non reconnu
          }

          const typeInfo = HEALTHCARE_TAGS[type] || HEALTHCARE_TAGS.doctor;

          // Calcul de la distance
          const distance = calculateDistance(lat, lng, elementLat, elementLon);

          return {
            id: `osm_${element.type}_${element.id}`,
            name: tags.name || tags["name:fr"] || `${typeInfo.name} sans nom`,
            type: type,
            emoji: typeInfo.emoji,
            color: typeInfo.color,
            lat: elementLat,
            lng: elementLon,
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
            specialty: determineSpecialty(tags, type),
            operator: tags.operator || null,
            // Données brutes pour debug
            osmData: {
              elementType: element.type,
              osmId: element.id,
              tags: tags,
            },
          };
        })
        .filter(Boolean); // Supprimer les éléments null

      console.log(
        `📊 Après traitement: ${establishments.length} établissements valides sur ${data.elements.length} éléments filtrés`
      );
    } catch (error) {
      console.error("❌ Erreur lors du traitement des éléments:", error);
      return [];
    }

    console.log(
      `📍 Après filtrage coordonnées: ${establishments.length} établissements (sur ${data.elements.length} bruts)`
    );

    establishments = establishments.sort(
      (a, b) => a.distance_km - b.distance_km
    ); // Trier par distance

    // Filtrage par spécialité si spécifiée
    if (specialtyFilter && specialtyFilter !== "") {
      const beforeSpecialty = establishments.length;
      establishments = establishments.filter((est) => {
        const mappedTypes = SPECIALTY_MAPPING[specialtyFilter] || [];
        return (
          mappedTypes.includes(est.type) ||
          est.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())
        );
      });
      console.log(
        `🏥 Filtrage spécialité "${specialtyFilter}": ${beforeSpecialty} → ${establishments.length} établissements`
      );
    }

    // Filtrage par recherche textuelle si fournie
    if (searchQuery && searchQuery.trim()) {
      const beforeFilter = establishments.length;
      establishments = establishments.filter(
        (est) =>
          est.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          est.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          est.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log(
        `🔍 Filtrage textuel "${searchQuery}": ${beforeFilter} → ${establishments.length} établissements`
      );

      // Log des établissements rejetés pour debug
      if (beforeFilter > establishments.length) {
        const rejected = data.elements
          .map((element) => {
            const elementLat = element.lat || element.center?.lat;
            const elementLon = element.lon || element.center?.lon;
            if (!elementLat || !elementLon) return null;

            const tags = element.tags || {};
            const type = determineEstablishmentType(tags);
            if (!type) return null;

            const typeInfo = HEALTHCARE_TAGS[type] || HEALTHCARE_TAGS.doctor;
            const name =
              tags.name || tags["name:fr"] || `${typeInfo.name} sans nom`;

            return {
              name,
              type,
              matches:
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                type.toLowerCase().includes(searchQuery.toLowerCase()),
            };
          })
          .filter(Boolean)
          .filter((item) => !item.matches)
          .slice(0, 5); // Montrer seulement 5 exemples

        console.log("❌ Établissements rejetés (exemples):", rejected);
      }

      // Si aucun résultat après filtrage textuel, revenir aux résultats avant filtrage
      if (establishments.length === 0) {
        console.log(
          "⚠️ Aucun résultat pour la recherche textuelle, utilisation des résultats généraux"
        );
        establishments = data.elements
          .map((element) => {
            const elementLat = element.lat || element.center?.lat;
            const elementLon = element.lon || element.center?.lon;
            if (!elementLat || !elementLon) return null;

            const tags = element.tags || {};
            const type = determineEstablishmentType(tags);
            if (!type) return null;

            const typeInfo = HEALTHCARE_TAGS[type] || HEALTHCARE_TAGS.doctor;
            const distance = calculateDistance(
              lat,
              lng,
              elementLat,
              elementLon
            );

            return {
              id: `osm_${element.type}_${element.id}`,
              name: tags.name || tags["name:fr"] || `${typeInfo.name} sans nom`,
              type: type,
              emoji: typeInfo.emoji,
              color: typeInfo.color,
              lat: elementLat, // Correction: utiliser 'lat' au lieu de 'latitude'
              lng: elementLon, // Correction: utiliser 'lng' au lieu de 'longitude'
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
              specialty: determineSpecialty(tags, type),
              operator: tags.operator || null,
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.distance_km - b.distance_km);

        console.log(
          `🔄 Retour aux ${establishments.length} résultats généraux`
        );
      }
    }

    console.log(
      `✅ ${establishments.length} établissements trouvés après filtrage:`,
      establishments.slice(0, 3).map((est) => ({
        name: est.name,
        type: est.type,
        specialty: est.specialty,
        distance: est.distance_km?.toFixed(1) + "km",
      }))
    );

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
  isOpenNow,
};
