import { supabaseClient } from "./supabaseClient.js";

export const accountApi = {
    async fetchAllDrivers(){
        const { data, error } = await supabaseClient
            .from("account")
            .select("*")
            .order("firstname", { ascending: true })

        if (error) throw error;

        return data ?? [];
    },
};