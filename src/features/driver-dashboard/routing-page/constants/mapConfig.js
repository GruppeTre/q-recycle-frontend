// Map-level configuration. Center on Copenhagen by default.
// Coordinates are [longitude, latitude] — Mapbox's standard order.
export const MAP_CENTER = [12.5683, 55.6761];
export const MAP_ZOOM = 12;

// Colour palette used for markers and route line
export const COLORS = {
    driver: "#3b82f6",   // blue dot for driver's GPS position
    pending: "#94a3b8",  // grey for un-selected pickup requests
    selected: "#f59e0b", // amber for selected (will be on the route)
    route: "#10b981",    // green for the rendered route line
    start: "#8b5cf6",    // purple for the driver's starting point
};

export const STORAGE = {
    name: "Storage - Retortvej 38",
    address: "Retortvej 38, 2500 København NV",
    coords: [12.501672, 55.65358]
}
