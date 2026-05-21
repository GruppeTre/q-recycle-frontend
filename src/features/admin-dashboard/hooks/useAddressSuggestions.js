import { useEffect, useState } from "react";

export function useAddressSuggestions(query) {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!query || query.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        const controller = new AbortController();

        const timer = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://api.dataforsyningen.dk/adresser/autocomplete?q=${encodeURIComponent(query)}`,
                    { signal: controller.signal }
                );
                const data = await response.json();

                setSuggestions(data.map(item => ({
                    displayText: item.tekst,
                    street: item.adresse.vejnavn,
                    number: item.adresse.husnr,
                    zipcode: item.adresse.postnr,
                    city: item.adresse.postnrnavn,
                    lng: item.adresse.x,
                    lat: item.adresse.y,
                })));
            } catch (e) {
                if (e.name !== "AbortError") {
                    console.error("DAWA fetch failed:", e);
                    setSuggestions([]);
                }
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    return { suggestions, isLoading };
}