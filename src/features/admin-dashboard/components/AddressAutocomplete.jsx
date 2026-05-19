import { useState, useRef, useEffect } from "react";
import { useAddressSuggestions } from "../hooks/useAddressSuggestions.js";

function AddressAutocomplete({ onSelect, selectedAddress }) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const { suggestions, isLoading } = useAddressSuggestions(query);

    // Luk dropdown ved klik udenfor komponentet
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (suggestion) => {
        onSelect(suggestion);
        setQuery("");
        setIsOpen(false);
    };

    // Hvis en adresse allerede er valgt, vis den med mulighed for at ændre
    if (selectedAddress) {
        return (
            <div className="flex flex-col gap-1">
                <span className="text-sm">Adresse</span>
                <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-md">
                    <span className="text-sm">{selectedAddress.displayText}</span>
                    <button
                        type="button"
                        onClick={() => onSelect(null)}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        Skift adresse
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 relative" ref={containerRef}>
            <span className="text-sm">Adresse</span>
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Søg adresse..."
                className="bg-gray-200 p-3 rounded-md"
                autoComplete="off"
            />

            {isOpen && query.length >= 3 && (
                <ul className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {isLoading && (
                        <li className="p-3 text-sm text-gray-500">Søger...</li>
                    )}
                    {!isLoading && suggestions.length === 0 && (
                        <li className="p-3 text-sm text-gray-500">Ingen resultater</li>
                    )}
                    {suggestions.map((suggestion, i) => (
                        <li
                            key={i}
                            onClick={() => handleSelect(suggestion)}
                            className="p-3 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                            {suggestion.displayText}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AddressAutocomplete;