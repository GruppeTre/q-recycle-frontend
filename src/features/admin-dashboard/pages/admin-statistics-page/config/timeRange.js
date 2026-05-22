export const timeRange = {
    LAST_MONTH: {
        label: "Last month",
        getDate: () => {
            const date = new Date();

            date.setHours(0, 0, 0, 0);

            date.setMonth(date.getMonth() - 1)

            return date;
        }
    },

    LAST_YEAR: {
        label: "Last year",
        getDate: () => {
            const date = new Date();

            date.setHours(0, 0, 0, 0);

            date.setFullYear(date.getFullYear() - 1);

            return date;
        }
    },

    ALL_TIME: {
        label: "All time",
        getDate: () => {

            const date = new Date();

            date.setTime(0);

            return date;
        }
    }
}