const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function coordsToString(coordsList) {
    return coordsList.map((c) => `${c[0]},${c[1]}`).join(";");
}

export const mapboxApi = {
    async optimize(startCoords, stops){
        const allCoords = [startCoords, ...stops.map((s) => s.coords)];
        const coords = coordsToString(allCoords);

        const url =
            `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coords}` +
            `?source=first&destination=last&roundtrip=false` +
            `&overview=full&geometry=geojson` +
            `&access_token=${token}`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.code !== "Ok") throw new Error(data.message || data.code);

        const trip = data.trips[0]

        const ordered = data.waypoints
            .slice(1)
            .map((wp, i) => ({waypoint_index: wp.waypoint_index, stop: stops[i]}))
            .sort((a, b) => a.waypoint_index - b.waypoint_index)
            .map(({stop}) => stop);
        return { orderedStops: ordered, geometry: trip.geometry, ... };
    },

    async directions(startCoords, orderedStops) {
        const Allcords = [startCoords, ...orderedStops.map((s) => s.coords)]
        const coords = coordsToString(Allcords);

        const url =
            `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}` +
            `?steps=true&overview=full&geometry=geojson&language=da` +
            `?access_token=${token}`;

        const res = await fetch(url);
        const data = await res.json();
        if(data.code !== "Ok") throw new Error(data.message);

        const route = data.routes[0];

        const steps = [];
        route.legs.forEach((leg, legIdx) => {
            leg.steps.forEach((step) => {
                steps.push({
                    legIndex: legIdx,
                    instruction: step.maneuver.instruction,
                    distance: step.distance,
                    duration: step.duration,
                    location: step.maneuver.location,
                });
            });
        });

        return { geometry: route.geometry, steps, ... };
    }
}