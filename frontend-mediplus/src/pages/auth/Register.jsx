import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


export default function Register() {
    const { register, isLoading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" });


    const onSubmit = async (e) => {
        e.preventDefault();
        const user = await register(form);
        navigate(user.role === "patient" ? "/patient/dashboard" : "/pro/dashboard", { replace: true });
    };


    return (
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-2xl font-semibold">Créer un compte</h1>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <input className="input" placeholder="Nom complet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="input" type="password" placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Médecin / Infirmier</option>
                </select>
                <button className="btn-primary w-full" disabled={isLoading}>{isLoading ? "Création…" : "S'inscrire"}</button>
            </form>
        </div>
    );
}