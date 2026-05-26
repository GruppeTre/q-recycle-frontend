import { supabaseClient } from "./supabaseClient.js";

export const accountApi = {
    async fetchAllDrivers() {
        const { data, error } = await supabaseClient
            .from("account")
            .select("*")
            .order("firstname", { ascending: true });

        if (error) throw error;
        return data ?? [];
    },

    async deleteDriver(driverId) {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) {
            const error = new Error("Du skal være logget ind");
            error.code = "unauthorized";
            throw error;
        }

        const { data, error: invokeError } = await supabaseClient.functions.invoke(
            "delete-driver",
            { body: { driverId } }
        );

        if (invokeError) throw new Error(invokeError.message);
        return data;
    },

    async fetchDriverById(driverId) {
        const { data, error } = await supabaseClient
            .from("account")
            .select("*")
            .eq("id", driverId)
            .single();

        if (error) throw error;
        return data;
    },

    async updateDriver(driverId, { firstname, surname, phoneNumber }) {
        const { error } = await supabaseClient
            .from("account")
            .update({
                firstname,
                surname,
                phonenumber: phoneNumber ?? null,
            })
            .eq("id", driverId);

        if (error) throw new Error("Could not update driver: " + error.message);
        return { id: driverId };
    },

    async createDriver({ email, password, firstname, surname, phone}) {
        const { data, error } = await supabaseClient.functions.invoke('create-driver', {
            body: {email, password, firstname, surname, phone}
        });
        if (error) throw error;
        if(data?.error){
            const err = new Error(data.error);
            err.fieldErrors = data.fieldErrors;
            throw err;
        }
        return data;
    }
};