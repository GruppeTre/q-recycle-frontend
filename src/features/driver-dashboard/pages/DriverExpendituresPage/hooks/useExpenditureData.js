import {useEffect, useState} from "react";
import {useAuth} from "../../../../../context/useAuth.js";

export function useExpenditureData() {

    const { session } = useAuth();

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

    }, [session]);

    return { data: [], error: null, isLoading: false }
}