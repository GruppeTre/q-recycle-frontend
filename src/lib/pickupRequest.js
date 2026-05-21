import {supabaseClient} from "./supabaseClient.js";
import {pickupStatus} from "../config/constants.js";

function handlePostgresError(postgresError) {
    if (postgresError) {
        const error = new Error(postgresError.message);
        error.code = postgresError.code;
        throw error;
    }
}


export const pickupRequest = {
    getActive: async (userId) => {

        const {data, error: postgresError} = await supabaseClient
            .from("pickup")
            .select("*")
            .eq("partner_id", userId)
            .eq("status", pickupStatus.REQUESTED)

        console.log(JSON.stringify(data, null, 2))

        handlePostgresError(postgresError);

        return data;

    },


    cancelActive: async (userId) => {
        const {error: postgresError} = await supabaseClient
            .from("pickup")
            .update({status: pickupStatus.CANCELLED})
            .eq("partner_id", userId)
            .eq("status", pickupStatus.REQUESTED)

        handlePostgresError(postgresError);

    },

    update: async (id, bags) => {
        const {error: postgresError} = await supabaseClient
        .from("pickup")
            .update({
                bags: bags,
            })
            .eq("id", id)

        handlePostgresError(postgresError);
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


}