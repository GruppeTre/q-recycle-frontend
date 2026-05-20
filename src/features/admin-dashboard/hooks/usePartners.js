import { useEffect, useState } from "react";
import { partners } from "../../../lib/partners.js";
import { supabaseClient } from "../../../lib/supabaseClient.js";

export function usePartners() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPartners = async () => {
            try {
                const result = await partners.list();
                if (isMounted) {
                    setData(result);
                    setError(null);
                }
            } catch (e) {
                if (isMounted) setError(e);
            }
        };

        fetchPartners();

        // Real-time: opdatér listen automatisk, når partnere oprettes/slettes
        const channel = supabaseClient
            .channel("partner-list-changes")
            .on("postgres_changes",
                { event: "*", schema: "public", table: "partner" },
                fetchPartners
            )
            .subscribe();

        return () => {
            isMounted = false;
            channel.unsubscribe();
        };
    }, []);

    return { partners: data, error };
}