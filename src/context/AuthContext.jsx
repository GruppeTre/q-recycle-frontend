import {createContext, useEffect, useState} from "react";
import {supabaseClient} from "../lib/supabaseClient.js";
import {getRole} from "../lib/supabaseUtils.js";

const AuthContext = createContext(null);

const AuthProvider = ({children}) => {

    const [ session, setSession ] = useState(null);
    const [ role, setRole ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {

        //keep track of whether the component is mounted or not, if it isn't, we don't want to update state
        let isMounted = true;

        const { data: { subscription} } = supabaseClient.auth.onAuthStateChange( async (event, fetchedSession) => {

            console.log(`Handling Auth state change: ${event}`);

            if (event === 'TOKEN_REFRESHED') {
                if (isMounted) {
                    setSession(fetchedSession);
                    setIsLoading(false);
                }
                return;
            }

            if (isMounted) {
                setIsLoading(true);
            }

            if (!fetchedSession) {
                if (isMounted) {
                    setSession(null);
                    setRole(null);
                    setIsLoading(false);
                }
                return;
            }

            try {
                const fetchedRole = await getRole(fetchedSession.user.id);
                if (isMounted) {
                    setRole(fetchedRole);
                    setSession(fetchedSession);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        });

        //cleanup function
        return () => {
            console.log('AuthProvider component unmounted');
            isMounted = false;
            subscription.unsubscribe();
        }
    }, []);

    return <AuthContext.Provider value={{session, role, isLoading}}>{children}</AuthContext.Provider>
}

export { AuthProvider, AuthContext };