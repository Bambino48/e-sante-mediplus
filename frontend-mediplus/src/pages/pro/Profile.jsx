/* eslint-disable no-unused-vars */
import { Camera, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ProLayout from "../../layouts/ProLayout.jsx";

export default function Profile() {
  const [form, setForm] = useState({
    name: "Dr. Marie Kouassi",
    specialty: "Cardiologie",
    experience: 10,
    fees: 15000,
    bio: "Cardiologue expérimentée spécialisée en prévention cardiovasculaire.",
    phone: "+225 07 01 02 03 04",
    email: "marie.kouassi@medipluci.com",
    address: "Cocody Angré, Abidjan",
    languages: "Français, Anglais, Baoulé",
  });

  const [isLoading, setIsLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profil mis à jour avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProLayout title="Profil professionnel">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium mb-4">Photo de profil</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="Photo de profil"
                className="h-20 w-20 rounded-full object-cover border-4 border-cyan-500"
              />
              <button className="absolute bottom-0 right-0 bg-cyan-500 text-white p-1 rounded-full hover:bg-cyan-600">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Formats acceptés : JPG, PNG (max 2MB)
              </p>
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-medium">Informations personnelles</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nom complet
              </label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Dr. Nom Prénom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Spécialité
              </label>
              <input
                className="input"
                value={form.specialty}
                onChange={(e) => update("specialty", e.target.value)}
                placeholder="ex: Cardiologie"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Téléphone
              </label>
              <input
                className="input"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+225 XX XX XX XX XX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-medium">Informations professionnelles</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Années d'expérience
              </label>
              <input
                className="input"
                type="number"
                value={form.experience}
                onChange={(e) => update("experience", parseInt(e.target.value))}
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tarif consultation (FCFA)
              </label>
              <input
                className="input"
                type="number"
                value={form.fees}
                onChange={(e) => update("fees", parseInt(e.target.value))}
                placeholder="15000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Langues parlées
              </label>
              <input
                className="input"
                value={form.languages}
                onChange={(e) => update("languages", e.target.value)}
                placeholder="Français, Anglais, ..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Adresse du cabinet
              </label>
              <input
                className="input"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Adresse complète du cabinet"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Biographie professionnelle
            </label>
            <textarea
              className="input min-h-24"
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Décrivez votre parcours et vos domaines d'expertise..."
              rows={4}
            />
          </div>
        </div>
      </div>
    </ProLayout>
  );
}
