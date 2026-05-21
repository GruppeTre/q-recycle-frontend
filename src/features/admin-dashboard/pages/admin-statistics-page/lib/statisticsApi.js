import {pickupRequest} from "../../../../../lib/pickupRequest.js";

export const statisticsApi = {

    getPickupData: async (cutoffDate) => {

        //fetch
        const data = await pickupRequest.getAllCompletedAfter(cutoffDate);

        //transform data into array with values fields 'name' and 'pickups', and combine pickups that happened on the same day
        return Object.values(
            data.reduce((acc, pickup) => {
                const date = new Date(pickup.completed_at).toLocaleDateString('en-GB');
                acc[date] ??= {name: date, pickups: 0}
                acc[date].pickups += pickup.bags;
                return acc;
            }, {})
        );
    },

    getBagsByPartner: (cutoffDate) => {
        return mockBagsByPartnerData;
    },

    getExpenses: (cutoffDate) => {
        return mockExpenses;
    }
}

export const mockPickupData = [
    {
        name: '03/04/26',
        pickups: 14,
    },
    {
        name: '09/04/26',
        pickups: 12,
    },
    {
        name: '17/04/26',
        pickups: 17,
    },
    {
        name: '23/04/26',
        pickups: 18,
    },
    {
        name: '30/04/26',
        pickups: 28,
    },
    {
        name: '01/05/26',
        pickups: 16,
    },
    {
        name: '07/05/26',
        pickups: 21,
    },    {
        name: '13/05/26',
        pickups: 15,
    },    {
        name: '21/05/26',
        pickups: 19,
    },
]

export const mockBagsByPartnerData = [
    {
        name: "7-eleven Nørrebro",
        amount: 89,
    },
    {
        name: "McDonald's Rådhuspladsen",
        amount: 34,
    },
    {
        name: "Burger-King Nørreport",
        amount: 56,
    },
    {
        name: "Hulk Burger",
        amount: 56,
    },
    {
        name: "Den store kebab",
        amount: 56,
    },
    {
        name: "MEGA PIZZA",
        amount: 56,
    },
]

export const mockExpenses = [
    {
        name: '03/04/26',
        amount: 40,
    },
    {
        name: '09/04/26',
        amount: 33,
    },
    {
        name: '17/04/26',
        amount: 87,
    },
    {
        name: '23/04/26',
        amount: 76,
    },
    {
        name: '30/04/26',
        amount: 56,
    },
    {
        name: '01/05/26',
        amount: 66,
    },
    {
        name: '07/05/26',
        amount: 104,
    },
]