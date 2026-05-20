import { useEffect, useState } from "react";
import { supabaseClient } from "../../../lib/supabaseClient.js";
import {pickupRequest} from "../../../lib/pickupRequest.js";

export function useRequestedBagsCount() {
    const [count, setCount] = useState(null); // null = loading
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchCount = async () => {
            try {
                const value = await pickupRequest.getRequestedCount();
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