import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { listPharmacies, createPharmacy, deletePharmacy } from "../../api/admin.js";
import PharmacyForm from "../../components/PharmacyForm.jsx";

export default function Catalog() {
    const qc = useQueryClient();
    const { data, isLoading } = useQuery({ queryKey: ["pharmacies"], queryFn: listPharmacies });

    const addMutation = useMutation({
        mutationFn: createPharmacy,
        onSuccess: () => {
            qc.invalidateQueries(["pharmacies"]);
            toast.success("Pharmacie ajoutée");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deletePharmacy,
        onSuccess: () => {
            qc.invalidateQueries(["pharmacies"]);
            toast.success("Pharmacie supprimée");
        },
    });

    return (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-xl font-semibold">Catalogue santé</h1>

            <div className="grid sm:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="font-medium mb-3">Ajouter une pharmacie</h2>
                    <PharmacyForm onSubmit={(form) => addMutation.mutate(form)} />
                </div>

                <div className="card overflow-x-auto">
                    {isLoading ? (
                        <div className="py-8 text-center">Chargement…</div>
                    ) : (
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left border-b">
                                    <th>Nom</th>
                                    <th>Adresse</th>
                                    <th>Garde</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((p) => (
                                    <tr key={p.id} className="border-b last:border-none">
                                        <td>{p.name}</td>
                                        <td>{p.address}</td>
                                        <td>{p.on_guard ? "🌙 Oui" : "—"}</td>
                                        <td>
                                            <button
                                                className="btn-ghost text-xs text-red-600"
                                                onClick={() => deleteMutation.mutate(p.id)}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </main>
    );
}
