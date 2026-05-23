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

    get: async (id) => {
        const { data, error: postgresError } = await supabaseClient
            .from("partner")
            .select(`
                id,
                name,
                phone_number,
                address_id,
                address (
                    id,
                    street,
                    number,
                    zipcode,
                    city,
                    lng,
                    lat
                )
            `)
            .eq("id", id)
            .single();

        if (postgresError) {
            const error = new Error(postgresError.message);
            error.code = postgresError.code;
            throw error;
        }

        return data;
    },

    update: async (id, { name, phoneNumber, address }) => {
        // 1. Hent partner for at få address_id
        const { data: existing, error: fetchError } = await supabaseClient
            .from("partner")
            .select("address_id")
            .eq("id", id)
            .single();

        if (fetchError) {
            const error = new Error(fetchError.message);
            error.code = fetchError.code;
            throw error;
        }

        // 2. Opdater adresse-rækken
        const { error: addressError } = await supabaseClient
            .from("address")
            .update({
                street: address.street,
                number: address.number ?? null,
                zipcode: address.zipcode,
                city: address.city,
                lng: address.lng,
                lat: address.lat,
            })
            .eq("id", existing.address_id);

        if (addressError) {
            const error = new Error("Could not update address: " + addressError.message);
            error.code = addressError.code;
            throw error;
        }

        // 3. Opdater partner-rækken
        const { error: partnerError } = await supabaseClient
            .from("partner")
            .update({
                name,
                phone_number: phoneNumber ?? null,
            })
            .eq("id", id);

        if (partnerError) {
            const error = new Error("Could not update partner: " + partnerError.message);
            error.code = partnerError.code;
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
            "delete-partner",
            { body: { partnerId: id } }
        );

        if (invokeError) {
            const error = new Error(invokeError.message);
            error.code = invokeError.context?.code;
            throw error;
        }

        return data;
    },
};