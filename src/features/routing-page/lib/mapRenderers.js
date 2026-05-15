import mapboxgl from "mapbox-gl";

export function renderPickupMarkers(map, stops, markersRef, { numbered = false} = {}) {

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    stops.forEach((stop, i) => {
        const label = numbered ? String(i + 1) : "•";
        const color = numbered ? COLORS.selected : COLORS.pending;
        const el = buildMarkerEl(label, color)

        const popup = new mapboxgl.Popup({offset: 24, closeButton: false})

        const marker = new mapboxgl.Marker({ element: el })
            .setLngLat(stop.coords)
            .setPopup(popup)
            .addTo(map);

        markersRef.current.push(marker);
    });
}

export function renderDriverDot(map, position, driverMarkerRef){
    if (!position) return;

    if(!driverMarkerRef.current) {
        const el = document.createElement("div");

        driverMarkerRef.current = new mapboxgl.Marker({element: el, anchor: "center"})
            .setLngLat(position)
            .addTo(map);
    } else {
        driverMarkerRef.current.setLngLat(position);
    }
}

export function renderRoute(map, geometry){
    if (map.getLayer("route-glow")) map.removeLayer("route-glow");
    if (map.getLayer("route-line")) map.removeLayer("route-line");
    if (map.getSource("route")) map.removeSource("route");

    map.addSource("route", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry },
    });

    map.addLayer({
        id: "route-glow", type: "line", source: "route",
        paint: {"line-color": COLORS.route, "line-width": 14, "line-opacity": 0.18},
    });

    map.addLayer({
        id: "route-line", type: "line", source: "route",
        paint: {"line-color": COLORS.route, "line-width": 5, "line-opacity": 0.95},
    })
}