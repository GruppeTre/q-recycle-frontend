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
    }
}