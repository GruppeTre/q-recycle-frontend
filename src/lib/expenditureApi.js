import {supabaseClient} from "./supabaseClient.js";

export const expenditureApi = {
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
                name,
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
    },

    getAllByUserId: async (userId) => {

        if (!userId) {
            const error = new Error('must provide a user ID');
            error.code = -1;
            throw error;
        }

        const { data, error: postgresError } = await supabaseClient
            .from('expenditure')
            .select(`
                id,
                amount,
                name,
                is_pending,
                created_at
            `)
            .eq('user_id', userId);

        if (postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }

        return data;
    },

    deleteById: async (id) => {
        const { error: postgresError } = await supabaseClient
            .from('expenditure')
            .delete()
            .eq('id', id);

        if (postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }
    },

    add: async (expenditure) => {
        const { data, error: postgresError } = await supabaseClient
            .from('expenditure')
            .insert({
                user_id: expenditure.user_id,
                amount: expenditure.amount,
                is_pending: expenditure.is_pending,
                name: expenditure.name,
                created_at: expenditure.created_at
            })
            .select()
            .single();

        if (postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }

        return data;
    },

    update: async (expenditure) => {

        console.log(`Trying to call update in supabase with object: ${JSON.stringify(expenditure)}`);

        const { data, error: postgresError } = await supabaseClient
            .from('expenditure')
            .update({
                user_id: expenditure.user_id,
                amount: expenditure.amount,
                is_pending: expenditure.is_pending,
                name: expenditure.name,
                created_at: expenditure.created_at
            })
            .eq('id', expenditure.id)
            .select()
            .single();

        console.log(JSON.stringify(data));

        if (postgresError) {
            const error = new Error(JSON.stringify(postgresError));
            error.code = postgresError.code;
            throw error;
        }

        return data;
    }
}