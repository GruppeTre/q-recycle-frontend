import {createContext, useEffect, useState} from "react";
import {supabaseClient} from "../lib/supabaseClient.js";
import {profiles} from "../lib/profiles.js";

const AuthContext = createContext(null);

const AuthProvider = ({children}) => {

    const [ session, setSession ] = useState(undefined);
    const [ role, setRole ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, fetchedSession) => {
            if (isMounted) {
                setSession(fetchedSession);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        if (session === undefined) return;

        if (session === null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRole(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        profiles.getRole(session.user.id)
            .then(fetchedRole => {
                if (isMounted) {
                    setRole(fetchedRole);
                }
            })
            .catch(e => console.error(e))
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [session]);

    return <AuthContext.Provider value={{session: session ?? null, role, isLoading}}>{children}</AuthContext.Provider>
}

export { AuthProvider, AuthContext };