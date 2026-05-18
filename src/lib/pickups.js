import { supabaseClient } from "./supabaseClient.js";

export const pickups = {
    getRequestedCount: async () => {
        const { data, error: postgresError } = await supabaseClient
            .from('pickup')
            .select('bags')
            .eq('status', 'requested');

        if (postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }

        const totalBags = (data ?? []).reduce((sum, row) => sum + (row.bags ?? 0), 0);
        return totalBags;
    },
};