import {Navigate, Outlet} from "react-router";
import {useAuth} from "../context/useAuth.js";

function ProtectedRoute({redirectPath, allowedRoles, children}) {

    if (!allowedRoles) {
        throw new Error('Protected Route must have at least one allowed role');
    }

    const { session, role, isLoading } = useAuth();

    if (isLoading) {
        return <h1>LOADING</h1>;
    }

    if (!session) {
        return <Navigate to={redirectPath} replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
}

export default ProtectedRoute;