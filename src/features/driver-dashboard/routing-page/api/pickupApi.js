import { supabaseClient } from "../../../../lib/supabaseClient.js";

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

    async fetchActive(){
        const { data, error } = await supabaseClient
        .from("pickup")
            .select(`
                id,
                bags,
                status,
                completed_at,
                    partner:partner (
                    id,
                    name,
                    address:address (
                        street,
                        zipcode,
                        city,
                        lng,
                        lat
                    )
                )
            `)
            .in("status", ["scheduled", "completed"])
            .order("scheduled_at", { ascending: true });
        if (error) throw error;

        return (data ?? [])
            .filter((row) =>
                row.partner?.address?.lng != null &&
                row.partner?.address?.lat != null
            )
            .map((row) => ({
                id: row.id,
                bags: row.bags,
                status: row.status,
                completed_at: row.completed_at,
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

    async markCompleted(id, actualBags) {
        const { error } = await supabaseClient
            .from("pickup")
            .update({
                bags: actualBags,
                status: "completed",
                completed_at: new Date().toISOString()
            })
            .eq("id", id);
        if (error) throw error;
    },

    async revertToScheduled(id) {
        const { error } = await supabaseClient
        .from("pickup")
        .update({
            status: "scheduled",
            completed_at: null,
        })
        .eq("id", id);

        if (error) throw error;
    },

    async revertAllScheduled(){
        const { error } = await supabaseClient
            .from("pickup")
            .update({
                status: "requested",
                scheduled_at: null,
            })
            .eq("status", "scheduled");
        if (error) throw error;
    },

    // Archive completed requests to prevent contaminations on new routes
    async archiveCompletedRoute() {
        const { error } = await supabaseClient
            .from("pickup")
            .update({ status: "archived" })
            .eq("status", "completed");
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