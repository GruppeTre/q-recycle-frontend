import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

import { useMapBox } from "./hooks/useMapBox.jsx";
import { useDriverPosition } from "./hooks/useDriverPosition.jsx";
import { useSpeech } from "./hooks/useSpeech.jsx";
import { useNavigation } from "./hooks/useNavigation.jsx";

import { pickupApi } from "./api/pickupApi.js";
import { mapboxApi } from "./lib/mapboxApi.js";
import {
    renderPickupMarkers,
    renderRoute,
    clearRoute,
    renderDriverDot,
} from "./lib/mapRenderers.js";

import { PickupList } from "./components/PickupList.jsx";
import { NavigationPanel } from "./components/NavigationPanel.jsx";

const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Three phases of the screen, controlled by the `phase` state:
//   "selecting"    → showing pickup list, driver picks which to include
//   "navigating"   → route is drawn, GPS dot tracking, TTS active
//   (no separate "loading" phase — we use a `busy` flag overlay)

console.log('Token:', token ? token.slice(0, 12) + '...' : 'MISSING');

export default function MapApp() {
    // --- map setup ---
    const markersRef = useRef([]);       // pickup-stop markers (we clear/recreate these)
    const driverMarkerRef = useRef(null); // the blue GPS dot (we move it, not recreate)

    const { mapRef, mapReady, containerRef } = useMapBox(token);

    // --- data ---
    const [pickups, setPickups] = useState([]);
    const [loadingPickups, setLoadingPickups] = useState(true);
    const [selectedIds, setSelectedIds] = useState(new Set());

    // --- route + nav ---
    const [phase, setPhase] = useState("selecting");
    const [routeData, setRouteData] = useState(null); // { steps, durationMin, distanceKm, orderedStops }
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    // --- GPS + TTS ---
    // Only track GPS while we're actually navigating — save battery.
    const { position: driverPosition, error: gpsError } = useDriverPosition(phase === "navigating");
    const { speak, cancel: cancelSpeech } = useSpeech({ lang: "da-DK", rate: 1.0 });

    const { currentStep, currentStepIdx, totalSteps, distanceToNext } = useNavigation({
        steps: routeData?.steps,
        driverPosition,
        speak,
        active: phase === "navigating",
    });

    // ------------------------------------------------------------------
    // Effect 1: fetch pending pickups once on mount
    // ------------------------------------------------------------------
    useEffect(() => {
        let cancelled = false;
        pickupApi
            .fetchPending()
            .then((data) => {
                if (!cancelled) {
                    setPickups(data);
                    setLoadingPickups(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message);
                    setLoadingPickups(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    // ------------------------------------------------------------------
    // Effect 2: render pickup markers when map ready + pickups loaded
    // (Only during "selecting" phase — during navigation we render the
    // ordered subset with numbers instead.)
    // ------------------------------------------------------------------
    useEffect(() => {
        if (!mapReady || phase !== "selecting") return;
        renderPickupMarkers(mapRef.current, pickups, markersRef, { numbered: false });
    }, [mapReady, pickups, phase, mapRef]);

    // ------------------------------------------------------------------
    // Effect 3: keep the driver dot in sync with GPS
    // ------------------------------------------------------------------
    useEffect(() => {
        if (!mapReady || !driverPosition) return;
        renderDriverDot(mapRef.current, driverPosition, driverMarkerRef);
    }, [mapReady, driverPosition, mapRef]);

    useEffect(() => {
        if (!mapReady) return;

        const map = mapRef.current;
        map.resize();

        // Also resize when the window changes
        const onResize = () => map.resize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [mapReady, mapRef]);

    // ------------------------------------------------------------------
    // Handlers
    // ------------------------------------------------------------------
    function toggleSelected(id) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    async function handleStartRoute() {
        if (!mapReady) return;
        if (selectedIds.size === 0) {
            setError("Vælg mindst én opsamling.");
            return;
        }
        if (!driverPosition) {
            // We need a starting point. Ask for the position once if we don't have it.
            // (useDriverPosition only watches while phase === "navigating", so we
            // bootstrap with a one-shot getCurrentPosition here.)
            try {
                const pos = await new Promise((resolve, reject) =>
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                    })
                );
                await buildAndStart([pos.coords.longitude, pos.coords.latitude]);
            } catch {
                setError("Kunne ikke hente din position. Tjek GPS-tilladelser.");
            }
            return;
        }
        await buildAndStart(driverPosition);
    }

    async function buildAndStart(startCoords) {
        setBusy(true);
        setError("");
        try {
            const selectedPickups = pickups.filter((p) => selectedIds.has(p.id));

            // 1. Get optimal ordering from Optimization API
            const opt = await mapboxApi.optimize(startCoords, selectedPickups);

            // 2. Get full turn-by-turn directions for that order
            const dir = await mapboxApi.directions(startCoords, opt.orderedStops);

            // 3. Persist that these pickups are now scheduled
            await pickupApi.markScheduled(opt.orderedStops.map((s) => s.id));

            // 4. Draw on the map
            const map = mapRef.current;
            renderRoute(map, dir.geometry);
            renderPickupMarkers(map, opt.orderedStops, markersRef, { numbered: true });

            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend(startCoords);
            opt.orderedStops.forEach((s) => bounds.extend(s.coords));
            map.fitBounds(bounds, { padding: 80, duration: 800 });

            // 5. Save and flip into navigation mode
            setRouteData({
                steps: dir.steps,
                durationMin: dir.durationMin,
                distanceKm: dir.distanceKm,
                orderedStops: opt.orderedStops,
            });
            setPhase("navigating");
        } catch (err) {
            setError(err.message || "Noget gik galt.");
        } finally {
            setBusy(false);
        }
    }

    function handleCancelRoute() {
        cancelSpeech();
        clearRoute(mapRef.current);
        renderPickupMarkers(mapRef.current, pickups, markersRef, { numbered: false });
        setRouteData(null);
        setPhase("selecting");
    }

    // ------------------------------------------------------------------
    // UI
    // ------------------------------------------------------------------

    return (
        <div className="h-screen flex flex-col bg-slate-950 text-slate-100">
            {/* Top panel: pickup selection (only in selecting phase) */}
            {phase === "selecting" && (
                <div className="shrink-0 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                                Ventende opsamlinger ({pickups.length})
                            </h2>
                            <div className="text-xs text-slate-400">
                                Valgt: <span className="text-amber-400 font-semibold">{selectedIds.size}</span>
                            </div>
                        </div>
                        <div className="max-h-[35vh] overflow-y-auto pr-1">
                            <PickupList
                                pickups={pickups}
                                selectedIds={selectedIds}
                                onToggle={toggleSelected}
                                loading={loadingPickups}
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <button
                                onClick={handleStartRoute}
                                disabled={!mapReady || busy || selectedIds.size === 0}
                                className="px-5 py-2.5 rounded-md font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                {busy ? "Bygger rute…" : "Start rute"}
                            </button>
                            {/* DEBUG — fjern senere */}
                            <div className="text-xs text-slate-400">
                                mapReady: {String(mapReady)} | busy: {String(busy)} | selected: {selectedIds.size}
                            </div>
                            {error && <span className="text-sm text-rose-400">{error}</span>}
                        </div>
                    </div>
                </div>
            )}

            {/* Map fills remaining space */}
            <div className="flex-1">
                <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

                {/* Top bar during navigation */}
                {phase === "navigating" && routeData && (
                    <div className="absolute top-3 left-3 right-3 bg-slate-900/90 backdrop-blur rounded-lg border border-slate-700 px-4 py-2 flex items-center justify-between">
                        <div className="text-sm">
                            <span className="text-slate-400">Rute:</span>{" "}
                            <span className="font-semibold">{routeData.orderedStops.length} stop</span>{" "}
                            <span className="text-slate-400">·</span>{" "}
                            <span className="font-mono">{routeData.distanceKm} km</span>{" "}
                            <span className="text-slate-400">·</span>{" "}
                            <span className="font-mono">{routeData.durationMin} min</span>
                        </div>
                        <button
                            onClick={handleCancelRoute}
                            className="text-xs px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 transition"
                        >
                            Afslut
                        </button>
                    </div>
                )}

                {/* GPS error overlay */}
                {gpsError && phase === "navigating" && (
                    <div className="absolute bottom-24 left-3 right-3 bg-rose-900/90 backdrop-blur rounded-lg border border-rose-700 px-4 py-2 text-sm">
                        GPS: {gpsError}
                    </div>
                )}
            </div>

            {/* Bottom navigation panel */}
            {phase === "navigating" && (
                <NavigationPanel
                    currentStep={currentStep}
                    currentStepIdx={currentStepIdx}
                    totalSteps={totalSteps}
                    distanceToNext={distanceToNext}
                />
            )}
        </div>
    );
}
