import {useEffect, useState} from "react";
import {useAuth} from "../../../../../context/useAuth.js";
import {expenditureApi} from "../../../../../lib/expenditureApi.js";

const sortExpenditures = (a, b) => {
    if (a.is_pending !== b.is_pending) return a.is_pending ? -1 : 1;
    return new Date(b.created_at) - new Date(a.created_at);
};

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
                    formatted_date: new Date(expenditure.created_at).toLocaleDateString('en-GB')
                }));

                setData(data.sort(sortExpenditures));
                setError(null);
            }).catch(error => {
                console.error(error);
                setError('Noget gik galt, prøv igen senere');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [session?.user?.id]);

    const deleteExpenditure = async (id) => {
        await expenditureApi.deleteById(id);
        setData(prevState => prevState.filter(e => e.id !== id));
    }

    const addExpenditure = async (expenditure) => {

        try {
            const data = await expenditureApi.add(expenditure);

            const formatted = { ...data, formatted_date: new Date(data.created_at).toLocaleDateString('en-GB') };

            setData(prevState => [...prevState, formatted].sort(sortExpenditures));
        } catch (e) {
            console.error(e);
            setError(e);
        }
    }

    return { data, error, isLoading, deleteExpenditure, addExpenditure }
}