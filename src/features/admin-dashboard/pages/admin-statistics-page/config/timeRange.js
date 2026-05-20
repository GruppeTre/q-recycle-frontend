export const timeRange = {
    LAST_MONTH: {
        label: "Last month",
        getDate: () => {
            const date = new Date();

            date.setMonth(date.getMonth() - 1);

            return date;
        }
    },

    LAST_YEAR: {
        label: "Last year",
        getDate: () => {
            const date = new Date();

            date.setFullYear(date.getFullYear() - 1);

            return date;
        }
    },

    ALL_TIME: {
        label: "All time",
        getDate: () => {
            return null;
        }
    }
}