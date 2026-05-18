import mapboxgl from "mapbox-gl";
import { COLORS } from "../constants/mapConfig.js";

// All these helpers take the Mapbox `map` instance and mutate it imperatively.
// We keep them as plain functions (not hooks, not components) because Mapbox is
// fundamentally an imperative library — React doesn't manage its DOM.

// Build a styled circular marker element with a label inside (a number).
function buildMarkerEl(label, color) {
    const el = document.createElement("div");
    Object.assign(el.style, {
        width: "32px",
        height: "32px",
        backgroundColor: color,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: "700",
        color: "#0f172a",
        border: "2px solid rgba(255, 255, 255, 0.95)",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
        cursor: "pointer",
    });
    el.textContent = label;
    return el;
}

// Draw the list of pickup markers. Pass in:
//   stops       — array of { coords:[lng,lat], partner_name, address, bags }
//   markersRef  — a useRef array we mutate; this lets us clean up old markers
//   numbered    — true after optimisation (1,2,3…) / false before (just a dot)
export function renderPickupMarkers(map, stops, markersRef, { numbered = false } = {}) {
    // Always clear previous markers first — otherwise they pile up across re-renders.
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    stops.forEach((stop, i) => {
        const label = numbered ? String(i + 1) : "•";
        const color = numbered ? COLORS.selected : COLORS.pending;
        const el = buildMarkerEl(label, color);

        const popup = new mapboxgl.Popup({ offset: 24, closeButton: false }).setHTML(
            `<strong>${stop.partner_name}</strong><br>${stop.address}<br>${stop.bags} bags`
        );

        const marker = new mapboxgl.Marker({ element: el })
            .setLngLat(stop.coords)
            .setPopup(popup)
            .addTo(map);

        markersRef.current.push(marker);
    });
}

// Draw / replace the route line. `geometry` comes straight from Directions API
// (GeoJSON LineString).
export function renderRoute(map, geometry) {
    if (map.getLayer("route-glow")) map.removeLayer("route-glow");
    if (map.getLayer("route-line")) map.removeLayer("route-line");
    if (map.getSource("route")) map.removeSource("route");

    map.addSource("route", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry },
    });

    // Two layers stacked to get a glow effect — wider transparent line under the
    // crisp main line. Same source, different paint.
    map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": COLORS.route, "line-width": 14, "line-opacity": 0.18 },
    });

    map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": COLORS.route, "line-width": 5, "line-opacity": 0.95 },
    });
}

export function clearRoute(map) {
    if (!map) return;
    if (map.getLayer("route-glow")) map.removeLayer("route-glow");
    if (map.getLayer("route-line")) map.removeLayer("route-line");
    if (map.getSource("route")) map.removeSource("route");
}

// Render (or move) the blue dot representing the driver. We keep a single
// marker instance and just call setLngLat() on it for performance.
//
// We track it in a ref the caller owns so we don't create a new dot on every
// position update.
export function renderDriverDot(map, position, driverMarkerRef) {
    if (!position) return;

    if (!driverMarkerRef.current) {
        const el = document.createElement("div");
        Object.assign(el.style, {
            width: "20px",
            height: "20px",
            backgroundColor: COLORS.driver,
            borderRadius: "50%",
            border: "3px solid #fff",
            boxShadow: "0 0 0 4px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.4)",
        });
        driverMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
            .setLngLat(position)
            .addTo(map);
    } else {
        driverMarkerRef.current.setLngLat(position);
    }
}
