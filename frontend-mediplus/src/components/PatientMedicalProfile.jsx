import {
  AlertTriangle,
  Calendar,
  Droplets,
  Edit,
  Heart,
  MapPin,
  Phone,
  Pill,
  Ruler,
  Save,
  User,
  Weight,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function PatientMedicalProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    date_of_birth: "",
    gender: "",
    blood_group: "",
    height: "",
    weight: "",
    allergies: "",
    chronic_diseases: "",
    medications: "",
    emergency_contact: "",
    address: "",
    city: "",
    country: "",
  });

  // API Base URL
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  // Chargement du profil
  useEffect(() => {
    if (!token) return;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/patient/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          // La vraie structure: data.patient_profile contient les données
          const profileData = data.patient_profile || data.data || data;

          setProfile(profileData);
          setFormData({
            date_of_birth: profileData?.date_of_birth || "",
            gender: profileData?.gender || "",
            blood_group: profileData?.blood_group || "",
            height: profileData?.height || "",
            weight: profileData?.weight || "",
            allergies: profileData?.allergies || "",
            chronic_diseases: profileData?.chronic_diseases || "",
            medications: profileData?.medications || "",
            emergency_contact: profileData?.emergency_contact || "",
            address: profileData?.address || "",
            city: profileData?.city || "",
            country: profileData?.country || "",
          });
        } else if (response.status === 404) {
          // Cas normal : pas de profil existant, l'utilisateur peut en créer un
          setProfile(null);
        } else {
          // Autres erreurs HTTP
          const errorData = await response.json().catch(() => ({}));
          console.error("Erreur HTTP:", response.status, errorData);
          toast.error("Erreur lors du chargement du profil");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
        toast.error("Problème de connexion. Vérifiez votre réseau.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [token, API_BASE_URL]);

  const handleSave = async () => {
    if (!token) return;

    try {
      const method = profile ? "PUT" : "POST";
      const response = await fetch(`${API_BASE_URL}/patient/profile`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.data || data);
        setIsEditing(false);
        toast.success(profile ? "Profil mis à jour !" : "Profil créé !");
      } else {
        toast.error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        date_of_birth: profile.date_of_birth || "",
        gender: profile.gender || "",
        blood_group: profile.blood_group || "",
        height: profile.height || "",
        weight: profile.weight || "",
        allergies: profile.allergies || "",
        chronic_diseases: profile.chronic_diseases || "",
        medications: profile.medications || "",
        emergency_contact: profile.emergency_contact || "",
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="card bg-white dark:bg-slate-900 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-white dark:bg-slate-900">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <Heart className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              Profil Médical
            </h3>
            <p className="text-sm text-slate-500">
              {profile
                ? "Vos informations médicales"
                : "Créer votre profil médical"}
            </p>
          </div>
        </div>

        {!isEditing && profile && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </button>
        )}

        {isEditing && (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Sauvegarder
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </button>
          </div>
        )}
      </div>

      {/* Contenu */}
      {!profile && !isEditing ? (
        <div className="text-center py-8">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Heart className="h-8 w-8 text-slate-400" />
          </div>
          <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2">
            Aucun profil médical
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            Créez votre profil médical pour une meilleure prise en charge
          </p>
          <button onClick={() => setIsEditing(true)} className="btn-primary">
            Créer mon profil médical
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-100">
              Informations personnelles
            </h4>

            <Field
              icon={<Calendar className="h-4 w-4" />}
              label="Date de naissance"
              value={formData.date_of_birth}
              isEditing={isEditing}
              type="date"
              onChange={(value) =>
                setFormData({ ...formData, date_of_birth: value })
              }
            />

            <Field
              icon={<User className="h-4 w-4" />}
              label="Sexe"
              value={formData.gender}
              isEditing={isEditing}
              type="select"
              options={["Masculin", "Féminin", "Autre"]}
              onChange={(value) => setFormData({ ...formData, gender: value })}
            />

            <Field
              icon={<Droplets className="h-4 w-4" />}
              label="Groupe sanguin"
              value={formData.blood_group}
              isEditing={isEditing}
              type="select"
              options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              onChange={(value) =>
                setFormData({ ...formData, blood_group: value })
              }
            />

            <Field
              icon={<Ruler className="h-4 w-4" />}
              label="Taille (cm)"
              value={formData.height}
              isEditing={isEditing}
              type="number"
              onChange={(value) => setFormData({ ...formData, height: value })}
            />

            <Field
              icon={<Weight className="h-4 w-4" />}
              label="Poids (kg)"
              value={formData.weight}
              isEditing={isEditing}
              type="number"
              onChange={(value) => setFormData({ ...formData, weight: value })}
            />
          </div>

          {/* Informations médicales */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-100">
              Informations médicales
            </h4>

            <Field
              icon={<AlertTriangle className="h-4 w-4" />}
              label="Allergies"
              value={formData.allergies}
              isEditing={isEditing}
              type="textarea"
              onChange={(value) =>
                setFormData({ ...formData, allergies: value })
              }
            />

            <Field
              icon={<Pill className="h-4 w-4" />}
              label="Maladies chroniques"
              value={formData.chronic_diseases}
              isEditing={isEditing}
              type="textarea"
              onChange={(value) =>
                setFormData({ ...formData, chronic_diseases: value })
              }
            />

            <Field
              icon={<Pill className="h-4 w-4" />}
              label="Médicaments actuels"
              value={formData.medications}
              isEditing={isEditing}
              type="textarea"
              onChange={(value) =>
                setFormData({ ...formData, medications: value })
              }
            />

            <Field
              icon={<Phone className="h-4 w-4" />}
              label="Contact d'urgence"
              value={formData.emergency_contact}
              isEditing={isEditing}
              onChange={(value) =>
                setFormData({ ...formData, emergency_contact: value })
              }
            />
          </div>

          {/* Adresse */}
          <div className="md:col-span-2">
            <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-4">
              Adresse
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <Field
                icon={<MapPin className="h-4 w-4" />}
                label="Adresse"
                value={formData.address}
                isEditing={isEditing}
                onChange={(value) =>
                  setFormData({ ...formData, address: value })
                }
              />
              <Field
                icon={<MapPin className="h-4 w-4" />}
                label="Ville"
                value={formData.city}
                isEditing={isEditing}
                onChange={(value) => setFormData({ ...formData, city: value })}
              />
              <Field
                icon={<MapPin className="h-4 w-4" />}
                label="Pays"
                value={formData.country}
                isEditing={isEditing}
                onChange={(value) =>
                  setFormData({ ...formData, country: value })
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant Field simple
function Field({
  icon,
  label,
  value,
  isEditing,
  type = "text",
  options = [],
  onChange,
}) {
  if (!isEditing) {
    return (
      <div className="flex items-start gap-3">
        <div className="p-1 text-slate-400">{icon}</div>
        <div className="flex-1">
          <div className="text-sm text-slate-500">{label}</div>
          <div className="text-slate-800 dark:text-slate-100">
            {value || (
              <span className="text-slate-400 italic">Non renseigné</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="p-1 text-slate-400">{icon}</div>
      <div className="flex-1">
        <label className="block text-sm text-slate-500 mb-1">{label}</label>
        {type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionner...</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
      </div>
    </div>
  );
}
