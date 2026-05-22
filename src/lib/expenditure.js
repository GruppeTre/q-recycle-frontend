import {supabaseClient} from "./supabaseClient.js";

export const expenditure = {
    getAll: async()  => {
        const { data, error: postgresError } = await supabaseClient
            .from('expenditure')
            .select();

        if (postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }

        return data;
    },

    getAllAfter: async(date) => {

        if (!date) {
            const error = new Error('must provide a valid date');
            error.code = -1;
            throw error;
        }

        const { data, error: postgresError } = await supabaseClient
            .from('expenditure')
            .select(`
                amount,
                is_pending,
                created_at
            `)
            .gte('created_at', date.toISOString());

        if (postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }

        return data;
    }
}