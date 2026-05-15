import {supabaseClient} from "../../../lib/supabaseClient.js";

export const pickupApi = {
    async fetchPending() {
        const { data, error} = await supabaseClient
            .from("pickup")
            .select("*")
            .eq("status", "requested")
            .order("created_at", {ascending: true});

        if (error) throw error;

        return (data ?? []).map((r) => ({
            id: r.id,
            name: r.name,
            address: r.address,
            coords: [r.lng, r.lat],
            bags: r.bags,
            created_at: r.created_at,
        }));
    },

    async markScheduled(ids) {
        if (!ids?.length) return;
        const {error} = await supabaseClient
            .from("pickup")
            .update({status: "scheduled", scheduled_at: new Date().toISOString() })
            .in("id", ids);
        if (error) throw error;
    },

    async markCompleted(id) { /* for later */}
}