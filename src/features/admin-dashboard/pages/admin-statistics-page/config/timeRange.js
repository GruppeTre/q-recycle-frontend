export const timeRange = {
    LAST_MONTH: {
        label: "Seneste måned",
        getDate: () => {
            const date = new Date();

            date.setHours(0, 0, 0, 0);

            date.setMonth(date.getMonth() - 1)

            return date;
        }
    },

    LAST_YEAR: {
        label: "Seneste år",
        getDate: () => {
            const date = new Date();

            date.setHours(0, 0, 0, 0);

            date.setFullYear(date.getFullYear() - 1);

            return date;
        }
    },

    ALL_TIME: {
        label: "Alle data",
        getDate: () => {

            const date = new Date();

            date.setTime(0);

            return date;
        }
    }
}