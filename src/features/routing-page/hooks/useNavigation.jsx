import {useEffect, useRef, useMemo, useState} from "react";

function haversine(a, b) {
    const toRad = (d) => (d * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(b[1] - a[1]);
    const dLng = toRad(b[0] - a[0]);
    const lat1 = toRad(a[1]);
    const lat2 = toRad(b[1]);
    const h = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/ 2 ) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
}

export function useNavigation({ steps, driverPosition, speak, active}) {
    const [currentStepIdx, setCurrentStepIdx] = useState(0);

    const prevStepsRef = useRef(steps);
    if (prevStepsRef.current !== steps) {
        prevStepsRef.current = steps;
        setCurrentStepIdx(0);
    }

    useEffect(() => {
        if(!active || !driverPosition || !steps?.length) return;
        if(currentStepIdx >= steps.length - 1) return;

        const next = steps[currentStepIdx + 1];
        const distToNext = haversine(driverPosition, next.location);

        if(distToNext < 50) {
            setCurrentStepIdx((i) => i + 1);
        }
    }, [driverPosition, steps, currentStepIdx, active]);

    const currentStep = steps?.[currentStepIdx];
    useEffect(() => {
        if(!active || !currentStep) return;
        speak(currentStep.instruction);
    }, [currentStep, speak, active]);

    const distanceToNext = useMemo(() => {
        if(!driverPosition || !currentStep) return null;
        return haversine(driverPosition, currentStep.location);
    }, [driverPosition, currentStep]);

    return {currentStep, currentStepIdx, totalSteps: steps?.length ?? 0,
    distanceToNext,};
}