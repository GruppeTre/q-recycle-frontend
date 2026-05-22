import { supabaseClient } from "../../../lib/supabaseClient.js";

export const pickupApi = {
    async fetchPending() {
        const { data, error } = await supabaseClient
            .from("pickup")
            .select(`
                id,
                bags,
                created_at,
                partner:partner (
                    id,
                    name,
                    address:address (
                        id,
                        street,
                        zipcode,
                        city,
                        lng,
                        lat
                    )
                )
            `)
            .eq("status", "requested")
            .order("created_at", { ascending: true });

        if (error) throw error;

        console.log('Raw Supabase data:', JSON.stringify(data, null, 2));

        return (data ?? [])
            .filter((row) =>
                row.partner?.address?.lng != null &&
                row.partner?.address?.lat != null
            )
            .map((row) => ({
                id: row.id,
                bags: row.bags,
                created_at: row.created_at,
                partner_name: row.partner.name,
                address: formatAddress(row.partner.address),
                coords: [row.partner.address.lng, row.partner.address.lat],
            }));
    },

    async markScheduled(ids) {
        if (!ids?.length) return;
        const { error } = await supabaseClient
            .from("pickup")
            .update({ status: "scheduled", scheduled_at: new Date().toISOString() })
            .in("id", ids);
        if (error) throw error;
    },

    async markCompleted(id) {
        const { error } = await supabaseClient
            .from("pickup")
            .update({ status: "completed", completed_at: new Date().toISOString() })
            .eq("id", id);
        if (error) throw error;
    },
};

function formatAddress(addr) {
    if (!addr) return "";
    const parts = [addr.street];
    if (addr.postal_code || addr.city) {
        parts.push([addr.postal_code, addr.city].filter(Boolean).join(" "));
    }
    return parts.join(", ");
}