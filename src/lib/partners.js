import { supabaseClient } from "./supabaseClient.js";

export const partners = {
    create: async ({ name, phoneNumber, address }) => {
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (!session) {
            const error = new Error("Du skal være logget ind");
            error.code = "unauthorized";
            throw error;
        }

        const { data, error: invokeError } = await supabaseClient.functions.invoke(
            "create-partner",
            { body: { name, phoneNumber, address } }
        );

        if (invokeError) {
            const error = new Error(invokeError.message);
            error.fieldErrors = invokeError.context?.fieldErrors;
            throw error;
        }

        return data;
    },

    list: async () => {
        const { data, error: postgresError } = await supabaseClient
            .from("partner")
            .select(`
                id,
                name,
                phone_number,
                address (
                    street,
                    number,
                    zipcode,
                    city
                )
            `)
            .order("name", { ascending: true });

        if (postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }

        return data ?? [];
    },
};