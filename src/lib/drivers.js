import { supabaseClient } from "./supabaseClient.js";

export const drivers = {
    create: async ({ firstname, surname, phoneNumber }) => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) {
            const error = new Error("Du skal være logget ind");
            error.code = "unauthorized";
            throw error;
        }

        const { data, error: invokeError } = await supabaseClient.functions.invoke(
            "create-driver",
            { body: { firstname, surname, phoneNumber } }
        );

        if (invokeError) {
            const error = new Error(invokeError.message);
            error.fieldErrors = invokeError.context?.fieldErrors;
            throw error;
        }

        return data; // { pin, driverId }
    },

    list: async () => {
        const { data, error: postgresError } = await supabaseClient
            .from("driver")
            .select("id, firstname, surname, phonenumber")
            .order("firstname", { ascending: true });

        if (postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }
        return data ?? [];
    },

    get: async (id) => {
        const { data, error: postgresError } = await supabaseClient
            .from("driver")
            .select("id, firstname, surname, phonenumber")
            .eq("id", id)
            .single();

        if (postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }
        return data;
    },

    update: async (id, { firstname, surname, phoneNumber }) => {
        const { error: postgresError } = await supabaseClient
            .from("driver")
            .update({
                firstname,
                surname,
                phonenumber: phoneNumber ?? null,
            })
            .eq("id", id);

        if (postgresError) {
            const error = new Error("Could not update driver: " + postgresError.message);
            error.code = postgresError.code;
            throw error;
        }
        return { id };
    },

    delete: async (id) => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) {
            const error = new Error("Du skal være logget ind");
            error.code = "unauthorized";
            throw error;
        }

        const { data, error: invokeError } = await supabaseClient.functions.invoke(
            "delete-driver",
            { body: { driverId: id } }
        );

        if (invokeError) {
            const error = new Error(invokeError.message);
            throw error;
        }
        return data;
    },
};