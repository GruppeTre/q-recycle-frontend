import {createContext, useEffect, useState} from "react";
import {supabaseClient} from "../lib/supabaseClient.js";
import {getRole} from "../lib/supabaseUtils.js";

const AuthContext = createContext(null);

const AuthProvider = ({children}) => {
    //all the supabase code here

    const [ session, setSession ] = useState(null);
    const [ role, setRole ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {

        const { data: { subscription} } = supabaseClient.auth.onAuthStateChange( async (event, fetchedSession) => {

            //debug log statement, just so I can see it working
            console.log(`Handling Auth state change: ${event}`);

            if (!fetchedSession) {
                setSession(null);
                setRole(null);
                setIsLoading(false);
                return;
            }

            setSession(fetchedSession);

            const userId = fetchedSession.user.id;
            const fetchedRole = await getRole(userId)
            setRole(fetchedRole);


            setIsLoading(false);
        });

        //cleanup function
        return () => {
            subscription.unsubscribe();
        }
    }, []);

    return <AuthContext.Provider value={{session, role, isLoading}}>{children}</AuthContext.Provider>
}

export { AuthProvider, AuthContext };