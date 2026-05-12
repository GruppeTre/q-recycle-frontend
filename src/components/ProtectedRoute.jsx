import {useEffect, useState} from "react";
import {Navigate, Outlet} from "react-router";
import {supabaseClient} from "../lib/supabaseClient.js";
import {getRole} from "../lib/supabaseUtils.js";

function ProtectedRoute({redirectPath, allowedRoles = [], children}) {

    const [session, setSession] = useState(undefined); // undefined = still loading
    const [userRole, setUserRole] = useState(undefined);

    useEffect(() => {
        supabaseClient.auth.getSession().then(async ({ data }) => {
            const s = data.session;
            setSession(s);
            if (s) {
                const role = await getRole(s.user.id);
                setUserRole(role);
            }
        });
    }, []);

    if (session === undefined || (session && userRole === undefined)) return <h1>LOADING</h1>;

    if (session === null) {
        return <Navigate to={redirectPath} replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
}

export default ProtectedRoute;