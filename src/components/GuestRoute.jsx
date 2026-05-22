import {useAuth} from "../context/useAuth.js";
import {Navigate, Outlet} from "react-router";
import {DASHBOARD_BY_ROLE} from "../config/constants.js";

function GuestRoute({children, allowedRoles = []}) {

    const { session, role, isLoading } = useAuth();

    if (isLoading) {
        return
    }

    if (session && !allowedRoles.includes(role)) {
        return <Navigate to={DASHBOARD_BY_ROLE[role]} replace />;
    }

    return children ? children : <Outlet />;
}

export default GuestRoute;