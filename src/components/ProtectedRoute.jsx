import {useEffect, useState} from "react";
import {Navigate, Outlet} from "react-router";
import {supabaseClient} from "../lib/supabaseClient.js";

function ProtectedRoute({redirectPath, allowedRoles = [], children}) {

    const [session, setSession] = useState(undefined); // undefined = still loading

    useEffect(() => {
        supabaseClient.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });
    }, []);

    //placeholder loading indicator
    if (session === undefined) return <h1>LOADING</h1>;

    //if user is not logged in / does not have the correct role
    if (session === null || !allowedRoles.includes(session.user.role)) {
        return <Navigate to={redirectPath} replace />;
    }

    //if user does not have the correct role
    console.log(session.user.role);

    return children ? children : <Outlet />;
}

export default ProtectedRoute;