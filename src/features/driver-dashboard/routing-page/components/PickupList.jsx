export function PickupList({ pickups, selectedIds, onToggle, loading }) {
    if (loading) {
        return <p className="text-text-muted text-sm">Indlæser opsamlinger…</p>;
    }

    if (!pickups.length) {
        return <p className="text-text-muted text-sm">Ingen ventende opsamlinger.</p>;
    }

    return (
        <ul className="flex flex-col gap-1.5">
            {pickups.map((p) => {
                const isSelected = selectedIds.has(p.id);
                return (
                    <li key={p.id}>
                        <label
                            className={
                                "flex items-center gap-3 p-3 rounded-md cursor-pointer transition " +
                                (isSelected
                                    ? "bg-background     border border-primary/40"
                                    : "bg-background border-border hover:bg-surface-hover")
                            }
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onToggle(p.id)}
                                className="w-4 h-4 accent-primary"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-text truncate">
                                    {p.partner_name}
                                </div>
                                <div className="text-xs text-text-muted truncate">{p.address}</div>
                            </div>
                            <div className="text-xs text-text shrink-0 px-2 py-0.5 rounded bg-background">
                                {p.bags} {p.bags === 1 ? "pose" : "poser"}
                            </div>
                        </label>
                    </li>
                );
            })}
        </ul>
    );
}
