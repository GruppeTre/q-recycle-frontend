import {supabaseClient} from "./supabaseClient.js";

export async function passwordSignIn(identifier, password) {

    const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: identifier,
        password: password
    });

    if (authError) {
        const error = new Error(authError.message);
        error.code = authError.code;
        throw error;
    }

    return data;
}

export async function getRole(userId) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    if (!data) {
        return null;
    }

    if (error) {
        console.error(error);
    }

    return data.role;
}