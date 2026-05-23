import {useEffect, useState} from "react";
import {useAuth} from "../../../../../context/useAuth.js";
import {expenditureApi} from "../lib/expenditureApi.js";

export function useExpenditureData() {

    const { session } = useAuth();

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        expenditureApi.getAllByUserId(session.user.id)
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
    }, [session]);

    return { data, error, isLoading }
}