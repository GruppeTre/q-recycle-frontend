import {supabaseClient} from "./supabaseClient.js";

export async function passwordSignIn(identifier, password) {

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: identifier,
        password: password
    })

    return { data, error }
}