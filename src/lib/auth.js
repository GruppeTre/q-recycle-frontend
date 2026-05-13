import {supabaseClient} from "./supabaseClient.js";

export const auth = {
    signIn: async (identifier, password) => {

        const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
            email: identifier,
            password: password
        });

        if (authError) {
            const error = new Error(authError.message);
            error.code = authError.code;
            throw error;
        }

        return data ? data : null;
    }
}