import mapboxgl from "mapbox-gl";
import { useRef, useState } from "react";
import { useMapBox } from "./hooks/useMapBox.jsx";
import { STOPS } from "./constants/stops.js";

const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function coordsToString(coordsList) {
    return coordsList.map((c) => `${c[0]},${c[1]}`).join(";");
}

export const mapboxApi = {
    async optimize(startCoords, stops){
        const allCoords = [startCoords, ...stops.map((s) => s.coords)];
        const coords = coordsToString(allCoords);

        const url
    }
}
export default function MapApp() {
    const containerRef = useRef(null);
    const markersRef = useRef([]);

    const { mapRef, mapReady } = useMapBox(token, containerRef);

    const [optimized, setOptimized] = useState(false);
    const [orderedStops, setOrderedStops] = useState(STOPS);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Add initial (un-optimized) markers once the map is ready.
    // useRef as a one-shot guard so we don't re-add on every render.
    const didInitMarkers = useRef(false);
    if (mapReady && !didInitMarkers.current) {
        didInitMarkers.current = true;
        addMarkers(mapRef.current, STOPS, markersRef, false);
    }

    async function handleOptimize() {
        if (!mapReady || loading) return;
        setLoading(true);
        setError("");

        try {
            const coords = STOPS.map((s) => s.coords.join(",")).join(";");

            const url =
                `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coords}` +
                `?roundtrip=true&overview=full&geometries=geojson` +
                `&access_token=${token}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.code !== "Ok") {
                throw new Error(data.message || `API fejl: ${data.code}`);
            }

            const trip = data.trips[0];

            // Sort STOPS based on the optimized waypoint order returned by Mapbox.
            // Each waypoint corresponds to the input stop at the same index.
            const ordered = data.waypoints
                .map((wp, i) => ({ waypoint_index: wp.waypoint_index, stop: STOPS[i] }))
                .filter(({ stop }) => stop !== undefined)
                .sort((a, b) => a.waypoint_index - b.waypoint_index)
                .map(({ stop }) => stop);

            setOrderedStops(ordered);
            setStats({
                time: Math.round(trip.duration / 60),
                dist: (trip.distance / 1000).toFixed(1),
            });

            const map = mapRef.current;
            drawRoute(map, trip.geometry);
            addMarkers(map, ordered, markersRef, true);

            const bounds = new mapboxgl.LngLatBounds();
            ordered.forEach((s) => bounds.extend(s.coords));
            map.fitBounds(bounds, { padding: 72, duration: 900 });

            setOptimized(true);
        } catch (err) {
            setError(err.message || "Noget gik galt.");
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        const map = mapRef.current;
        if (!map) return;

        clearRoute(map);
        addMarkers(map, STOPS, markersRef, false);

        setOrderedStops(STOPS);
        setStats(null);
        setOptimized(false);
        setError("");
    }

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Header — fast højde */}
            <div style={{ flexShrink: 0, padding: "12px 16px", background: "#0f172a", color: "#fff" }}>
                <h2 style={{ margin: 0, fontSize: 18 }}>Route Optimizer</h2>
            </div>

            {/* Kortet — fylder al tilgængelig plads */}
            <div ref={containerRef} style={{ flex: "1 1 0", minHeight: 0 }} />

            {/* Bund-panel — fast maks-højde */}
            <div
                style={{
                    flexShrink: 0,
                    maxHeight: "45vh",
                    overflowY: "auto",
                    padding: "12px 16px",
                    background: "#1e293b",
                    color: "#fff",
                }}
            >
                {/* Stop-liste */}
                <ol style={{ margin: "0 0 12px 0", paddingLeft: 20 }}>
                    {orderedStops.map((stop, i) => (
                        <li key={`${stop.id}-${i}`} style={{ padding: "4px 0" }}>
                            <strong>{stop.name}</strong>
                            <span style={{ color: "#94a3b8", marginLeft: 8, fontSize: 12 }}>
                                {stop.address}
                            </span>
                        </li>
                    ))}
                </ol>

                {/* Stats vises kun når optimized === true */}
                {stats && (
                    <div style={{ marginBottom: 8, fontSize: 14 }}>
                        🕒 {stats.time} min · 📏 {stats.dist} km
                    </div>
                )}

                {/* Fejl */}
                {error && (
                    <div style={{ color: "#fca5a5", marginBottom: 8, fontSize: 13 }}>
                        {error}
                    </div>
                )}

                {/* Knap skifter adfærd baseret på state */}
                <button
                    onClick={optimized ? handleReset : handleOptimize}
                    disabled={!mapReady || loading}
                    style={{
                        padding: "10px 20px",
                        background: optimized ? "#64748b" : "#4ecdc4",
                        color: "#0f172a",
                        border: "none",
                        borderRadius: 6,
                        fontWeight: 700,
                        cursor: mapReady && !loading ? "pointer" : "not-allowed",
                        opacity: mapReady && !loading ? 1 : 0.5,
                    }}
                >
                    {loading ? "Optimerer..." : optimized ? "Nulstil" : "Optimer"}
                </button>
            </div>
        </div>
    );
}
