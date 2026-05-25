import {useEffect, useState} from "react";
import {useAuth} from "../../../../../context/useAuth.js";
import {expenditureApi} from "../../../../../lib/expenditureApi.js";

export function useExpenditureData() {

    const { session } = useAuth();

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        expenditureApi.getAllByUserId(session.user.id)
            .then(data => {

                data = data.map(expenditure => ({
                    ...expenditure,
                    created_at: new Date(expenditure.created_at).toLocaleDateString('en-GB')
                }));

                setData(data.sort((a, b) => {
                    if (a.is_pending !== b.is_pending) {
                        return a.is_pending ? -1 : 1;
                    } else {
                        return a.created_at > b.created_at ? -1 : 1;
                    }
                }));
                setError(null);
            }).catch(error => {
                console.error(error);
                setError('Noget gik galt, prøv igen senere');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [session]);

    const deleteExpenditure = async (id) => {
        await expenditureApi.deleteById(id);
        setData(prevState => prevState.filter(e => e.id !== id));
    }

    const addExpenditure = async (expenditure) => {
        const response = await expenditureApi.add(expenditure);

        if (response.status !== 201) {
            console.error(JSON.stringify(response));
            throw new Error('something went wrong');
        }
    }

    return { data, error, isLoading, deleteExpenditure, addExpenditure }
}