import {expenditure} from "../../../../../lib/expenditure.js";

export const expenditureApi = {
    getAllByUserId: async (userId) => {
        try {
            //fetch
            let data = await expenditure.getAllByUserId(userId);

            console.log(`fetched data: ${JSON.stringify(data)}`);

            data = data.map(expenditure => ({
                ...expenditure,
                    created_at: new Date(expenditure.created_at).toLocaleDateString('en-GB')
            }))

            return { data: data, error: null }
        } catch (e) {
            return { data: null, error: e }
        }
    }
}