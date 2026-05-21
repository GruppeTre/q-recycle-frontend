import { useEffect, useState } from "react";
import { routesApi } from "../../../lib/routesApi.js"

function RoutesList() {
    const [ routes, setRoutes ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let cancelled = false;

        routesApi.fetchAll({sinceDate: startOfMonth})
            .then((data) => {
                if(!cancelled) {
                    setRoutes(data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if(!cancelled) {
                    setError(err.message);
                    setLoading(false);
                }
            });

        return () => { cancelled = true; };
    }, []);

    if (loading) return <p className="text-text-muted">Indlæser ruter...</p>;
    if (error) return <p className="text-text-muted">Fejl: {error}</p>;
    if (routes.length === 0) return <p className="text-text-muted">Ingen ruter endnu</p>

    return (
        <ul className="flex flex-col gap-2">
            {routes.map((route) => (
                <RouteCard key={route.id} route={route} />
            ))}
        </ul>
    )

    function RouteCard ({ route }) {
        const date = new Date(route.started_at).toLocaleString("da-DK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        const statusLabel = route.active
        ? "Aktiv"
        : route.archived
        ? "Arkiveret"
        : "Afsluttet";

        const statusColor = route.archived
        ? "bg-primary-bg text-primary border-primary/40"
        : "bg-surface text-text-muted border-border";

        return (
            <li className="p-4 round-lg border border-border bg-surface">
                <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-semibold text-text">{date}</div>
                    <span className={`text-xs px-2 py-0.5 rounded border ${statusColor}`}>{statusLabel}</span>
                </div>
                <div className="text-xs text-text-muted">
                    Rute-ID: <span className="font-mono">{route.id.slice(0, 8)}</span>
                </div>
            </li>
        )
    }
}

export default RoutesList;