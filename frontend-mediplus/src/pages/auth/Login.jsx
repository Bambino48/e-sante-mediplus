import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


export default function Login() {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ email: "", password: "" });


    const onSubmit = async (e) => {
        e.preventDefault();
        const user = await login(form);
        const redirect =
            user.role === "admin" ? "/admin/dashboard" : user.role === "patient" ? "/patient/dashboard" : "/pro/dashboard";
        navigate(location.state?.from?.pathname || redirect, { replace: true });
    };


    return (
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-2xl font-semibold">Connexion</h1>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <input
                    className="input"
                    type="password"
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                <button className="btn-primary w-full" disabled={isLoading}>
                    {isLoading ? "Connexion…" : "Se connecter"}
                </button>
            </form>
            <p className="mt-3 text-sm text-slate-500">
                Pas de compte ? <Link to="/register" className="text-cyan-600">Inscription</Link>
            </p>
        </div>
    );
}