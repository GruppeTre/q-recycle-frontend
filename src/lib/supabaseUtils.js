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

    return data ? data : null;
}

export async function getRole(userId) {
    const { data, error: postgresError } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    if (postgresError) {
        const error = new Error(postgresError.message);
        error.code = postgresError.code;
        throw error;
    }

    return data ? data.role : null;
}