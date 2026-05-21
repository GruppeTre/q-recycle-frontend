import {supabaseClient} from "./supabaseClient.js";
import {pickupStatus} from "../config/constants.js";

export const pickupRequest = {

    getActive: async (userId) => {
        const { data, error: postgresError } = await supabaseClient
            .from("pickup")
            .select("*")
            .eq("partner_id", userId)
            .eq("status", pickupStatus.REQUESTED)
            .maybeSingle()

        if(postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }
        return data ?? null;
    },

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

    getAllCompleted: async () => {
        const { data, error: postgresError } = await supabaseClient
            .from('pickup')
            .select(`
                id,
                bags,
                completed_at,
                partner:partner (
                    id,
                    name
                )
            `)
            .eq('status', pickupStatus.COMPLETED);

        if (postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }

        console.log(JSON.stringify(data));

        return data;
    },

    getAllCompletedAfter: async (date) => {

        if (!date) {
            const error = new Error('must provide a valid date');
            error.code = -1;
            throw error;
        }

        const { data, error: postgresError } = await supabaseClient
            .from('pickup')
            .select(`
                id,
                bags,
                completed_at,
                partner:partner (
                    id,
                    name
                )
            `)
            .gte('completed_at', date.toISOString())
            .eq('status', pickupStatus.COMPLETED);

        if (postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }

        return data;
    },
}