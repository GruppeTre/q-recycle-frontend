import { supabaseClient } from "./supabaseClient.js";

export const routesApi = {
    async fetchAll({ sinceDate }) {
        let query = supabaseClient
            .from("routes")
            .select("*")
            .order("date", {ascending: false});
        if (sinceDate) {
            query = query.gte("date", sinceDate.toISOString());
        }

        const { data, error } = await query;

        if (error) throw error;

        return data ?? [];
    },
}