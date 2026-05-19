import {supabaseClient} from "./supabaseClient.js";

export const profiles = {
    getRole: async (userId) => {
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
    },
}