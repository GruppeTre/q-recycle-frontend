// Bottom panel during active navigation: big current instruction, distance to it,
// progress through steps.
//
// We format meters → friendly units. Below 1km use whole meters rounded to 10m;
// above 1km show one decimal place of km.
function formatDistance(m) {
    if (m == null) return "";
    if (m < 1000) return `${Math.round(m / 10) * 10} m`;
    return `${(m / 1000).toFixed(1)} km`;
}

export function NavigationPanel({ currentStep, currentStepIdx, totalSteps, distanceToNext }) {
    if (!currentStep) return null;

    return (
        <div className="bg-surface-primary backdrop-blur border-t border-border p-4">
            <div className="flex items-baseline justify-between mb-1">
                <div className="text-xs uppercase tracking-wider text-text-muted">
                    Trin {currentStepIdx + 1} / {totalSteps}
                </div>
                {distanceToNext != null && (
                    <div className="text-sm font-mono text-primary font-semibold">
                        {formatDistance(distanceToNext)}
                    </div>
                )}
            </div>
            <div className="text-lg font-semibold text-text">
                {currentStep.instruction}
            </div>
        </div>
    );
}