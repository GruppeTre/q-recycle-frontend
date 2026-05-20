import { useEffect, useState } from "react";
import { pickups } from "../../../lib/pickups.js";
import { supabaseClient } from "../../../lib/supabaseClient.js";

export function useRequestedBagsCount() {
    const [count, setCount] = useState(null); // null = loading
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchCount = async () => {
            try {
                const value = await pickups.getRequestedCount();
                if (isMounted) {
                    setCount(value);
                    setError(null);
                }
            } catch (e) {
                if (isMounted) setError(e);
                console.log(e);
            }

        };

        fetchCount();

        const channel = supabaseClient
            .channel('pickup-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'pickup' },
                fetchCount
            )
            .subscribe();

        return () => {
            isMounted = false;
            channel.unsubscribe();
        };
    }, []);

    return { count, error };
}