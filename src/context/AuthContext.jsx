import {createContext, useContext} from "react";

const AuthContext = createContext(null);

const AuthProvider = ({children}) => {
    //all the supabase code here
    const placeholderValue = 'context value'

    return <AuthContext.Provider value={placeholderValue}>{children}</AuthContext.Provider>
}

export { AuthProvider, AuthContext };