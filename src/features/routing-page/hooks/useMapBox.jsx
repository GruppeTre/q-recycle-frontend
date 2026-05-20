import {useCallback, useRef, useState} from "react";
import mapboxgl from "mapbox-gl";
import { MAP_CENTER, MAP_ZOOM } from "../constants/mapConfig.js";

export function useMapBox(token) {
    const mapRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);

    // Callback ref — React kalder den med DOM-noden så snart den er klar
    const containerRef = useCallback((node) => {
        if (!node || !token || mapRef.current) return;

        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
            container: node,
            style: 'mapbox://styles/mapbox/light-v11',
            center: MAP_CENTER,
            zoom: MAP_ZOOM,
        });

        map.on("load", () => setMapReady(true));

        // Watch container size and resize map whenever it changes
        const observer = new ResizeObserver(() => map.resize());
        observer.observe(node);

        mapRef.current = map;
        mapRef.current._observer = observer;  // stash so we can clean up
    }, [token]);

    return { mapRef, mapReady, containerRef };
}