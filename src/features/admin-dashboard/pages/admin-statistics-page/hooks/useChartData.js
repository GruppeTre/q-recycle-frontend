import {useEffect, useState} from "react";

export function useChartData(fetchFunc, timeRange) {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFunc(timeRange.getDate())
            .then(result => {
                if (result.error) {
                    setError('Noget gik galt, prøv igen senere');
                } else {
                    setData(result.data);
                    setError(null);
                }
            }).catch(error => {
                console.error(error);
                setError('Noget gik galt, prøv igen senere');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [fetchFunc, timeRange]);

    return {data, error, isLoading}
}