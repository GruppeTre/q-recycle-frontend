import { useEffect, useState } from "react";
import { supabaseClient } from "../../../lib/supabaseClient.js";
import {drivers} from "../../../lib/drivers.js";

export function useDrivers() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchDrivers = async () => {
            try {
                const result = await drivers.list();
                if (isMounted) {
                    setData(result);
                    setError(null);
                }
            } catch (e) {
                if (isMounted) setError(e);
            }
        };

        fetchDrivers();

        // Real-time: opdatér listen automatisk, når partnere oprettes/slettes
        const channel = supabaseClient
            .channel("driver-list-changes")
            .on("postgres_changes",
                { event: "*", schema: "public", table: "driver" },
                fetchDrivers
            )
            .subscribe();

        return () => {
            isMounted = false;
            channel.unsubscribe();
        };
    }, []);

    return { drivers: data, error };
}