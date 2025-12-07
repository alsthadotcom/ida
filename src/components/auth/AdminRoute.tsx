import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!user || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
