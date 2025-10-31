import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listUsers, toggleUserVerification } from "../../api/admin.js";
import toast from "react-hot-toast";

export default function Users() {
    const qc = useQueryClient();
    const { data, isLoading } = useQuery({ queryKey: ["users"], queryFn: listUsers });
    const mutation = useMutation({
        mutationFn: toggleUserVerification,
        onSuccess: () => {
            qc.invalidateQueries(["users"]);
            toast.success("État vérification mis à jour");
        },
    });

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-xl font-semibold mb-4">Gestion des utilisateurs</h1>
            {isLoading ? (
                <div className="card grid place-items-center py-16">Chargement…</div>
            ) : (
                <div className="card overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th>Nom</th>
                                <th>Rôle</th>
                                <th>Vérifié</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((u) => (
                                <tr key={u.id} className="border-b last:border-none">
                                    <td className="py-2">{u.name}</td>
                                    <td>{u.role}</td>
                                    <td>{u.verified ? "✅" : "❌"}</td>
                                    <td>
                                        <button
                                            className="btn-ghost text-xs"
                                            onClick={() => mutation.mutate(u.id)}
                                        >
                                            {u.verified ? "Révoquer" : "Valider"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
