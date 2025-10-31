import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";


export default function ProtectedRoute({ roles = [], children }) {
    const { user, isLoading } = useAuth();
    const location = useLocation();


    if (isLoading) {
        return (
            <div className="grid place-items-center py-24">
                <div className="animate-pulse text-sm text-slate-500">Chargement…</div>
            </div>
        );
    }


    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }


    if (roles.length && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }


    return children;
}