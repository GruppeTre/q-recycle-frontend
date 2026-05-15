import {useEffect, useRef, useState} from "react";
import mapboxgl from 'mapbox-gl';
import { MAP_CENTER, MAP_ZOOM} from "../constants/stops.js";

export function useMapBox(token, containerRef) {
    const mapRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        if(!token || !containerRef.current || mapRef.current) return;

        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
            container: containerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: MAP_CENTER,
            zoom: MAP_ZOOM,
            attributionControl: false,
        })

        map.addControl(
            new mapboxgl.NavigationControl({showCompass: false}),
            "top-right"
        )

        map.on("load", () => {setMapReady(true);})

        mapRef.current = map
        return () => {
            map.remove()
            mapRef.current = null
            setMapReady(false)
        }
    }, [token, containerRef])

    return {mapRef, mapReady}
}