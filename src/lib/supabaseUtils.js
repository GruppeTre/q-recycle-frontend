import {createClient} from "@supabase/supabase-js";

export async function passwordSignIn(identifier, password) {

    const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: `${identifier}`,
        password: `${password}`
    })

    if (error.code === 'invalid_credentials') {
        throw new Error('Bad credentials');
    }

    return data;
}