export function PickupList({ pickups, selectedIds, onToggle, loading }) {
    if (loading) {
        return <p className="text-slate-400 text-sm">Indlæser opsamlinger…</p>;
    }

    if (!pickups.length) {
        return <p className="text-slate-400 text-sm">Ingen ventende opsamlinger.</p>;
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
                                    ? "bg-amber-500/15 border border-amber-500/40"
                                    : "bg-slate-800/60 border border-slate-700 hover:border-slate-500")
                            }
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onToggle(p.id)}
                                className="w-4 h-4 accent-amber-500"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-slate-100 truncate">
                                    {p.partner_name}
                                </div>
                                <div className="text-xs text-slate-400 truncate">{p.address}</div>
                            </div>
                            <div className="text-xs text-slate-300 shrink-0 px-2 py-0.5 rounded bg-slate-700">
                                {p.bags} {p.bags === 1 ? "pose" : "poser"}
                            </div>
                        </label>
                    </li>
                );
            })}
        </ul>
    );
}
