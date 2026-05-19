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
};