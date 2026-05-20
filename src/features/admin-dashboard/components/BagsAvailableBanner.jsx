import { useRequestedBagsCount } from "../hooks/useRequestedBagsCount.js";

function BagsAvailableBanner() {
    const { count, error } = useRequestedBagsCount();
    console.log(JSON.stringify(error));


    if (error) {
        return (
            <div className="px-gap-md py-gap-sm bg-red-100 text-sm text-red-700 border-b border-surface">
                Kunne ikke hente status for poser
            </div>
        );
    }

    if (count === null) return null;

    if (count === 0) {
        return (
            <div className="px-gap-md py-gap-sm bg-surface text-sm text-gray-600 border-b border-surface">
                Ingen poser klar til afhentning lige nu
            </div>
        );
    }

    return (
        <div className="px-gap-md py-gap-sm bg-green-100 text-sm text-green-800 border-b border-green-200">
            {count} {count === 1 ? 'pose' : 'poser'} klar til afhentning
        </div>
    );
}

export default BagsAvailableBanner;