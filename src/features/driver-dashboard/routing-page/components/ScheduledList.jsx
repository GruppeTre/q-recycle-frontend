import { useState } from 'react';

export function ScheduledList( {pickups, onComplete, onRevert, onClose, onFinishRoute}) {
    const allCompleted = pickups.length > 0 && pickups.every((p) => p.status === 'completed');

    return (
        <div className="absolute inset-0 z-20 bg-background/95 backdrop-blur flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text">
                    Ruteoversigt ({pickups.length} stop)
                </h2>
                <button
                    onClick={onClose}
                    className="text-xs px-3 py-1.5 rounded bg-surface hover:bg-surface-hover transition">
                    Luk
                </button>
            </div>
            <ul className="flex-1 overflow-y-auto p-4 space-y-2">
                {pickups.map((p) => (
                    <PickupRow
                        key={p.id}
                        pickup={p}
                        onComplete={onComplete}
                        onRevert={onRevert}
                    />
                ))}
            </ul>
            {/* Complete route button, only active when all stops are completed */}
            <div className="shrink-0 p-4 border-t border-border">
                <button
                    onClick={onFinishRoute}
                    disabled={!allCompleted}
                    className="w-full py-3 rounded-md font-semibold bg-primary text-text hover:bg-primary-hover disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    {allCompleted
                        ? "Færdiggør rute"
                        : `Færdiggør rute (${pickups.filter(p => p.status === "completed").length}/${pickups.length} klar)`
                    }
                </button>
            </div>
        </div>
    )
}

function PickupRow({ pickup, onComplete, onRevert }) {
    const [expanded, setExpanded] = useState(false);
    const [bagInput, setBagInput] = useState(String(pickup.bags));
    const [saving, setSaving] = useState(false);

    const isCompleted = pickup.status === 'completed';

    async function handleComplete() {
        const n = parseInt(bagInput, 10);
        if(!Number.isFinite(n) || n < 1) return
        setSaving(true);
        try{
            await onComplete(pickup.id, n);
            setExpanded(false);
        } finally {
            setSaving(false);
        }
    }

    async function handleRevert() {
        setSaving(true);
        try {
            await onRevert(pickup.id);
            setExpanded(true);
        } finally {
            setSaving(false);
        }
    }

    return (
        <li
            className={"rounded-lg border transition" +
                (isCompleted
                    ? "bg-success-bg bg-success/40"
                    : "bg-surface border-border"
                )
            }
        >
            {/* HEADER ROW */}
            <button
                onClick={() => setExpanded((e) => !e)}
                className="w-full flex items-center gap-3 p-3 text-left"
            >
                <div className="shrink-0 w-2 h-2 rounded-full"
                     style={{color: isCompleted ? 'var(--color-success)' : 'var(--color-primary)'}} />
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-text truncate">
                        {pickup.partner_name}
                    </div>
                    <div className="text-xs text-text-muted truncate">
                        {pickup.address}
                    </div>
                </div>
                <div className="text-xs text-text shrink-0">
                    {pickup.bags} {pickup.bags === 1 ? "pose" : "poser"}
                    {isCompleted && " ✓"}
                </div>
            </button>

            {/* Expanded Section */}
            {expanded && (
                <div className="px-3 pb-3 pt-1 border-t border-text-color">
                    <label className="block text-xs text-text-muted mb-1.5">
                        Antal afhentede poser
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min="1"
                            value={bagInput}
                            onChange={(e) => setBagInput(e.target.value)}
                            className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-text"
                        />
                        {isCompleted ? (
                            <button
                                onClick={handleRevert}
                                disabled={saving}
                                className="px-4 py-2 rounded bg-surface hover:bg-surface-hover text-text text-sm font-semibold disabled:opacity-40 transition"
                            >
                                Fortryd
                            </button>
                        ) : (
                        <button
                            onClick={handleComplete}
                            disabled={saving || !bagInput}
                            className="px-4 py-2 rounded bg-primary hover:bg-primary-hover text-text text-sm font-semibold disabled:opacity-40 transition"
                        >
                            {saving ? "..." : "Gennemfør"}
                        </button>
                        )}
                    </div>
                </div>
            )}
        </li>
    );
}