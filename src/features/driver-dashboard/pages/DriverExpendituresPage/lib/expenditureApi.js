import {expenditure} from "../../../../../lib/expenditure.js";

export const expenditureApi = {
    getAllByUserId: async (userId) => {
        try {
            //fetch
            const data = await expenditure.getAllByUserId(userId);

            console.log(`fetched data: ${JSON.stringify(data)}`);

            return { data: data, error: null }
        } catch (e) {
            return { data: null, error: e }
        }
    }
}