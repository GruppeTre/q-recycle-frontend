import {supabaseClient} from "./supabaseClient.js";

export async function passwordSignIn(identifier, password) {

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: `${identifier}`,
        password: `${password}`
    })

    if (error?.code === 'invalid_credentials') {
        throw new Error('Bad credentials');
    }

    return data;
}