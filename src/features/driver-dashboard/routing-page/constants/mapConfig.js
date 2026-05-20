// Map-level configuration. Center on Copenhagen by default.
// Coordinates are [longitude, latitude] — Mapbox's standard order.
export const MAP_CENTER = [12.5683, 55.6761];
export const MAP_ZOOM = 12;

// Colour palette used for markers and route line
export const COLORS = {
    driver: "#3b82f6",   // blue dot for driver's GPS position
    pending: "#a8a29e",  // grey for un-selected pickup requests
    selected: "var(--color-primary)", // amber for selected (will be on the route)
    route: "#d4a574",    // green for the rendered route line
    start: "#a78bfa",    // purple for the driver's starting point
};

export const STORAGE = {
    name: "Storage - Retortvej 38",
    address: "Retortvej 38, 2500 København NV",
    coords: [12.501672, 55.65358]
}
