import {supabaseClient} from "./supabaseClient.js";

export async function passwordSignIn(identifier, password) {

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: identifier,
        password: password
    })

    return { data, error }
}

export async function getRole(userId) {
    const { data } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    if (!data) {
        return null;
    }

    return data.role;
}