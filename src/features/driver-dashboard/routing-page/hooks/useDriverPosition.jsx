import {useState, useEffect} from "react";

export function useDriverPosition(enabled = true) {
    const [position, setPosition] = useState(null);
    const [heading, setHeading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!enabled) return;
        if (!("geolocation" in navigator)) {
            setError("Geolocation is not supported");
            return
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setPosition([pos.coords.longitude, pos.coords.latitude]);
                if(pos.coords.heading != null && !isNan(pos.coords.heading)) {
                    setHeading(pos.coords.heading);
                }
                setError(null);
            },
            (err) => setError(err.message),
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 15000,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [enabled]);

    return {position, error};
}